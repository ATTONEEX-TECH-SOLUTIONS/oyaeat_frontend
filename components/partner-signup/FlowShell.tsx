"use client";

import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const FLOW_STEPS = ["Account", "Phone", "Business", "Documents"] as const;

/** Shell for every step after the landing page: header, stepper, one focused card. */
export default function FlowShell({
  step,
  eyebrow,
  title,
  subtitle,
  children,
  wide,
}: {
  step: 1 | 2 | 3 | 4;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Link href="/" className="font-display text-2xl font-extrabold tracking-tight text-primary">
            oyaeat
          </Link>
          <Link href="/restaurant/login" className="text-sm font-bold text-primary hover:underline">
            Already a partner? Log in
          </Link>
        </div>
      </header>

      <main className={cn("mx-auto w-full flex-1 px-4 pb-16 pt-6 sm:pt-10", wide ? "max-w-4xl" : "max-w-2xl")}>
        <ol className="mb-6 flex items-center gap-2" aria-label="Progress">
          {FLOW_STEPS.map((label, i) => {
            const n = i + 1;
            const done = n < step;
            const current = n === step;
            return (
              <li key={label} className="flex flex-1 items-center gap-2" aria-current={current ? "step" : undefined}>
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-extrabold transition",
                    done && "bg-primary text-primary-foreground",
                    current && "bg-cta text-cta-foreground shadow-pop",
                    !done && !current && "bg-violet-100 text-violet-400",
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : n}
                </span>
                <span className={cn("hidden text-sm font-bold sm:block", current ? "text-foreground" : "text-muted-foreground")}>{label}</span>
                {n < FLOW_STEPS.length && <span className={cn("h-1 flex-1 rounded-full", done ? "bg-primary" : "bg-violet-100")} aria-hidden />}
              </li>
            );
          })}
        </ol>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-8">
          {eyebrow && <p className="text-xs font-bold uppercase tracking-widest text-primary">{eyebrow}</p>}
          <h1 className="font-display mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
