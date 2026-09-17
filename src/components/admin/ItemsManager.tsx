"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import FoodImage from "../FoodImage";
import VegMark from "../VegMark";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { MenuItem } from "@/lib/types";

export default function ItemsManager({ items }: { items: MenuItem[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<number | null>(null);

  async function toggleAvailability(item: MenuItem) {
    setBusyId(item.id);
    try {
      await fetch(`/api/admin/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !item.isAvailable }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(item: MenuItem) {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    setBusyId(item.id);
    try {
      await fetch(`/api/admin/items/${item.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Item</th>
              <th className="px-6 py-3 font-semibold">Category</th>
              <th className="px-6 py-3 font-semibold">Price</th>
              <th className="px-6 py-3 font-semibold">Availability</th>
              <th className="px-6 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  No menu items yet. Add your first dish!
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id} className="transition hover:bg-orange-50/40">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <FoodImage
                      src={item.imageUrl}
                      alt={item.name}
                      emoji={item.emoji}
                      className="h-11 w-11 shrink-0 rounded-xl"
                      emojiClassName="text-xl"
                    />
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-semibold text-slate-900">
                        {item.name}
                        {item.isFeatured && <span title="Featured">⭐</span>}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-slate-400">
                        <VegMark isVegetarian={item.isVegetarian} className="scale-75" />
                        {item.prepTimeMinutes} min
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-slate-600">{item.categoryName}</td>
                <td className="px-6 py-3 font-semibold text-slate-900">
                  {formatCurrency(item.price)}
                </td>
                <td className="px-6 py-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={item.isAvailable}
                    disabled={busyId === item.id}
                    onClick={() => toggleAvailability(item)}
                    className={cn(
                      "relative inline-flex h-6 w-11 shrink-0 rounded-full transition",
                      item.isAvailable ? "bg-green-500" : "bg-slate-300",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                        item.isAvailable ? "left-[22px]" : "left-0.5",
                      )}
                    />
                  </button>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/items/${item.id}/edit`}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(item)}
                      disabled={busyId === item.id}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
