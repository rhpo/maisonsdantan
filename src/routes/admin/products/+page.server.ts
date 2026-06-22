import type { PageServerLoad, Actions } from './$types';
import { listProducts, removeProduct, addProduct } from '$lib/server/services/product.service';
import { requireAdmin } from '$lib/server/guards/admin';
import { fail } from '@sveltejs/kit';
import type { ProductCategory, ProductShape } from '$lib/types';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);
	const { products, total } = await listProducts({ limit: 200 });
	return { products, total };
};

export const actions: Actions = {
	delete: async (event) => {
		const adminId = await requireAdmin(event);
		const data = await event.request.formData();
		const id = parseInt(data.get('id')?.toString() ?? '');
		if (!id) return fail(400);
		await removeProduct(id, adminId, 'Admin');
		return { success: true };
	},

	add: async (event) => {
		const adminId = await requireAdmin(event);
		const data = await event.request.formData();

		const name = data.get('name')?.toString().trim();
		const description = data.get('description')?.toString().trim() ?? '';
		const category = data.get('category')?.toString() as ProductCategory;
		const shape = data.get('shape')?.toString() as ProductShape;
		const modelName = data.get('model_name')?.toString().trim() ?? 'Modèle 1';
		const modelImage = data.get('model_image') as File | null;
		const shootingFiles = data.getAll('shootings') as File[];

		if (!name || !category || !shape || !modelImage) {
			return fail(400, { error: 'Champs obligatoires manquants.' });
		}

		try {
			await addProduct(
				{
					name,
					description,
					category,
					shape,
					models: [{ name: modelName, imageFile: modelImage, shootingFiles }]
				},
				adminId,
				'Admin'
			);
			return { success: true };
		} catch (e) {
			console.error(e);
			return fail(500, { error: "Erreur lors de l'ajout du produit." });
		}
	}
};
