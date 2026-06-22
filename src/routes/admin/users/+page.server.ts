import type { PageServerLoad, Actions } from './$types';
import { getAdminUsers, setAdminStatus, removeAdminUser } from '$lib/server/db/admins';
import { createLog } from '$lib/server/db/logs';
import { requireAdmin } from '$lib/server/guards/admin';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);
	const users = await getAdminUsers();
	return { users };
};

export const actions: Actions = {
	authorize: async (event) => {
		const adminId = await requireAdmin(event);
		const data = await event.request.formData();
		const userId = data.get('userId')?.toString();
		const name = data.get('name')?.toString() ?? '';
		if (!userId) return fail(400);
		await setAdminStatus(userId, 'authorized');
		await createLog(adminId, 'Admin', `A autorisé ${name}`);
		return { success: true };
	},
	revoke: async (event) => {
		const adminId = await requireAdmin(event);
		const data = await event.request.formData();
		const userId = data.get('userId')?.toString();
		const name = data.get('name')?.toString() ?? '';
		if (!userId) return fail(400);
		await removeAdminUser(userId);
		await createLog(adminId, 'Admin', `A retiré l'accès à ${name}`);
		return { success: true };
	}
};
