import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { isAuthorizedAdmin } from '$lib/server/db/admins';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session, user } = await safeGetSession();
	if (session && user && (await isAuthorizedAdmin(user.id))) {
		redirect(303, '/admin');
	}
	return {};
};

export const actions: Actions = {
	login: async ({ locals: { supabase }, url }) => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${url.origin}/auth/callback`
			}
		});

		if (error) return { error: error.message };
		redirect(303, data.url);
	},
	logout: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		redirect(303, '/admin/login');
	}
};
