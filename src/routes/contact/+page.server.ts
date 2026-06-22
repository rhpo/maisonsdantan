import type { Actions } from './$types';
import { createMessage } from '$lib/server/db/messages';
import { notify } from '$lib/server/services/notification.service';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		const email = data.get('email')?.toString().trim();
		const phone = data.get('phone')?.toString().trim() ?? '';
		const message = data.get('message')?.toString().trim();

		if (!name || !email || !message) {
			return fail(400, { error: 'Veuillez remplir tous les champs obligatoires.' });
		}

		try {
			await createMessage({ name, email, phone, message });
			await notify(`Message de ${name}`, message.slice(0, 200)).catch(() => {});
			return { success: true };
		} catch (e) {
			console.error(e);
			return fail(500, { error: 'Erreur lors de l\'envoi. Réessayez.' });
		}
	}
};
