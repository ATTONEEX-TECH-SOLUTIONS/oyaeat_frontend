"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PromoCard } from "@/components/campaigns/PromoCard";
import type { Campaign } from "@/lib/campaigns";

export function PromoCarousel({
  promos,
  loading,
}: {
  promos: Campaign[];
  loading?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el || !el.children.length) return;
    const first = el.children[0] as HTMLElement;
    const step = first.offsetWidth + 12;
    setIndex(Math.min(promos.length - 1, Math.round(el.scrollLeft / step)));
  }, [promos.length]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    return () => el.removeEventListener("scroll", sync);
  }, [sync]);

  const go = (i: number) => {
    const el = ref.current;
    const child = el?.children[Math.max(0, Math.min(promos.length - 1, i))] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  if (loading) {
    return (
      <div className="flex gap-3 overflow-hidden" aria-hidden>
        <Skeleton className="aspect-[16/10] min-h-52 w-[88%] shrink-0 rounded-3xl sm:w-[26rem]" />
        <Skeleton className="hidden aspect-[16/10] min-h-52 w-[26rem] shrink-0 rounded-3xl sm:block" />
      </div>
    );
  }

  if (!promos.length) {
    return (
      <section className="lp-doodles relative overflow-hidden rounded-3xl p-6 text-white shadow-card sm:p-10">
        <div className="relative max-w-md">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Fresh &amp; local
          </span>
          <h2 className="font-display mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
            Craving jollof? <span className="text-cta">We deliver it hot.</span>
          </h2>
          <p className="mt-2 text-violet-100">
            Pick a kitchen near you and your meal is on its way.
          </p>
        </div>
      </section>
    );
  }

  const many = promos.length > 1;
  return (
    <section aria-roledescription="carousel" aria-label="Offers from restaurants near you" className="group/carousel relative">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="font-display text-lg font-extrabold text-foreground sm:text-xl">
          Offers for you
        </h2>
        {many && (
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              onClick={() => go(index - 1)}
              disabled={index === 0}
              aria-label="Previous offer"
              className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:bg-accent disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              disabled={index >= promos.length - 1}
              aria-label="Next offer"
              className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:bg-accent disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={ref}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-1 lg:mx-0 lg:px-0"
      >
        {promos.map((p, i) => (
          <div
            key={p.id ?? i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${promos.length}`}
            className={cn("snap-start scroll-ml-4 lg:scroll-ml-0", many ? "w-[88%] shrink-0 sm:w-[26rem]" : "w-full")}
          >
            <PromoCard
              promo={p}
              href={p.businessId ? `/customer/restaurant/${p.businessId}` : undefined}
              className={many ? "" : "sm:aspect-[21/9]"}
            />
          </div>
        ))}
      </div>

      {many && (
        <div className="mt-3 flex justify-center gap-1.5 md:hidden" aria-hidden>
          {promos.map((_, i) => (
            <span
              key={i}
              className={cn("h-1.5 rounded-full transition-all", i === index ? "w-5 bg-primary" : "w-1.5 bg-border")}
            />
          ))}
        </div>
      )}
    </section>
  );
}
