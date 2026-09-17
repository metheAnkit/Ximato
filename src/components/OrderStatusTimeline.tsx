import { Check } from "lucide-react";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STEPS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { OrderStatus } from "@/lib/types";

export default function OrderStatusTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
        This order was cancelled.
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_STEPS.indexOf(status);

  return (
    <ol className="flex flex-col gap-0">
      {ORDER_STATUS_STEPS.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        const isLast = index === ORDER_STATUS_STEPS.length - 1;
        return (
          <li key={step} className="relative flex gap-3">
            {!isLast && (
              <span
                className={cn(
                  "absolute left-[11px] top-6 h-full w-0.5",
                  done ? "bg-green-500" : "bg-slate-200",
                )}
              />
            )}
            <span
              className={cn(
                "z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold",
                done && "border-green-500 bg-green-500 text-white",
                active && "border-orange-500 bg-white text-orange-600",
                !done && !active && "border-slate-300 bg-white text-slate-300",
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
            </span>
            <div className="pb-6">
              <p
                className={cn(
                  "text-sm font-semibold",
                  active ? "text-slate-900" : done ? "text-slate-700" : "text-slate-400",
                )}
              >
                {ORDER_STATUS_LABELS[step]}
              </p>
              <p className="text-xs text-slate-400">
                {active
                  ? "Current stage"
                  : done
                    ? "Completed"
                    : "Up next"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
