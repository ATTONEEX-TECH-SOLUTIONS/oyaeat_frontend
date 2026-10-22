"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const fieldClass =
  "h-12 w-full rounded-xl border border-input bg-card px-4 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-ring focus:ring-4 focus:ring-ring/15 disabled:opacity-60 aria-[invalid=true]:border-destructive";
export const labelClass = "mb-1.5 block text-sm font-bold";

export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
        {optional && <span className="ml-1.5 text-xs font-medium text-muted-foreground">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p role="alert" className="mt-1.5 text-sm font-semibold text-destructive">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function FormError({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div role="alert" className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
      {children}
    </div>
  );
}

export function PrimaryButton({ className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      className={cn(
        "flex h-12 items-center justify-center gap-2 rounded-full bg-cta px-7 text-base font-extrabold text-cta-foreground shadow-sm transition hover:bg-mango-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    />
  );
}

export function SecondaryButton({ className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      className={cn(
        "flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-bold text-foreground transition hover:bg-violet-50 disabled:opacity-50",
        className,
      )}
    />
  );
}
