import { categories, menuItems, nextId } from "@/db";
import { z } from "zod";
import { slugify } from "@/lib/format";
import { uniqueMenuItemSlug } from "@/lib/slugs";

const itemSchema = z.object({
  name: z.string().trim().min(2).max(120),
  categoryId: z.number().int().positive(),
  price: z.number().positive().max(100000),
  description: z.string().trim().max(500).nullable().optional(),
  imageUrl: z.string().trim().max(500).nullable().optional(),
  emoji: z.string().trim().max(16).nullable().optional(),
  prepTimeMinutes: z.number().int().min(1).max(240).optional().default(20),
  isVegetarian: z.boolean().optional().default(false),
  isAvailable: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
});

function bad(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const parsed = itemSchema.safeParse(await request.json());
    if (!parsed.success) {
      return bad(parsed.error.issues[0]?.message ?? "Invalid input.");
    }
    const data = parsed.data;

    const category = await categories.findOne({ id: data.categoryId });
    if (!category) return bad("Category not found.");

    const base = slugify(data.name) || "item";
    const slug = await uniqueMenuItemSlug(base);

    const id = await nextId("menuItem");
    await menuItems.insertOne({
      id,
        name: data.name,
        slug,
        categoryId: data.categoryId,
        price: data.price,
        description: data.description ?? null,
        imageUrl: data.imageUrl ?? null,
        emoji: data.emoji || "🍽️",
        prepTimeMinutes: data.prepTimeMinutes,
        isVegetarian: data.isVegetarian,
        isAvailable: data.isAvailable,
        isFeatured: data.isFeatured,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    return Response.json({ id, slug }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/items failed:", err);
    return bad("Failed to create item.", 500);
  }
}
