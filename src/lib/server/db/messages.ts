import { db } from './client';
import type { Message } from '$lib/types';

export async function getMessages(): Promise<Message[]> {
	const { data, error } = await db
		.from('messages')
		.select('*')
		.order('created_at', { ascending: false });
	if (error) throw error;
	return (data ?? []) as Message[];
}

export async function createMessage(
	message: Omit<Message, 'id' | 'read' | 'created_at'>
): Promise<Message> {
	const { data, error } = await db
		.from('messages')
		.insert({ ...message, read: false })
		.select()
		.single();
	if (error) throw error;
	return data as Message;
}

export async function markMessageRead(id: number): Promise<void> {
	const { error } = await db.from('messages').update({ read: true }).eq('id', id);
	if (error) throw error;
}

export async function deleteMessage(id: number): Promise<void> {
	const { error } = await db.from('messages').delete().eq('id', id);
	if (error) throw error;
}
