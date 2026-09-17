import { categories, menuItems } from "@/db";
import { z } from "zod";
import { slugify } from "@/lib/format";
import { uniqueCategorySlug } from "@/lib/slugs";

const updateSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  emoji: z.string().trim().max(16).nullable().optional(),
  description: z.string().trim().max(300).nullable().optional(),
  sortOrder: z.number().int().optional(),
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
    const categoryId = Number(id);
    if (!Number.isFinite(categoryId)) return bad("Invalid id.");

    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return bad(parsed.error.issues[0]?.message ?? "Invalid input.");
    }
    const data = parsed.data;

    const existing = await categories.findOne({ id: categoryId });
    if (!existing) return bad("Category not found.", 404);

    const values: Record<string, unknown> = {};
    if (data.name !== undefined) {
      values.name = data.name;
      const base = slugify(data.name);
      if (base && base !== existing.slug) {
        values.slug = await uniqueCategorySlug(base, categoryId);
      }
    }
    if (data.emoji !== undefined) values.emoji = data.emoji || "🍽️";
    if (data.description !== undefined)
      values.description = data.description ?? null;
    if (data.sortOrder !== undefined) values.sortOrder = data.sortOrder;

    await categories.updateOne({ id: categoryId }, { $set: values });

    return Response.json({ ok: true, id: categoryId });
  } catch (err) {
    console.error("PATCH /api/admin/categories failed:", err);
    return bad("Failed to update category.", 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const categoryId = Number(id);
  if (!Number.isFinite(categoryId)) return bad("Invalid id.");

  if (await menuItems.countDocuments({ categoryId }) > 0) {
    return bad("Cannot delete a category that still has items.", 409);
  }

  await categories.deleteOne({ id: categoryId });
  return Response.json({ ok: true });
}
