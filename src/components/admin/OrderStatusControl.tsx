"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STEPS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { OrderStatus } from "@/lib/types";

export default function OrderStatusControl({
  orderId,
  status,
}: {
  orderId: number;
  status: OrderStatus;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<OrderStatus | null>(null);

  async function setStatus(next: OrderStatus) {
    setBusy(next);
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700">Update status</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {ORDER_STATUS_STEPS.map((step) => {
          const isCurrent = step === status;
          return (
            <button
              key={step}
              type="button"
              disabled={busy !== null || isCurrent}
              onClick={() => setStatus(step)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                isCurrent
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-slate-900",
              )}
            >
              {busy === step ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : isCurrent ? (
                <Check className="h-3.5 w-3.5" />
              ) : null}
              {ORDER_STATUS_LABELS[step]}
            </button>
          );
        })}
        {status !== "cancelled" && (
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => setStatus("cancelled")}
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
          >
            Cancel order
          </button>
        )}
      </div>
    </div>
  );
}
