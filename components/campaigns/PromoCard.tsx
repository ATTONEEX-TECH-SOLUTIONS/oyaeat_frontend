"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { endsIn, isImageUrl, type Campaign } from "@/lib/campaigns";

/**
 * The one campaign card. The customer carousel renders it as a link; the
 * superadmin review desk renders it with `preview` so admins approve exactly
 * what customers will see.
 */
export function PromoCard({
  promo,
  href,
  preview,
  className,
}: {
  promo: Pick<Campaign, "title" | "desc" | "bgGradient" | "expiresAt" | "business">;
  href?: string;
  preview?: boolean;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const img = isImageUrl(promo.bgGradient) && !broken;
  const legacyClasses = !img && promo.bgGradient && /\b(bg|from|to|via)-/.test(promo.bgGradient) ? promo.bgGradient : "";
  const ends = endsIn(promo.expiresAt);
  const title = promo.title?.trim() || "Your headline appears here";

  const body = (
    <>
      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={promo.bgGradient!}
          alt=""
          loading="lazy"
          onError={() => setBroken(true)}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      )}
      {/* scrim keeps text readable on any photo */}
      <div
        className={cn(
          "absolute inset-0",
          img ? "bg-gradient-to-t from-[#1a1033]/90 via-[#1a1033]/40 to-[#1a1033]/5" : "",
        )}
      />

      <div className="relative flex items-start justify-between gap-2">
        {promo.business?.name ? (
          <span className="inline-flex max-w-[70%] items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-violet-900 shadow-sm backdrop-blur">
            <Store className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{promo.business.name}</span>
          </span>
        ) : (
          <span />
        )}
        {ends && (
          <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            <Clock className="h-3 w-3" /> {ends}
          </span>
        )}
      </div>

      <div className="relative">
        <h3 className="font-display line-clamp-2 text-2xl font-extrabold leading-tight sm:text-[1.7rem]">
          {title}
        </h3>
        {promo.desc && (
          <p className="mt-1 line-clamp-2 text-sm text-white/85">{promo.desc}</p>
        )}
        {!preview && href && (
          <span className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-cta px-5 text-sm font-bold text-cta-foreground transition group-hover:bg-mango-300">
            Order now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </>
  );

  const shell = cn(
    "group relative flex aspect-[16/10] min-h-52 w-full flex-col justify-between overflow-hidden rounded-3xl p-4 text-white shadow-card sm:p-5",
    !img && !legacyClasses && "lp-doodles",
    legacyClasses,
    className,
  );

  if (preview || !href) return <div className={shell}>{body}</div>;
  return (
    <Link href={href} className={cn(shell, "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40")}>
      {body}
    </Link>
  );
}
