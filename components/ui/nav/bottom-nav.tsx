import * as React from "react";
import { cn } from "@/lib/utils";
export function BottomNav({
  children,
  className,
}: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="Mobile navigation"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex min-h-16 items-center justify-around border-t border-[var(--oya-border)] bg-[var(--oya-surface-0)] px-4 md:hidden",
        className,
      )}
    >
      {children}
    </nav>
  );
}
