import type { PageServerLoad, Actions } from './$types';
import { getMessages, deleteMessage, markMessageRead } from '$lib/server/db/messages';
import { createLog } from '$lib/server/db/logs';
import { requireAdmin } from '$lib/server/guards/admin';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);
	const messages = await getMessages();
	return { messages };
};

export const actions: Actions = {
	delete: async (event) => {
		const adminId = await requireAdmin(event);
		const data = await event.request.formData();
		const id = parseInt(data.get('id')?.toString() ?? '');
		if (!id) return fail(400);
		await deleteMessage(id);
		await createLog(adminId, 'Admin', `A supprimé le message ${id}`);
		return { success: true };
	},
	markRead: async (event) => {
		await requireAdmin(event);
		const data = await event.request.formData();
		const id = parseInt(data.get('id')?.toString() ?? '');
		if (!id) return fail(400);
		await markMessageRead(id);
		return { success: true };
	}
};
