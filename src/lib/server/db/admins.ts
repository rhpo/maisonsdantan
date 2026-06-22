import { db } from './client';
import type { AdminUser, AdminStatus } from '$lib/types';

export async function getAdminUser(userId: string): Promise<AdminUser | null> {
	const { data, error } = await db.from('admin_users').select('*').eq('id', userId).single();
	if (error) return null;
	return data as AdminUser;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
	const { data, error } = await db
		.from('admin_users')
		.select('*')
		.order('created_at', { ascending: true });
	if (error) throw error;
	return (data ?? []) as AdminUser[];
}

export async function upsertAdminUser(
	user: Pick<AdminUser, 'id' | 'email' | 'display_name' | 'photo_url'> & {
		status: AdminStatus;
	}
): Promise<AdminUser> {
	const { data, error } = await db.from('admin_users').upsert(user).select().single();
	if (error) throw error;
	return data as AdminUser;
}

export async function setAdminStatus(userId: string, status: AdminStatus): Promise<void> {
	const { error } = await db.from('admin_users').update({ status }).eq('id', userId);
	if (error) throw error;
}

export async function removeAdminUser(userId: string): Promise<void> {
	const { error } = await db.from('admin_users').delete().eq('id', userId);
	if (error) throw error;
}

export async function isAuthorizedAdmin(userId: string): Promise<boolean> {
	const user = await getAdminUser(userId);
	return user?.status === 'authorized';
}
