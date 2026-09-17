import { categories, menuItems } from "@/db";

/** Ensure a unique slug for a menu item, optionally excluding a row id. */
export async function uniqueMenuItemSlug(
  base: string,
  excludeId?: number,
): Promise<string> {
  let candidate = base;
  let n = 2;
  for (;;) {
    const existing = await menuItems.findOne({ slug: candidate });
    if (!existing || (excludeId !== undefined && existing.id === excludeId)) {
      return candidate;
    }
    candidate = `${base}-${n++}`;
  }
}

/** Ensure a unique slug for a category, optionally excluding a row id. */
export async function uniqueCategorySlug(
  base: string,
  excludeId?: number,
): Promise<string> {
  let candidate = base;
  let n = 2;
  for (;;) {
    const existing = await categories.findOne({ slug: candidate });
    if (!existing || (excludeId !== undefined && existing.id === excludeId)) {
      return candidate;
    }
    candidate = `${base}-${n++}`;
  }
}
