"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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


export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-xl bg-muted" />
      ))}
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
