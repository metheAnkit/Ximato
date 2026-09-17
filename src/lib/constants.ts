import type { OrderStatus } from "./types";

export const RESTAURANT_NAME = "Ximato";
export const RESTAURANT_TAGLINE = "Fresh food, delivered fast.";

/** Flat delivery charge applied to every order under the free threshold. */
export const DELIVERY_FEE = 3.99;
/** Orders at or above this subtotal ship free. */
export const FREE_DELIVERY_THRESHOLD = 50;
/** Sales tax as a decimal (8.75%). */
export const TAX_RATE = 0.0875;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

/** Statuses that make up the active delivery timeline (cancelled is excluded). */
export const ORDER_STATUS_STEPS: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

export const PAYMENT_METHODS = ["cash", "card", "wallet"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash on delivery",
  card: "Credit / Debit card",
  wallet: "Digital wallet",
};
