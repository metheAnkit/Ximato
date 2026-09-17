"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
import { useCart } from "./cart-context";
import QuantityControl from "./QuantityControl";
import FoodImage from "./FoodImage";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/cn";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, removeItem, setQuantity, subtotal, itemCount } = useCart();

  return (
    <div className={cn("fixed inset-0 z-50", !open && "pointer-events-none")}>
      <div
        className={cn(
          "absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <ShoppingBag className="h-5 w-5 text-orange-500" />
            Your cart
            {itemCount > 0 && (
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
                {itemCount}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="text-5xl">🛒</span>
              <p className="mt-4 font-semibold text-slate-900">Your cart is empty</p>
              <p className="mt-1 text-sm text-slate-500">
                Add something tasty to get started.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <FoodImage
                    src={item.imageUrl}
                    alt={item.name}
                    emoji={item.emoji}
                    className="h-16 w-16 shrink-0 rounded-xl"
                    emojiClassName="text-2xl"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {item.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs font-medium text-slate-400 transition hover:text-rose-600"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <QuantityControl
                        value={item.quantity}
                        onChange={(v) => setQuantity(item.id, v)}
                        size="sm"
                      />
                      <span className="text-sm font-bold text-slate-900">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-100 px-5 py-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="text-lg font-bold text-slate-900">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="grid gap-2">
              <Link
                href="/cart"
                onClick={onClose}
                className="flex h-11 items-center justify-center rounded-full border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                View cart
              </Link>
              <Link
                href="/checkout"
                onClick={onClose}
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-orange-500 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Checkout <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
