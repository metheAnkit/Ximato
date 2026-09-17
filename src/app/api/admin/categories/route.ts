import { categories, nextId } from "@/db";
import { z } from "zod";
import { slugify } from "@/lib/format";
import { uniqueCategorySlug } from "@/lib/slugs";

const categorySchema = z.object({
  name: z.string().trim().min(2).max(120),
  emoji: z.string().trim().max(16).nullable().optional(),
  description: z.string().trim().max(300).nullable().optional(),
});

function bad(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const parsed = categorySchema.safeParse(await request.json());
    if (!parsed.success) {
      return bad(parsed.error.issues[0]?.message ?? "Invalid input.");
    }
    const data = parsed.data;

    const base = slugify(data.name) || "category";
    const slug = await uniqueCategorySlug(base);

    const id = await nextId("category");
    const sortOrder = await categories.countDocuments() + 1;
    await categories.insertOne({
        id,
        name: data.name,
        slug,
        emoji: data.emoji || "🍽️",
        description: data.description ?? null,
        sortOrder,
        createdAt: new Date(),
      });

    return Response.json({ id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/categories failed:", err);
    return bad("Failed to create category.", 500);
  }
}
