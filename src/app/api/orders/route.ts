import { menuItems, nextId, orders } from "@/db";
import { z } from "zod";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  TAX_RATE,
} from "@/lib/constants";
import { round2 } from "@/lib/format";
import { getOrdersByEmail } from "@/lib/data";

export const dynamic = "force-dynamic";

const orderItemInput = z.object({
  menuItemId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(50),
});

const createOrderSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  customerEmail: z.string().trim().email().max(200),
  customerPhone: z.string().trim().min(7).max(20),
  deliveryAddress: z.string().trim().min(5).max(300),
  notes: z.string().trim().max(500).nullable().optional(),
  paymentMethod: z.enum(["cash", "card", "wallet"]),
  items: z.array(orderItemInput).min(1).max(100),
});

function bad(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const parsed = createOrderSchema.safeParse(await request.json());
    if (!parsed.success) {
      return bad(parsed.error.issues[0]?.message ?? "Invalid input.");
    }
    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      notes,
      paymentMethod,
      items,
    } = parsed.data;

    // Load all requested menu items in a single query and index by id.
    const found = await menuItems.find({ id: { $in: items.map((i) => i.menuItemId) } }).toArray();
    const byId = new Map(found.map((m) => [m.id, m]));

    for (const line of items) {
      const menu = byId.get(line.menuItemId);
      if (!menu) return bad("One or more items no longer exist.");
      if (!menu.isAvailable) return bad(`"${menu.name}" is currently unavailable.`);
    }

    let subtotal = 0;
    for (const line of items) {
      subtotal += Number(byId.get(line.menuItemId)!.price) * line.quantity;
    }
    subtotal = round2(subtotal);
    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const tax = round2(subtotal * TAX_RATE);
    const total = round2(subtotal + deliveryFee + tax);

    const orderId = await nextId("order");
    await orders.insertOne({
      id: orderId,
        customerName,
        customerEmail: customerEmail.toLowerCase(),
        customerPhone,
        deliveryAddress,
        notes: notes ?? null,
        paymentMethod,
        status: "pending",
        subtotal,
        deliveryFee,
        tax,
        total,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: items.map((line, index) => {
        const menu = byId.get(line.menuItemId)!;
        return {
          id: index + 1,
          menuItemId: menu.id,
          name: menu.name,
          price: menu.price, // snapshot the price at order time
          quantity: line.quantity,
        };
        }),
      });

    return Response.json({ id: orderId }, { status: 201 });
  } catch (err) {
    console.error("POST /api/orders failed:", err);
    return bad("Failed to place your order.", 500);
  }
}

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email");
  if (!email || !email.trim()) return bad("Email is required.");
  const ordersList = await getOrdersByEmail(email);
  return Response.json({ orders: ordersList });
}
