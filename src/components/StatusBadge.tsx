import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { OrderStatus } from "@/lib/types";

const STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 ring-amber-200",
  confirmed: "bg-sky-100 text-sky-800 ring-sky-200",
  preparing: "bg-violet-100 text-violet-800 ring-violet-200",
  out_for_delivery: "bg-indigo-100 text-indigo-800 ring-indigo-200",
  delivered: "bg-green-100 text-green-800 ring-green-200",
  cancelled: "bg-rose-100 text-rose-800 ring-rose-200",
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        STYLES[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
