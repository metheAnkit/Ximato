import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import Header from "@/components/Header";
import Logo from "@/components/Logo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ximato - Fresh food, delivered fast",
    template: "%s · Ximato",
  },
  description:
    "Order delicious pizza, juicy burgers, fresh sushi, pasta, curries, and desserts on Ximato for super fast delivery.",
  icons: {
    icon: [
      { url: "/images/icon.svg", type: "image/svg+xml" },
      { url: "/images/ximato-icon.png", type: "image/png" },
    ],
    apple: "/images/ximato-icon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen font-sans text-slate-900 antialiased">
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="mt-16 border-t border-orange-100 bg-white">
              <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-6">
                <Logo size={34} textClassName="text-xl font-display font-extrabold" />
                <p>© 2026 Ximato. Fresh food, delivered fast. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
