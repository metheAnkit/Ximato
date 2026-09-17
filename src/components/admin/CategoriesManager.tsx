"use client";

import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Category } from "@/lib/types";

export default function CategoriesManager({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", emoji: "🍽️", description: "" });

  const update =
    (field: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      emoji: cat.emoji,
      description: cat.description ?? "",
    });
    setError(null);
  }

  function reset() {
    setEditingId(null);
    setForm({ name: "", emoji: "🍽️", description: "" });
    setError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(
        editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            emoji: form.emoji || "🍽️",
            description: form.description || null,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save category.");
      reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(cat: Category) {
    if (
      !window.confirm(
        `Delete "${cat.name}"? You can only delete categories with no items.`,
      )
    )
      return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete category.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <form
        onSubmit={handleSubmit}
        className="h-fit rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900">
            {editingId ? "Edit category" : "Add category"}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={reset}
              className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100"
              aria-label="Cancel edit"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Name *
            </span>
            <input
              required
              value={form.name}
              onChange={update("name")}
              placeholder="Pizza"
              className="input"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Emoji
            </span>
            <input
              value={form.emoji}
              onChange={update("emoji")}
              placeholder="🍕"
              className="input"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Description
            </span>
            <textarea
              value={form.description}
              onChange={update("description")}
              rows={2}
              placeholder="Short description…"
              className="input resize-none"
            />
          </label>
          {error && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-orange-500 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            {editingId ? "Save changes" : "Add category"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {categories.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
            No categories yet.
          </div>
        )}
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl">
              {cat.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900">{cat.name}</p>
              <p className="truncate text-sm text-slate-500">
                {cat.description || "No description"}
              </p>
            </div>
            <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 sm:inline-block">
              {cat.itemCount ?? 0} items
            </span>
            <button
              type="button"
              onClick={() => startEdit(cat)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => remove(cat)}
              disabled={busy}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
