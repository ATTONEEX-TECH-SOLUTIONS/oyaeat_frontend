"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
export function Sidebar({
  children,
  collapsed = false,
  className,
}: React.ComponentProps<"aside"> & { collapsed?: boolean }) {
  return (
    <aside
      data-collapsed={collapsed}
      className={cn(
        "hidden min-h-screen shrink-0 border-r border-[var(--oya-border)] bg-[var(--oya-surface-0)] p-4 md:block",
        collapsed ? "w-20" : "w-64",
        className,
      )}
    >
      {children}
    </aside>
  );
}
