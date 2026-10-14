import { cn } from "@/lib/utils";

/**
 * The OyaEat logo. `light` is for light backgrounds, `white` for dark or violet ones.
 * Size it with height (e.g. className="h-9"); the width follows the artwork.
 */
export default function Logo({
  variant = "light",
  className,
}: {
  variant?: "light" | "white";
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={variant === "white" ? "/brand/oyaeat-logo-white.svg" : "/brand/oyaeat-logo.svg"}
      alt="OyaEat"
      className={cn("h-9 w-auto select-none", className)}
      draggable={false}
    />
  );
}
