import type { Actions, PageServerLoad } from './$types';
import { placeOrder, getOrder } from '$lib/server/services/order.service';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
	const orderId = url.searchParams.get('order');
	if (!orderId) return { pendingOrder: null };

	const order = await getOrder(parseInt(orderId));
	return { pendingOrder: order };
};

export const actions: Actions = {
	order: async ({ request }) => {
		const data = await request.formData();
		const cartJson = data.get('cart')?.toString();
		const name = data.get('name')?.toString();
		const phone = data.get('phone')?.toString();
		const email = data.get('email')?.toString();
		const address = data.get('address')?.toString();

		if (!cartJson || !name || !phone || !email || !address) {
			return fail(400, { error: 'Veuillez remplir tous les champs.' });
		}

		let cartItems;
		try {
			cartItems = JSON.parse(cartJson);
		} catch {
			return fail(400, { error: 'Panier invalide.' });
		}

		if (!cartItems.length) {
			return fail(400, { error: 'Le panier est vide.' });
		}

		try {
			const { order, details } = await placeOrder(cartItems, { name, phone, email, address });
			return { success: true, orderId: order.id, details };
		} catch (e) {
			console.error(e);
			return fail(500, { error: 'Erreur lors de la commande. Réessayez.' });
		}
	}
};
