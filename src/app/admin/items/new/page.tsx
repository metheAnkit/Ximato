import { getCategories } from "@/lib/data";
import ItemForm from "@/components/admin/ItemForm";

export const dynamic = "force-dynamic";

export default async function NewItemPage() {
  const categories = await getCategories();
  return <ItemForm categories={categories} />;
}
