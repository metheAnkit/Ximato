"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

interface QuantityControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}

/** Reusable minus/plus quantity stepper. */
export default function QuantityControl({
  value,
  onChange,
  min = 0,
  max = 99,
  size = "md",
}: QuantityControlProps) {
  const btn = cn(
    "flex items-center justify-center rounded-full border border-orange-200 bg-white text-orange-600 transition hover:bg-orange-50 disabled:opacity-40",
    size === "sm" ? "h-7 w-7" : "h-9 w-9",
  );

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Decrease quantity"
        className={btn}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>
      <span
        className={cn(
          "min-w-6 text-center font-semibold tabular-nums text-slate-900",
          size === "sm" ? "text-sm" : "text-base",
        )}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        className={btn}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>
    </div>
  );
}
