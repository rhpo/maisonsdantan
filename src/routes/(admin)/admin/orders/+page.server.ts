import type { PageServerLoad, Actions } from './$types';
import { listOrdersWithProducts, completeOrder, removeOrder, markAllRead } from '$lib/server/services/order.service';
import { requireAdmin } from '$lib/server/guards/admin';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);
	const orders = await listOrdersWithProducts();
	return { orders };
};

export const actions: Actions = {
	complete: async (event) => {
		const adminId = await requireAdmin(event);
		const data = await event.request.formData();
		const id = parseInt(data.get('id')?.toString() ?? '');
		if (!id) return fail(400);
		await completeOrder(id, adminId, 'Admin');
		return { success: true };
	},
	delete: async (event) => {
		const adminId = await requireAdmin(event);
		const data = await event.request.formData();
		const id = parseInt(data.get('id')?.toString() ?? '');
		if (!id) return fail(400);
		await removeOrder(id, adminId, 'Admin');
		return { success: true };
	},
	markAllRead: async (event) => {
		const adminId = await requireAdmin(event);
		await markAllRead(adminId, 'Admin');
		return { success: true };
	}
};
