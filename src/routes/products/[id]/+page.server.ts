import type { PageServerLoad } from './$types';
import { getProduct } from '$lib/server/services/product.service';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const product = await getProduct(parseInt(params.id));
	if (!product) error(404, 'Produit introuvable');
	return { product };
};
