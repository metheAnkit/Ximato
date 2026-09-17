import Link from "next/link";
import { Plus } from "lucide-react";
import { getMenuItems } from "@/lib/data";
import ItemsManager from "@/components/admin/ItemsManager";

export const dynamic = "force-dynamic";

export default async function AdminItemsPage() {
  const items = await getMenuItems();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">
          Menu items <span className="text-slate-400">({items.length})</span>
        </h2>
        <Link
          href="/admin/items/new"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" /> New item
        </Link>
      </div>
      <ItemsManager items={items} />
    </div>
  );
}
