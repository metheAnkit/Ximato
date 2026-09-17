"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Loader2, Search } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Order } from "@/lib/types";

export default function TrackPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearched(false);
    try {
      const res = await fetch(
        `/api/orders?email=${encodeURIComponent(email.trim())}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load orders.");
      setOrders(data.orders);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
        Track your order
      </h1>
      <p className="mt-2 text-slate-500">
        Enter the email you used at checkout to see your orders.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="h-12 flex-1 rounded-full border border-slate-200 bg-white px-5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Searching…
            </>
          ) : (
            <>
              <Search className="h-4 w-4" /> Find orders
            </>
          )}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {searched && (
        <div className="mt-8 space-y-4">
          {orders && orders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-12 text-center">
              <span className="text-4xl">📭</span>
              <p className="mt-3 font-semibold text-slate-900">No orders found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try a different email address.
              </p>
            </div>
          ) : (
            orders?.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">
                      Order #{String(order.id).padStart(4, "0")}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {order.items.reduce((sum, i) => sum + i.quantity, 0)} item(s) ·{" "}
                  {formatCurrency(order.total)}
                </p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
