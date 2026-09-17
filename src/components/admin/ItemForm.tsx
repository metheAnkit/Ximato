"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import FoodImage from "../FoodImage";
import { formatCurrency } from "@/lib/format";
import type { Category, MenuItem } from "@/lib/types";

type FieldValue = string;

export default function ItemForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: MenuItem | null;
}) {
  const router = useRouter();
  const editing = Boolean(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    categoryId: initial?.categoryId ?? categories[0]?.id ?? 0,
    price: initial ? String(initial.price) : "",
    description: initial?.description ?? "",
    imageUrl: initial?.imageUrl ?? "",
    emoji: initial?.emoji ?? "🍽️",
    prepTimeMinutes: initial?.prepTimeMinutes ?? 20,
    isVegetarian: initial?.isVegetarian ?? false,
    isAvailable: initial?.isAvailable ?? true,
    isFeatured: initial?.isFeatured ?? false,
  });

  const update =
    (field: keyof typeof form) =>
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) =>
      setForm((f) => ({ ...f, [field]: e.target.value as FieldValue }));

  const toggle = (field: "isVegetarian" | "isAvailable" | "isFeatured") =>
    (e: ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.checked }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        categoryId: Number(form.categoryId),
        price: Number(form.price),
        description: form.description || null,
        imageUrl: form.imageUrl || null,
        emoji: form.emoji || "🍽️",
        prepTimeMinutes: Number(form.prepTimeMinutes),
        isVegetarian: form.isVegetarian,
        isAvailable: form.isAvailable,
        isFeatured: form.isFeatured,
      };
      const res = await fetch(
        editing ? `/api/admin/items/${initial!.id}` : "/api/admin/items",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save item.");
      router.push("/admin/items");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <div>
      <Link
        href="/admin/items"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-orange-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to items
      </Link>
      <h2 className="mt-3 text-xl font-bold text-slate-900">
        {editing ? `Edit ${initial?.name}` : "Add a new item"}
      </h2>

      {categories.length === 0 && (
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You need to create a category before adding items.{" "}
          <Link href="/admin/categories" className="font-semibold underline">
            Create a category →
          </Link>
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]"
      >
        <div className="space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Name *
              </span>
              <input
                required
                value={form.name}
                onChange={update("name")}
                placeholder="Margherita Pizza"
                className="input"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Category *
              </span>
              <select
                required
                value={form.categoryId}
                onChange={update("categoryId")}
                className="input"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Price (USD) *
              </span>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={update("price")}
                placeholder="12.99"
                className="input"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Prep time (minutes)
              </span>
              <input
                type="number"
                min="1"
                max="240"
                value={form.prepTimeMinutes}
                onChange={update("prepTimeMinutes")}
                className="input"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Emoji (fallback)
              </span>
              <input
                value={form.emoji}
                onChange={update("emoji")}
                className="input"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Image URL
              </span>
              <input
                value={form.imageUrl}
                onChange={update("imageUrl")}
                placeholder="https://…"
                className="input"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Description
              </span>
              <textarea
                value={form.description}
                onChange={update("description")}
                rows={3}
                placeholder="Short, appetizing description…"
                className="input resize-none"
              />
            </label>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <CheckRow
              label="Vegetarian"
              checked={form.isVegetarian}
              onChange={toggle("isVegetarian")}
            />
            <CheckRow
              label="Available"
              checked={form.isAvailable}
              onChange={toggle("isAvailable")}
            />
            <CheckRow
              label="Featured"
              checked={form.isFeatured}
              onChange={toggle("isFeatured")}
            />
          </div>

          {error && (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving || categories.length === 0}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange-500 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : editing ? (
              "Save changes"
            ) : (
              "Create item"
            )}
          </button>
        </div>

        <aside className="h-fit rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Live preview
          </p>
          <div className="overflow-hidden rounded-2xl border border-slate-100">
            <FoodImage
              src={form.imageUrl || null}
              alt={form.name || "Item preview"}
              emoji={form.emoji || "🍽️"}
              className="aspect-4/3 w-full"
            />
            <div className="p-3">
              <p className="font-semibold text-slate-900">
                {form.name || "Item name"}
              </p>
              <p className="text-xs text-slate-500">
                {form.description || "Description preview…"}
              </p>
              <p className="mt-1 font-bold text-slate-900">
                {formatCurrency(Number(form.price) || 0)}
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-orange-500"
      />
      {label}
    </label>
  );
}
