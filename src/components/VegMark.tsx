import { cn } from "@/lib/cn";

/** Indian-style vegetarian / non-vegetarian indicator. */
export default function VegMark({
  isVegetarian,
  className,
}: {
  isVegetarian: boolean;
  className?: string;
}) {
  return (
    <span
      title={isVegetarian ? "Vegetarian" : "Non-vegetarian"}
      className={cn(
        "inline-flex h-4 w-4 items-center justify-center rounded-[3px] border-2",
        isVegetarian ? "border-green-600" : "border-red-600",
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isVegetarian ? "bg-green-600" : "bg-red-600",
        )}
      />
    </span>
  );
}
