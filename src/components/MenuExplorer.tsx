"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import MenuItemCard from "./MenuItemCard";
import { cn } from "@/lib/cn";
import type { Category, MenuItem } from "@/lib/types";

export default function MenuExplorer({
  categories,
  items,
}: {
  categories: Category[];
  items: MenuItem[];
}) {
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (active !== "all" && item.categorySlug !== active) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        (item.description ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, active, query]);

  return (
    <section id="menu" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
            Our menu
          </p>
          <h2 className="mt-1 font-display text-3xl font-bold tracking-tight text-slate-900">
            Browse by category
          </h2>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes…"
            className="h-11 w-full rounded-full border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </div>
      </div>

      <div className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <button
          type="button"
          onClick={() => setActive("all")}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
            active === "all"
              ? "border-orange-500 bg-orange-500 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-slate-900",
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActive(cat.slug)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
              active === cat.slug
                ? "border-orange-500 bg-orange-500 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-slate-900",
            )}
          >
            <span>{cat.emoji}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <span className="text-5xl">🍽️</span>
          <p className="mt-4 font-semibold text-slate-900">No dishes found</p>
          <p className="mt-1 text-sm text-slate-500">
            Try a different search or category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
