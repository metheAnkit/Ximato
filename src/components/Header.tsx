"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "./cart-context";
import CartDrawer from "./CartDrawer";
import Logo from "./Logo";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { href: "/", label: "Menu" },
  { href: "/track", label: "Track order" },
  { href: "/admin", label: "Admin" },
];

export default function Header() {
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-orange-100/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo size={42} textClassName="text-2xl font-display font-extrabold" />

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-orange-50 hover:text-slate-900",
                  pathname === link.href && "bg-orange-50 text-orange-700",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm transition hover:bg-orange-600"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white ring-2 ring-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
