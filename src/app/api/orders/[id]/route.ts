import { getOrderById } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const orderId = Number(id);
  const order = Number.isFinite(orderId) ? await getOrderById(orderId) : null;

  if (!order) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }
  return Response.json({ order });
}
