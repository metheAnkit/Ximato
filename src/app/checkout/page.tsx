"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { formatCurrency, round2 } from "@/lib/format";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  TAX_RATE,
  PAYMENT_METHODS,
  PAYMENT_LABELS,
  type PaymentMethod,
} from "@/lib/constants";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    payment: "cash" as PaymentMethod,
  });

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const tax = round2(subtotal * TAX_RATE);
  const total = round2(subtotal + deliveryFee + tax);

  const update =
    (field: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          deliveryAddress: form.address,
          notes: form.notes || null,
          paymentMethod: form.payment,
          items: items.map((i) => ({
            menuItemId: i.id,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to place your order.");
      }
      clear();
      router.push(`/orders/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-24 text-center">
        <span className="text-5xl">🧾</span>
        <h1 className="mt-6 font-display text-3xl font-bold text-slate-900">
          Nothing to checkout
        </h1>
        <p className="mt-2 text-slate-500">Your cart is empty.</p>
        <Link
          href="/#menu"
          className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Browse the menu <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
        Checkout
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Delivery details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required>
                <input
                  required
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Alex Rivera"
                  className="input"
                />
              </Field>
              <Field label="Phone" required>
                <input
                  required
                  value={form.phone}
                  onChange={update("phone")}
                  placeholder="+1 555 000 1234"
                  className="input"
                />
              </Field>
              <Field label="Email" required className="sm:col-span-2">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  className="input"
                />
              </Field>
              <Field label="Delivery address" required className="sm:col-span-2">
                <textarea
                  required
                  value={form.address}
                  onChange={update("address")}
                  placeholder="Street, apartment, city…"
                  rows={2}
                  className="input resize-none"
                />
              </Field>
              <Field label="Order notes (optional)" className="sm:col-span-2">
                <textarea
                  value={form.notes}
                  onChange={update("notes")}
                  placeholder="Anything we should know?"
                  rows={2}
                  className="input resize-none"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Payment method</h2>
            <div className="mt-4 grid gap-3">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    form.payment === method
                      ? "border-orange-400 bg-orange-50 text-slate-900"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={form.payment === method}
                    onChange={() => setForm((f) => ({ ...f, payment: method }))}
                    className="h-4 w-4 accent-orange-500"
                  />
                  {PAYMENT_LABELS[method]}
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-slate-900">Your order</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-2">
                <span className="text-slate-600">
                  {item.quantity}× {item.name}
                </span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Subtotal</dt>
              <dd className="font-semibold">{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Delivery</dt>
              <dd className="font-semibold">
                {deliveryFee === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  formatCurrency(deliveryFee)
                )}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Tax</dt>
              <dd className="font-semibold">{formatCurrency(tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
              <dt className="font-semibold text-slate-900">Total</dt>
              <dd className="font-bold text-slate-900">{formatCurrency(total)}</dd>
            </div>
          </dl>

          {error && (
            <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange-500 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Placing order…
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" /> Place order
              </>
            )}
          </button>
          <p className="mt-3 text-center text-xs text-slate-400">
            This is a demo checkout — no real payment is processed.
          </p>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </span>
      {children}
    </label>
  );
}
