import * as ordersDb from '$lib/server/db/orders';
import * as productsDb from '$lib/server/db/products';
import { createLog } from '$lib/server/db/logs';
import { notify } from './notification.service';
import type { Order, OrderInfo, CartItem } from '$lib/types';

export async function listOrders(): Promise<Order[]> {
	return ordersDb.getOrders();
}

export async function getOrder(id: number): Promise<Order | null> {
	return ordersDb.getOrder(id);
}

type CartPayload = Omit<CartItem, 'uuid' | 'product'>[];

export async function placeOrder(
	cart: CartPayload,
	info: OrderInfo
): Promise<{ order: Order; details: string[] }> {
	const order = await ordersDb.createOrder({ cart, info });

	for (const item of cart) {
		await productsDb.incrementOrdersCount(item.id).catch(() => {});
	}

	const details = await buildDetails(cart);
	const summary = details.join(', ');

	await notify(`Nouvelle commande #${order.id}`, `${info.name} — ${summary}`).catch(() => {});

	return { order, details };
}

async function buildDetails(cart: CartPayload): Promise<string[]> {
	return Promise.all(
		cart.map(async (item) => {
			const product = await productsDb.getProduct(item.id);
			const variant = product?.models?.find((m) => m.id === item.model);
			const vName = variant?.name ?? item.model.toString();
			return `${product?.name ?? item.id} (${vName}, ${item.width}×${item.height}) en ${item.material}`;
		})
	);
}

export async function markAllRead(actorId: string, actorName: string): Promise<void> {
	await ordersDb.markAllOrdersRead();
	await createLog(actorId, actorName, 'A lu toutes les commandes');
}

export async function completeOrder(
	id: number,
	actorId: string,
	actorName: string
): Promise<void> {
	await ordersDb.completeOrder(id);
	await createLog(actorId, actorName, `A complété la commande ${id}`);
}

export async function removeOrder(id: number, actorId: string, actorName: string): Promise<void> {
	await ordersDb.deleteOrder(id);
	await createLog(actorId, actorName, `A supprimé la commande ${id}`);
}
