import Link from "next/link";
import { ArrowRight, Bike, Clock, Star } from "lucide-react";
import { getCategories, getFeaturedItems, getMenuItems } from "../lib/data";
import MenuExplorer from "@/components/MenuExplorer";
import MenuItemCard from "@/components/MenuItemCard";
import FoodImage from "@/components/FoodImage";

export const dynamic = "force-dynamic";

const HERO_IMAGE =
  "https://images.pexels.com/photos/8471743/pexels-photo-8471743.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";

export default async function HomePage() {
  const [categories, items, featured] = await Promise.all([
    getCategories(),
    getMenuItems(),
    getFeaturedItems(),
  ]);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-linear-to-b from-orange-50 via-rose-50/60 to-[#fffaf5]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-orange-700 shadow-sm ring-1 ring-orange-100">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Open now · Delivering to your door
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Crave it.{" "}
              <span className="text-orange-600">We&apos;ll bring it.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-600">
              Enjoy hand crafted pizzas, stacked burgers, fresh sushi and more, all cooked to order and delivered hot to your door in about 30 minutes.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="#menu"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-orange-500 px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
              >
                Order now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/track"
                className="inline-flex h-12 items-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Track your order
              </Link>
            </div>
            <dl className="mt-10 flex flex-wrap gap-8">
              <div className="flex items-center gap-2.5">
                <Clock className="h-5 w-5 text-orange-500" />
                <div>
                  <dt className="text-xs text-slate-500">Avg. delivery</dt>
                  <dd className="text-sm font-bold text-slate-900">30 min</dd>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Star className="h-5 w-5 text-orange-500" />
                <div>
                  <dt className="text-xs text-slate-500">Rating</dt>
                  <dd className="text-sm font-bold text-slate-900">4.9 / 5</dd>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Bike className="h-5 w-5 text-orange-500" />
                <div>
                  <dt className="text-xs text-slate-500">Free delivery</dt>
                  <dd className="text-sm font-bold text-slate-900">Over $50</dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-4xl shadow-2xl shadow-orange-900/10 ring-1 ring-white/60">
              <FoodImage
                src={HERO_IMAGE}
                alt="A spread of freshly prepared dishes"
                emoji="🍽️"
                className="h-72 w-full sm:h-96 lg:h-120"
              />
            </div>
            <div className="absolute -bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-slate-100">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-lg">
                🥗
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">Fresh daily</p>
                <p className="text-xs text-slate-500">Farm-to-table ingredients</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Featured ---------- */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
                Chef&apos;s picks
              </p>
              <h2 className="mt-1 font-display text-3xl font-bold tracking-tight text-slate-900">
                Customer favorites
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* ---------- Full menu with category filter + search ---------- */}
      <div className="pt-16">
        <MenuExplorer categories={categories} items={items} />
      </div>
    </>
  );
}
