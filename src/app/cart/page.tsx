"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-context";
import QuantityControl from "@/components/QuantityControl";
import FoodImage from "@/components/FoodImage";
import { formatCurrency, round2 } from "@/lib/format";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, TAX_RATE } from "@/lib/constants";

export default function CartPage() {
  const { items, removeItem, setQuantity, subtotal } = useCart();

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const tax = round2(subtotal * TAX_RATE);
  const total = round2(subtotal + deliveryFee + tax);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-24 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl">
          🛒
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold text-slate-900">
          Your cart is empty
        </h1>
        <p className="mt-2 text-slate-500">
          Looks like you haven&apos;t added anything yet.
        </p>
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
        Your cart
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <FoodImage
                src={item.imageUrl}
                alt={item.name}
                emoji={item.emoji}
                className="h-20 w-20 shrink-0 rounded-2xl"
                emojiClassName="text-3xl"
              />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">
                      {formatCurrency(item.price)} each
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="rounded-full p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <QuantityControl
                    value={item.quantity}
                    onChange={(v) => setQuantity(item.id, v)}
                  />
                  <span className="text-lg font-bold text-slate-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <ShoppingBag className="h-5 w-5 text-orange-500" /> Order summary
          </h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Subtotal</dt>
              <dd className="font-semibold text-slate-900">
                {formatCurrency(subtotal)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Delivery fee</dt>
              <dd className="font-semibold text-slate-900">
                {deliveryFee === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  formatCurrency(deliveryFee)
                )}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Tax</dt>
              <dd className="font-semibold text-slate-900">{formatCurrency(tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
              <dt className="font-semibold text-slate-900">Total</dt>
              <dd className="font-bold text-slate-900">{formatCurrency(total)}</dd>
            </div>
          </dl>
          {deliveryFee > 0 && (
            <p className="mt-4 rounded-xl bg-orange-50 px-3 py-2 text-xs text-orange-700">
              Add {formatCurrency(FREE_DELIVERY_THRESHOLD - subtotal)} more for free
              delivery.
            </p>
          )}
          <Link
            href="/checkout"
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange-500 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Proceed to checkout <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/#menu"
            className="mt-3 flex h-11 w-full items-center justify-center rounded-full border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
