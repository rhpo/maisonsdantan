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

		const variantCount = parseInt(data.get('variant_count')?.toString() ?? '0');

		// Each variant → one model. Its first shooting image doubles as the
		// model thumbnail; all selected files become its shootings.
		const models: { name: string; imageFile: File; shootingFiles: File[] }[] = [];
		for (let i = 0; i < variantCount; i++) {
			const vName = data.get(`variant_name_${i}`)?.toString().trim() || `Variant ${i + 1}`;
			const files = (data.getAll(`variant_shootings_${i}`) as File[]).filter(
				(f) => f && f.size > 0
			);
			if (files.length === 0) continue;
			models.push({ name: vName, imageFile: files[0], shootingFiles: files });
		}

		if (!name || !category || !shape || models.length === 0) {
			return fail(400, { error: 'Champs obligatoires manquants (nom, catégorie, forme, au moins un variant avec image).' });
		}

		try {
			await addProduct({ name, description, category, shape, models }, adminId, 'Admin');
			return { success: true };
		} catch (e) {
			console.error(e);
			return fail(500, { error: "Erreur lors de l'ajout du produit." });
		}
	}
};
