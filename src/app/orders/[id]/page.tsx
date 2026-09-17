import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, MapPin, Phone, Receipt } from "lucide-react";
import { getOrderById } from "@/lib/data";
import OrderStatusTimeline from "@/components/OrderStatusTimeline";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import { PAYMENT_LABELS, type PaymentMethod } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function OrderPage({
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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
            Order confirmed
          </h1>
          <p className="text-sm text-slate-500">
            Thanks, {order.customerName}! Here&apos;s your order.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-[1fr_260px]">
        <div className="space-y-5">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Order status</h2>
              <StatusBadge status={order.status} />
            </div>
            <div className="mt-6">
              <OrderStatusTimeline status={order.status} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Receipt className="h-5 w-5 text-orange-500" /> Items
            </h2>
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
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
              Order details
            </h2>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Order #</dt>
                <dd className="font-semibold text-slate-900">
                  {String(order.id).padStart(4, "0")}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Placed</dt>
                <dd className="font-semibold text-slate-900">
                  {formatDate(order.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Payment</dt>
                <dd className="font-semibold text-slate-900">{paymentLabel}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="h-3.5 w-3.5" /> Deliver to
                </dt>
                <dd className="font-semibold text-slate-900">
                  {order.deliveryAddress}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-slate-500">
                  <Phone className="h-3.5 w-3.5" /> Contact
                </dt>
                <dd className="font-semibold text-slate-900">
                  {order.customerPhone}
                </dd>
              </div>
            </dl>
          </div>

          <Link
            href="/track"
            className="flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Track another order
          </Link>
          <Link
            href="/#menu"
            className="flex h-11 items-center justify-center rounded-full bg-orange-500 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Order more food
          </Link>
        </aside>
      </div>
    </div>
  );
}
