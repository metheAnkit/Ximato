import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { getMenuItemBySlug, getMenuItems } from "@/lib/data";
import FoodImage from "@/components/FoodImage";
import ItemActions from "@/components/ItemActions";
import MenuItemCard from "@/components/MenuItemCard";
import VegMark from "@/components/VegMark";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MenuItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getMenuItemBySlug(slug);
  if (!item) notFound();

  const related = (await getMenuItems(item.categoryId))
    .filter((i) => i.id !== item.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        href="/#menu"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-orange-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to menu
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-4xl bg-white shadow-sm ring-1 ring-slate-100">
          <FoodImage
            src={item.imageUrl}
            alt={item.name}
            emoji={item.emoji}
            className="aspect-4/3 w-full"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <VegMark isVegetarian={item.isVegetarian} />
            <span className="text-sm font-medium text-slate-400">
              {item.categoryName}
            </span>
            {!item.isAvailable && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                Sold out
              </span>
            )}
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900">
            {item.name}
          </h1>
          <p className="mt-3 max-w-lg text-slate-600">{item.description}</p>

          <div className="mt-5 flex items-center gap-5 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-orange-500" />
              Ready in {item.prepTimeMinutes} min
            </span>
            <span className="text-3xl font-bold text-slate-900">
              {formatCurrency(item.price)}
            </span>
          </div>

          <div className="mt-8 max-w-sm">
            <ItemActions item={item} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold tracking-tight text-slate-900">
            More in {item.categoryName}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <MenuItemCard key={r.id} item={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
