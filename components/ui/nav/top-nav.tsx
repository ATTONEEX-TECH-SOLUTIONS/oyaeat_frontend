import * as React from "react";
import { cn } from "@/lib/utils";
export function TopNav({
  children,
  className,
}: React.ComponentProps<"header">) {
  return (
    <header
      className={cn(
        "flex min-h-16 items-center justify-between border-b border-[var(--oya-border)] bg-[var(--oya-surface-0)] px-4 md:px-8",
        className,
      )}
    >
      {children}
    </header>
  );
}
