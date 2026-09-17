import { MongoClient, type Collection, type Db } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://localhost:27017/";
const databaseName = process.env.MONGODB_DB ?? "Ximato";

type MongoGlobals = typeof globalThis & {
	__ximatoMongoClient?: MongoClient;
	__ximatoMongoDatabase?: Db;
};

const globals = globalThis as MongoGlobals;
export const client = globals.__ximatoMongoClient ?? new MongoClient(uri);
export const database = globals.__ximatoMongoDatabase ?? client.db(databaseName);

if (process.env.NODE_ENV !== "production") {
	globals.__ximatoMongoClient = client;
	globals.__ximatoMongoDatabase = database;
}

export type CategoryDocument = {
	id: number;
	name: string;
	slug: string;
	description: string | null;
	emoji: string;
	sortOrder: number;
	createdAt: Date;
};

export type MenuItemDocument = {
	id: number;
	categoryId: number;
	name: string;
	slug: string;
	description: string | null;
	price: number;
	imageUrl: string | null;
	emoji: string;
	isVegetarian: boolean;
	isAvailable: boolean;
	isFeatured: boolean;
	prepTimeMinutes: number;
	createdAt: Date;
	updatedAt: Date;
};

export type OrderItemDocument = {
	id: number;
	menuItemId: number | null;
	name: string;
	price: number;
	quantity: number;
};

export type OrderDocument = {
	id: number;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	deliveryAddress: string;
	notes: string | null;
	status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
	paymentMethod: string;
	subtotal: number;
	deliveryFee: number;
	tax: number;
	total: number;
	createdAt: Date;
	updatedAt: Date;
	items: OrderItemDocument[];
};

export const categories: Collection<CategoryDocument> = database.collection("categories");
export const menuItems: Collection<MenuItemDocument> = database.collection("menuItems");
export const orders: Collection<OrderDocument> = database.collection("orders");
export const counters = database.collection<{ _id: string; value: number }>("counters");

export async function connectDatabase() {
	await client.connect();
	return database;
}

export async function nextId(counter: string) {
	const result = await counters.findOneAndUpdate(
		{ _id: counter },
		{ $inc: { value: 1 } },
		{ upsert: true, returnDocument: "after" },
	);
	return result!.value;
}

export async function ensureIndexes() {
	await connectDatabase();
	await Promise.all([
		categories.createIndex({ slug: 1 }, { unique: true }),
		menuItems.createIndex({ slug: 1 }, { unique: true }),
		menuItems.createIndex({ categoryId: 1 }),
		orders.createIndex({ customerEmail: 1 }),
	]);
}
