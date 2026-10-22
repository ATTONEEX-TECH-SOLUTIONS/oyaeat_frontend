"use client";

import React from "react";
import { cn } from "@/lib/utils";

const TONES = {
  violet: "bg-violet-100 text-violet-800",
  mango: "bg-mango-100 text-mango-800",
  success: "bg-success-soft text-success",
  danger: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
} as const;
export type Tone = keyof typeof TONES;

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold", TONES[tone])}>
      {children}
    </span>
  );
}

const ORDER_TONE: Record<string, Tone> = {
  pending: "violet",
  confirmed: "violet",
  preparing: "mango",
  ready: "mango",
  out_for_delivery: "mango",
  delivered: "success",
  cancelled: "danger",
  rejected: "danger",
  failed: "danger",
};
export function OrderBadge({ status }: { status: string }) {
  return <Badge tone={ORDER_TONE[status] || "neutral"}>{(status || "unknown").replace(/_/g, " ")}</Badge>;
}

export function AdminStat({
  label,
  value,
  sub,
  icon: Icon,
  tone = "violet",
  highlight,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  icon: React.ElementType;
  tone?: "violet" | "mango" | "success";
  highlight?: boolean;
}) {
  const iconTone = tone === "mango" ? "bg-mango-100 text-mango-700" : tone === "success" ? "bg-success-soft text-success" : "bg-violet-100 text-violet-700";
  return (
    <div className={cn("rounded-2xl border bg-card p-4 shadow-card sm:p-5", highlight ? "border-mango-300 bg-mango-50" : "border-border")}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", iconTone)}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="font-display mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function Panel({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-4 shadow-card sm:p-6", className)}>
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="font-display text-lg font-bold">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export const adminField =
  "h-11 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-ring focus:ring-4 focus:ring-ring/15";
