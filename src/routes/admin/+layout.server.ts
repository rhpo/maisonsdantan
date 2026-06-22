import type { LayoutServerLoad } from './$types';
import { requireAdmin } from '$lib/server/guards/admin';

export const load: LayoutServerLoad = async (event) => {
	if (event.url.pathname === '/admin/login') return {};
	const adminId = await requireAdmin(event);
	return { adminId };
};
