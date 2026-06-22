import * as productsDb from '$lib/server/db/products';
import { uploadImage } from './upload.service';
import { createLog } from '$lib/server/db/logs';
import type { Product, ProductFilters, ProductCategory, ProductShape } from '$lib/types';

export async function listProducts(
	filters: ProductFilters
): Promise<{ products: Product[]; total: number }> {
	return productsDb.getProducts(filters);
}

export async function getProduct(id: number): Promise<Product | null> {
	return productsDb.getProduct(id);
}

export interface AddProductInput {
	name: string;
	description: string;
	category: ProductCategory;
	shape: ProductShape;
	models: {
		name: string;
		imageFile: File;
		shootingFiles: File[];
	}[];
}

export async function addProduct(
	input: AddProductInput,
	actorId: string,
	actorName: string
): Promise<Product> {
	const product = await productsDb.createProduct({
		name: input.name,
		description: input.description,
		category: input.category,
		shape: input.shape
	});

	for (const m of input.models) {
		const modelImagePath = await uploadImage(m.imageFile, `products/${product.id}/models`);
		const model = await productsDb.createModel({
			product_id: product.id,
			name: m.name,
			image: modelImagePath
		});

		for (const sf of m.shootingFiles) {
			const shootingPath = await uploadImage(sf, `products/${product.id}/shootings`);
			await productsDb.createShooting({
				id: crypto.randomUUID(),
				model_id: model.id,
				image: shootingPath
			});
		}
	}

	await createLog(actorId, actorName, `A ajouté le produit "${input.name}"`);
	return product;
}

export async function removeProduct(
	id: number,
	actorId: string,
	actorName: string
): Promise<void> {
	await productsDb.deleteProduct(id);
	await createLog(actorId, actorName, `A supprimé le produit ${id}`);
}
