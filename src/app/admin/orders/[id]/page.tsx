import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { getOrderById } from "@/lib/data";
import StatusBadge from "@/components/StatusBadge";
import OrderStatusTimeline from "@/components/OrderStatusTimeline";
import OrderStatusControl from "@/components/admin/OrderStatusControl";
import { formatCurrency, formatDate } from "@/lib/format";
import { PAYMENT_LABELS, type PaymentMethod } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = Number(id);
  const order = Number.isFinite(orderId) ? await getOrderById(orderId) : null;
  if (!order) notFound();

  const paymentLabel =
    PAYMENT_LABELS[order.paymentMethod as PaymentMethod] ?? order.paymentMethod;

  return (
    <div>
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-orange-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-900">
            Order #{String(order.id).padStart(4, "0")}
          </h2>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <OrderStatusControl orderId={order.id} status={order.status} />
            <div className="mt-6 border-t border-slate-100 pt-6">
              <OrderStatusTimeline status={order.status} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-slate-900">Items</h3>
            <ul className="mt-4 divide-y divide-slate-100">
              {order.items.map((line) => (
                <li key={line.id} className="flex justify-between py-3 text-sm">
                  <span className="text-slate-600">
                    {line.quantity}× {line.name}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(line.price * line.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-2 space-y-1.5 border-t border-slate-100 pt-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Subtotal</dt>
                <dd>{formatCurrency(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Delivery fee</dt>
                <dd>
                  {order.deliveryFee === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatCurrency(order.deliveryFee)
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Tax</dt>
                <dd>{formatCurrency(order.tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold text-slate-900">
                <dt>Total</dt>
                <dd>{formatCurrency(order.total)}</dd>
              </div>
            </dl>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-slate-900">Customer</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Name</dt>
                <dd className="font-semibold text-slate-900">{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Email</dt>
                <dd className="font-semibold text-slate-900">{order.customerEmail}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-slate-500">
                  <Phone className="h-3.5 w-3.5" /> Phone
                </dt>
                <dd className="font-semibold text-slate-900">{order.customerPhone}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="h-3.5 w-3.5" /> Address
                </dt>
                <dd className="font-semibold text-slate-900">
                  {order.deliveryAddress}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Payment</dt>
                <dd className="font-semibold text-slate-900">{paymentLabel}</dd>
              </div>
              {order.notes && (
                <div>
                  <dt className="text-slate-500">Notes</dt>
                  <dd className="text-slate-700">{order.notes}</dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
