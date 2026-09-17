import { menuItems } from "@/db";
import { z } from "zod";
import { slugify } from "@/lib/format";
import { uniqueMenuItemSlug } from "@/lib/slugs";

const updateSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  categoryId: z.number().int().positive().optional(),
  price: z.number().positive().max(100000).optional(),
  description: z.string().trim().max(500).nullable().optional(),
  imageUrl: z.string().trim().max(500).nullable().optional(),
  emoji: z.string().trim().max(16).nullable().optional(),
  prepTimeMinutes: z.number().int().min(1).max(240).optional(),
  isVegetarian: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

function bad(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const itemId = Number(id);
    if (!Number.isFinite(itemId)) return bad("Invalid id.");

    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return bad(parsed.error.issues[0]?.message ?? "Invalid input.");
    }
    const data = parsed.data;

    const existing = await menuItems.findOne({ id: itemId });
    if (!existing) return bad("Item not found.", 404);

    const values: Record<string, unknown> = { updatedAt: new Date() };
    if (data.name !== undefined) {
      values.name = data.name;
      const base = slugify(data.name);
      if (base && base !== existing.slug) {
        values.slug = await uniqueMenuItemSlug(base, itemId);
      }
    }
    if (data.categoryId !== undefined) values.categoryId = data.categoryId;
    if (data.price !== undefined) values.price = data.price;
    if (data.description !== undefined) values.description = data.description ?? null;
    if (data.imageUrl !== undefined) values.imageUrl = data.imageUrl ?? null;
    if (data.emoji !== undefined) values.emoji = data.emoji || "🍽️";
    if (data.prepTimeMinutes !== undefined)
      values.prepTimeMinutes = data.prepTimeMinutes;
    if (data.isVegetarian !== undefined) values.isVegetarian = data.isVegetarian;
    if (data.isAvailable !== undefined) values.isAvailable = data.isAvailable;
    if (data.isFeatured !== undefined) values.isFeatured = data.isFeatured;

    await menuItems.updateOne({ id: itemId }, { $set: values });

    return Response.json({ ok: true, id: itemId });
  } catch (err) {
    console.error("PATCH /api/admin/items failed:", err);
    return bad("Failed to update item.", 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const itemId = Number(id);
  if (!Number.isFinite(itemId)) return bad("Invalid id.");

  await menuItems.deleteOne({ id: itemId });
  return Response.json({ ok: true });
}
