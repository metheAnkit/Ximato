/** Order lifecycle. Kept in sync with `orderStatusEnum` in src/db/schema.ts. */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  emoji: string;
  /** Number of live menu items in this category (computed in data layer). */
  itemCount?: number;
}

export interface MenuItem {
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
  categoryName?: string | null;
  categoryEmoji?: string | null;
  categorySlug?: string | null;
}

/** A single line in the client-side shopping cart. */
export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  emoji: string;
  quantity: number;
}

export interface OrderLine {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  notes: string | null;
  status: OrderStatus;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  createdAt: string; // ISO string
  items: OrderLine[];
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeOrders: number;
  totalItems: number;
}
