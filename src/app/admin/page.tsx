import Link from "next/link";
import { ArrowRight, Clock, DollarSign, Receipt, Utensils } from "lucide-react";
import { getAllOrders, getDashboardStats } from "@/lib/data";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const orders = await getAllOrders();
  const recent = orders.slice(0, 5);

  const cards = [
    { label: "Total revenue", value: formatCurrency(stats.totalRevenue), icon: DollarSign, accent: "from-emerald-500 to-teal-500" },
    { label: "Total orders", value: String(stats.totalOrders), icon: Receipt, accent: "from-sky-500 to-indigo-500" },
    { label: "Active orders", value: String(stats.activeOrders), icon: Clock, accent: "from-amber-500 to-orange-500" },
    { label: "Menu items", value: String(stats.totalItems), icon: Utensils, accent: "from-rose-500 to-pink-500" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                {card.label}
              </span>
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br text-white ${card.accent}`}
              >
                <card.icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-500">
            No orders yet. Share your store link to start selling!
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 transition hover:bg-orange-50/50"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-900">
                      #{String(order.id).padStart(4, "0")}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-900">
                      {formatCurrency(order.total)}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
