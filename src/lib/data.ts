import { categories, menuItems, orders, type CategoryDocument, type MenuItemDocument, type OrderDocument } from "@/db";
import type { Category, DashboardStats, MenuItem, Order } from "./types";

function mapCategory(row: CategoryDocument, itemCount = 0): Category {
  return { id: row.id, name: row.name, slug: row.slug, description: row.description, emoji: row.emoji, itemCount };
}

function mapMenuItem(row: MenuItemDocument, category?: CategoryDocument): MenuItem {
  return { id: row.id, categoryId: row.categoryId, name: row.name, slug: row.slug, description: row.description, price: row.price, imageUrl: row.imageUrl, emoji: row.emoji, isVegetarian: row.isVegetarian, isAvailable: row.isAvailable, isFeatured: row.isFeatured, prepTimeMinutes: row.prepTimeMinutes, categoryName: category?.name ?? null, categoryEmoji: category?.emoji ?? null, categorySlug: category?.slug ?? null };
}

function mapOrder(row: OrderDocument): Order {
  return { id: row.id, customerName: row.customerName, customerEmail: row.customerEmail, customerPhone: row.customerPhone, deliveryAddress: row.deliveryAddress, notes: row.notes, status: row.status, paymentMethod: row.paymentMethod, subtotal: row.subtotal, deliveryFee: row.deliveryFee, tax: row.tax, total: row.total, createdAt: row.createdAt.toISOString(), items: row.items };
}

export async function getCategories(): Promise<Category[]> {
  const [rows, itemCounts] = await Promise.all([categories.find().sort({ sortOrder: 1, name: 1 }).toArray(), menuItems.aggregate<{ _id: number; count: number }>([{ $group: { _id: "$categoryId", count: { $sum: 1 } } }]).toArray()]);
  const counts = new Map(itemCounts.map((item) => [item._id, item.count]));
  return rows.map((row) => mapCategory(row, counts.get(row.id) ?? 0));
}

export async function getMenuItems(categoryId?: number): Promise<MenuItem[]> {
  const rows = await menuItems.find(categoryId ? { categoryId } : {}).sort({ name: 1 }).toArray();
  const categoryRows = await categories.find({ id: { $in: rows.map((row) => row.categoryId) } }).toArray();
  const categoryById = new Map(categoryRows.map((row) => [row.id, row]));
  return rows.map((row) => mapMenuItem(row, categoryById.get(row.categoryId)));
}

export async function getFeaturedItems(): Promise<MenuItem[]> {
  const rows = await menuItems.find({ isFeatured: true }).sort({ name: 1 }).toArray();
  const categoryRows = await categories.find({ id: { $in: rows.map((row) => row.categoryId) } }).toArray();
  const categoryById = new Map(categoryRows.map((row) => [row.id, row]));
  return rows.map((row) => mapMenuItem(row, categoryById.get(row.categoryId)));
}

export async function getMenuItemBySlug(slug: string): Promise<MenuItem | null> {
  const row = await menuItems.findOne({ slug });
  if (!row) return null;
  return mapMenuItem(row, await categories.findOne({ id: row.categoryId }) ?? undefined);
}

export async function getMenuItemById(id: number): Promise<MenuItem | null> {
  const row = await menuItems.findOne({ id });
  if (!row) return null;
  return mapMenuItem(row, await categories.findOne({ id: row.categoryId }) ?? undefined);
}

export async function getOrderById(id: number): Promise<Order | null> {
  const row = await orders.findOne({ id });
  return row ? mapOrder(row) : null;
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const rows = await orders.find({ customerEmail: email.trim().toLowerCase() }).sort({ createdAt: -1 }).toArray();
  return rows.map(mapOrder);
}

export async function getAllOrders(): Promise<Order[]> {
  return (await orders.find().sort({ createdAt: -1 }).toArray()).map(mapOrder);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalOrders, totalRevenue, activeOrders, totalItems] = await Promise.all([
    orders.countDocuments(),
    orders.aggregate<{ value: number }>([{ $match: { status: { $ne: "cancelled" } } }, { $group: { _id: null, value: { $sum: "$total" } } }]).toArray(),
    orders.countDocuments({ status: { $in: ["pending", "confirmed", "preparing", "out_for_delivery"] } }),
    menuItems.countDocuments(),
  ]);
  return { totalOrders, totalRevenue: totalRevenue[0]?.value ?? 0, activeOrders, totalItems };
}
