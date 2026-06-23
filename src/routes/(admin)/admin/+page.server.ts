import type { PageServerLoad } from './$types';
import { requireAdmin } from '$lib/server/guards/admin';
import { getOrders } from '$lib/server/db/orders';
import { getMessages } from '$lib/server/db/messages';
import { getProducts } from '$lib/server/db/products';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);

	const [orders, messages, productsResult] = await Promise.all([
		getOrders(),
		getMessages(),
		getProducts({ limit: 1000 })
	]);

	return {
		stats: {
			totalProducts: productsResult.total,
			totalOrders: orders.length,
			pendingOrders: orders.filter((o) => o.pending).length,
			unreadOrders: orders.filter((o) => !o.read).length,
			totalMessages: messages.length,
			unreadMessages: messages.filter((m) => !m.read).length
		},
		recentOrders: orders.slice(0, 5)
	};
};
