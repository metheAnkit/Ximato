"use client";

import Link from "next/link";
import { Clock, Plus } from "lucide-react";
import { useCart } from "./cart-context";
import FoodImage from "./FoodImage";
import VegMark from "./VegMark";
import { formatCurrency } from "@/lib/format";
import type { MenuItem } from "@/lib/types";

export default function MenuItemCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <Link
        href={`/menu/${item.slug}`}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <FoodImage
          src={item.imageUrl}
          alt={item.name}
          emoji={item.emoji}
          className="h-full w-full transition duration-500 group-hover:scale-105"
        />
        {item.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-orange-600 shadow-sm">
            ⭐ Featured
          </span>
        )}
        {!item.isAvailable && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-bold text-slate-500">
            Sold out
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <VegMark isVegetarian={item.isVegetarian} />
          <span className="text-xs font-medium text-slate-400">
            {item.categoryName}
          </span>
        </div>
        <Link
          href={`/menu/${item.slug}`}
          className="mt-1.5 block font-semibold leading-snug text-slate-900 transition hover:text-orange-600"
        >
          {item.name}
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
          {item.description}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div>
            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(item.price)}
            </span>
            <span className="ml-2 inline-flex items-center gap-1 text-xs text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              {item.prepTimeMinutes} min
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              addItem({
                id: item.id,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl,
                emoji: item.emoji,
              })
            }
            disabled={!item.isAvailable}
            className="flex h-9 items-center gap-1 rounded-full bg-orange-500 px-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
