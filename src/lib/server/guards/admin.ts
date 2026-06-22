import { redirect } from '@sveltejs/kit';
import { isAuthorizedAdmin } from '$lib/server/db/admins';
import type { RequestEvent } from '@sveltejs/kit';

export async function requireAdmin(event: RequestEvent): Promise<string> {
	const { session, user } = await event.locals.safeGetSession();

	if (!session || !user) {
		redirect(303, '/admin/login');
	}

	const authorized = await isAuthorizedAdmin(user.id);
	if (!authorized) {
		redirect(303, '/admin/login?status=unauthorized');
	}

	return user.id;
}
