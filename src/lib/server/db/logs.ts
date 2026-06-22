import { db } from './client';
import type { Log } from '$lib/types';

export async function getLogs(): Promise<Log[]> {
	const { data, error } = await db
		.from('logs')
		.select('*, admin_users(display_name, email)')
		.order('created_at', { ascending: false })
		.limit(500);
	if (error) throw error;
	return (data ?? []) as Log[];
}

export async function createLog(
	userId: string | null,
	userName: string,
	action: string
): Promise<void> {
	const { error } = await db
		.from('logs')
		.insert({ user_id: userId, user_name: userName, action });
	if (error) console.error('Log insert failed:', error.message);
}
