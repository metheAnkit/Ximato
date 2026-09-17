"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "./cart-context";
import QuantityControl from "./QuantityControl";
import { formatCurrency } from "@/lib/format";
import type { MenuItem } from "@/lib/types";

export default function ItemActions({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    for (let i = 0; i < qty; i += 1) {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        emoji: item.emoji,
      });
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <QuantityControl value={qty} onChange={(v) => setQty(Math.max(1, v))} min={1} />
        <span className="text-2xl font-bold text-slate-900">
          {formatCurrency(item.price * qty)}
        </span>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        disabled={!item.isAvailable}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange-500 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {added ? (
          <>
            <Check className="h-4 w-4" /> Added to cart
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" />
            {qty > 1 ? `Add ${qty} to cart` : "Add to cart"}
          </>
        )}
      </button>
    </div>
  );
}
