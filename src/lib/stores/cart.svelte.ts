import type { CartItem, Material } from '$lib/types';

function createCart() {
	let items = $state<CartItem[]>([]);
	let orderId = $state<number | undefined>(undefined);

	return {
		get items() {
			return items;
		},
		get orderId() {
			return orderId;
		},
		get count() {
			return items.length;
		},
		init(stored: CartItem[], storedOrderId?: number) {
			items = stored;
			orderId = storedOrderId;
		},
		add(item: Omit<CartItem, 'uuid'>) {
			items = [...items, { ...item, uuid: crypto.randomUUID() }];
		},
		remove(uuid: string) {
			items = items.filter((i) => i.uuid !== uuid);
		},
		clear() {
			items = [];
			orderId = undefined;
		},
		setOrderId(id: number) {
			orderId = id;
			items = [];
		}
	};
}

export const cart = createCart();
