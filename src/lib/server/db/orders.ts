import { db } from './client';
import type { Order } from '$lib/types';

export async function getOrders(): Promise<Order[]> {
	const { data, error } = await db
		.from('orders')
		.select('*')
		.order('created_at', { ascending: false });
	if (error) throw error;
	return (data ?? []) as Order[];
}

export async function getOrder(id: number): Promise<Order | null> {
	const { data, error } = await db.from('orders').select('*').eq('id', id).single();
	if (error) return null;
	return data as Order;
}

export async function createOrder(
	order: Omit<Order, 'id' | 'read' | 'pending' | 'created_at'>
): Promise<Order> {
	const { data, error } = await db
		.from('orders')
		.insert({ ...order, read: false, pending: true })
		.select()
		.single();
	if (error) throw error;
	return data as Order;
}

export async function markOrderRead(id: number): Promise<void> {
	const { error } = await db.from('orders').update({ read: true }).eq('id', id);
	if (error) throw error;
}

export async function markAllOrdersRead(): Promise<void> {
	const { error } = await db.from('orders').update({ read: true }).eq('read', false);
	if (error) throw error;
}

export async function completeOrder(id: number): Promise<void> {
	const { error } = await db.from('orders').update({ pending: false }).eq('id', id);
	if (error) throw error;
}

export async function deleteOrder(id: number): Promise<void> {
	const { error } = await db.from('orders').delete().eq('id', id);
	if (error) throw error;
}
