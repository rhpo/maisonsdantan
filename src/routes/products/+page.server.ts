import type { PageServerLoad } from './$types';
import { listProducts } from '$lib/server/services/product.service';

export const load: PageServerLoad = async ({ url }) => {
	const category = url.searchParams.get('category') ?? 'all';
	const shape = url.searchParams.get('shape') ?? 'all';
	const sort = (url.searchParams.get('sort') ?? 'date') as 'date' | 'name' | 'popularity';
	const q = url.searchParams.get('q') ?? '';
	const page = parseInt(url.searchParams.get('page') ?? '1');
	const limit = 25;

	const { products, total } = await listProducts({ category, shape, sort, q, page, limit });

	return { products, total, page, limit, filters: { category, shape, sort, q } };
};
