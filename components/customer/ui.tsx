"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, Minus, Plus, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { statusMeta } from "@/lib/customer";

/* ---------- Empty / error states ---------- */

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
  className,
}: {
  icon: React.ElementType;
  title: string;
  body?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center rounded-3xl border border-dashed border-border bg-card px-6 py-12 sm:py-16",
        className,
      )}
    >
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-mango-100 text-mango-700">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="font-display mt-5 text-xl font-bold text-foreground">
        {title}
      </h3>
      {body && (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{body}</p>
      )}
      {action &&
        (action.href ? (
          <Link
            href={action.href}
            className="mt-6 inline-flex h-11 items-center rounded-full bg-cta px-6 text-sm font-bold text-cta-foreground shadow-sm transition hover:bg-mango-300"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="mt-6 inline-flex h-11 items-center rounded-full bg-cta px-6 text-sm font-bold text-cta-foreground shadow-sm transition hover:bg-mango-300"
          >
            {action.label}
          </button>
        ))}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  className,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center text-center rounded-3xl border border-destructive/20 bg-card px-6 py-12",
        className,
      )}
    >
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h3 className="font-display mt-5 text-xl font-bold">{title}</h3>
      {message && (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          {message}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition hover:bg-violet-800"
        >
          <RefreshCw className="h-4 w-4" /> Try again
        </button>
      )}
    </div>
  );
}

/* ---------- Skeletons ---------- */

const sk = "bg-muted";

export function RestaurantCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <Skeleton className={cn(sk, "h-44 w-full rounded-none")} />
      <div className="space-y-3 p-4">
        <Skeleton className={cn(sk, "h-5 w-2/3")} />
        <Skeleton className={cn(sk, "h-4 w-1/2")} />
        <Skeleton className={cn(sk, "h-4 w-1/3")} />
      </div>
    </div>
  );
}

export function RowSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
        >
          <Skeleton className={cn(sk, "h-16 w-16 rounded-xl")} />
          <div className="flex-1 space-y-2">
            <Skeleton className={cn(sk, "h-4 w-1/2")} />
            <Skeleton className={cn(sk, "h-3 w-1/3")} />
          </div>
          <Skeleton className={cn(sk, "h-5 w-16")} />
        </div>
      ))}
    </div>
  );
}

/* ---------- Small pieces ---------- */

const TONES = {
  success: "bg-success-soft text-success",
  danger: "bg-destructive/10 text-destructive",
  mango: "bg-mango-100 text-mango-800",
  violet: "bg-violet-100 text-violet-800",
} as const;

export function StatusPill({ status }: { status: string }) {
  const { label, tone } = statusMeta(status);
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold",
        TONES[tone],
      )}
    >
      {label}
    </span>
  );
}

export function QtyStepper({
  quantity,
  onAdd,
  onRemove,
  size = "md",
}: {
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  size?: "sm" | "md";
}) {
  const btn =
    size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <div className="inline-flex items-center rounded-full bg-violet-50 p-1">
      <button
        onClick={onRemove}
        aria-label="Remove one"
        className={cn(
          btn,
          "grid place-items-center rounded-full bg-card text-violet-800 shadow-sm transition active:scale-95",
        )}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span
        aria-live="polite"
        className="min-w-8 text-center text-sm font-extrabold text-violet-900"
      >
        {quantity}
      </span>
      <button
        onClick={onAdd}
        aria-label="Add one"
        className={cn(
          btn,
          "grid place-items-center rounded-full bg-primary text-primary-foreground shadow-sm transition active:scale-95",
        )}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
