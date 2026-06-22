import { db } from './client';
import type { Product, ProductFilters } from '$lib/types';

function toUrl(path: string): string {
	if (!path || path.startsWith('http')) return path;
	return db.storage.from('media').getPublicUrl(path).data.publicUrl;
}

function withUrls(product: Product): Product {
	return {
		...product,
		models: (product.models ?? []).map((m) => ({
			...m,
			image: toUrl(m.image),
			shootings: (m.shootings ?? []).map((s) => ({ ...s, image: toUrl(s.image) }))
		}))
	};
}

export async function getProducts(
	filters: ProductFilters = {}
): Promise<{ products: Product[]; total: number }> {
	const { category, shape, sort = 'date', q, page = 1, limit = 25 } = filters;

	let query = db
		.from('products')
		.select('*, models(*, shootings(*))', { count: 'exact' });

	if (category && category !== 'all') query = query.eq('category', category);
	if (shape && shape !== 'all') query = query.eq('shape', shape);
	if (q) query = query.ilike('name', `%${q}%`);

	if (sort === 'date') query = query.order('created_at', { ascending: false });
	else if (sort === 'name') query = query.order('name', { ascending: true });
	else if (sort === 'popularity') query = query.order('orders_count', { ascending: false });

	const from = (page - 1) * limit;
	query = query.range(from, from + limit - 1);

	const { data, error, count } = await query;
	if (error) throw error;

	return { products: ((data ?? []) as Product[]).map(withUrls), total: count ?? 0 };
}

export async function getProduct(id: number): Promise<Product | null> {
	const { data, error } = await db
		.from('products')
		.select('*, models(*, shootings(*))')
		.eq('id', id)
		.single();

	if (error) return null;
	return withUrls(data as Product);
}

export async function createProduct(
	product: Omit<Product, 'id' | 'orders_count' | 'created_at'>
): Promise<Product> {
	const { data, error } = await db.from('products').insert(product).select().single();
	if (error) throw error;
	return data as Product;
}

export async function deleteProduct(id: number): Promise<void> {
	const { error } = await db.from('products').delete().eq('id', id);
	if (error) throw error;
}

export async function createModel(
	model: Omit<import('$lib/types').Model, 'id' | 'shootings'>
): Promise<import('$lib/types').Model> {
	const { data, error } = await db.from('models').insert(model).select().single();
	if (error) throw error;
	return data as import('$lib/types').Model;
}

export async function createShooting(shooting: {
	id: string;
	model_id: number;
	image: string;
}): Promise<import('$lib/types').Shooting> {
	const { data, error } = await db.from('shootings').insert(shooting).select().single();
	if (error) throw error;
	return data as import('$lib/types').Shooting;
}

export async function incrementOrdersCount(productId: number): Promise<void> {
	const { error } = await db.rpc('increment_orders_count', { product_id: productId });
	if (error) throw error;
}
