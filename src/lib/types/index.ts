export type ProductCategory = 'living' | 'child' | 'kitchen' | 'room';
export type ProductShape = 'pattern' | 'pano';
export type Material = 'rouleau' | 'poster';
export type AdminStatus = 'authorized' | 'pending';

export interface Shooting {
	id: string;
	model_id: number;
	image: string;
}

export interface Model {
	id: number;
	product_id: number;
	name: string;
	image: string;
	shootings?: Shooting[];
}

export interface Product {
	id: number;
	name: string;
	description: string;
	category: ProductCategory;
	shape: ProductShape;
	orders_count: number;
	created_at: string;
	models?: Model[];
}

export interface CartItem {
	uuid: string;
	id: number;
	model: number;
	width: number;
	height: number;
	material: Material;
	crop: { x: number; y: number };
	product?: Product;
}

export interface OrderInfo {
	name: string;
	phone: string;
	email: string;
	address: string;
}

export interface Order {
	id: number;
	cart: Omit<CartItem, 'uuid' | 'product'>[];
	info: OrderInfo;
	read: boolean;
	pending: boolean;
	created_at: string;
}

export interface Message {
	id: number;
	name: string;
	email: string;
	phone: string;
	message: string;
	read: boolean;
	created_at: string;
}

export interface AdminUser {
	id: string;
	email: string;
	display_name: string;
	photo_url: string | null;
	status: AdminStatus;
	created_at: string;
}

export interface Log {
	id: number;
	user_id: string | null;
	user_name: string;
	action: string;
	created_at: string;
	admin_users?: Pick<AdminUser, 'display_name' | 'email'>;
}

export interface ProductFilters {
	category?: string;
	shape?: string;
	sort?: 'date' | 'name' | 'popularity';
	q?: string;
	page?: number;
	limit?: number;
}
