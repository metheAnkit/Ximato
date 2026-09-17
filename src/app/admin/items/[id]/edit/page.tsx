import { notFound } from "next/navigation";
import { getCategories, getMenuItemById } from "@/lib/data";
import ItemForm from "@/components/admin/ItemForm";

export const dynamic = "force-dynamic";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const itemId = Number(id);

  const [item, categories] = await Promise.all([
    Number.isFinite(itemId) ? getMenuItemById(itemId) : Promise.resolve(null),
    getCategories(),
  ]);

  if (!item) notFound();

  return <ItemForm categories={categories} initial={item} />;
}
