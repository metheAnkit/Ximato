import { getCategories } from "@/lib/data";
import CategoriesManager from "@/components/admin/CategoriesManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-slate-900">
        Categories{" "}
        <span className="text-slate-400">({categories.length})</span>
      </h2>
      <CategoriesManager categories={categories} />
    </div>
  );
}
