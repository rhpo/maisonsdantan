import { env } from '$env/dynamic/private';

const BASE_URL = 'https://alertzy.app/send';

async function send(title: string, message: string, key: string, group: string): Promise<void> {
	try {
		await fetch(BASE_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({ accountKey: key, title, message, group })
		});
	} catch (e) {
		console.error('Alertzy notification failed:', e);
	}
}

export async function notify(title: string, message: string): Promise<void> {
	const accountKey = env.ALERTZY_ACCOUNT_KEY;
	const ownerKey = env.ALERTZY_OWNER_KEY;

	await Promise.all([
		send(title, message, accountKey, "MAISONS D'ANTAN"),
		send(title, message, ownerKey, "MAISONS D'ANTAN")
	]);
}
