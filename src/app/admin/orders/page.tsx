import Link from "next/link";
import { getAllOrders } from "@/lib/data";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-slate-900">
        Orders <span className="text-slate-400">({orders.length})</span>
      </h2>

      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Order</th>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Items</th>
                <th className="px-6 py-3 font-semibold">Total</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Placed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                    No orders yet.
                  </td>
                </tr>
              )}
              {orders.map((order) => (
                <tr key={order.id} className="transition hover:bg-orange-50/40">
                  <td className="px-6 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-bold text-slate-900 hover:text-orange-600"
                    >
                      #{String(order.id).padStart(4, "0")}
                    </Link>
                  </td>
                  <td className="px-6 py-3">
                    <p className="font-semibold text-slate-800">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-slate-500">{order.customerPhone}</p>
                  </td>
                  <td className="px-6 py-3 text-slate-600">
                    {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                  </td>
                  <td className="px-6 py-3 font-semibold text-slate-900">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-3 text-slate-500">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
