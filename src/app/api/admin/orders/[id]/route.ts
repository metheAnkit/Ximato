import { orders } from "@/db";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isFinite(orderId)) {
    return Response.json({ error: "Invalid id." }, { status: 400 });
  }

  const parsed = statusSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid status." }, { status: 400 });
  }

  const updated = await orders.findOneAndUpdate(
    { id: orderId },
    { $set: { status: parsed.data.status, updatedAt: new Date() } },
    { returnDocument: "after" },
  );

  if (!updated) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }

  return Response.json({ ok: true, status: updated!.status });
}
