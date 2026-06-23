import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAdminUser, upsertAdminUser } from '$lib/server/db/admins';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/admin';

	if (code) {
		const { data, error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error && data.user) {
			const { user } = data;
			const existing = await getAdminUser(user.id);

			const OWNER_EMAIL = 'ramyhadid.js@gmail.com';
			const isOwner = user.email === OWNER_EMAIL;

			const profile = {
				id: user.id,
				email: user.email ?? '',
				display_name: user.user_metadata.full_name ?? user.email ?? '',
				photo_url: user.user_metadata.avatar_url ?? null
			};

			// Owner is always authorized, regardless of any prior row.
			if (isOwner) {
				await upsertAdminUser({ ...profile, status: 'authorized' });
				redirect(303, next);
			}

			if (!existing) {
				await upsertAdminUser({ ...profile, status: 'pending' });
				redirect(303, '/admin/login?status=pending');
			}

			if (existing.status === 'authorized') {
				redirect(303, next);
			}

			redirect(303, '/admin/login?status=pending');
		}
	}

	redirect(303, '/admin/login?status=error');
};
