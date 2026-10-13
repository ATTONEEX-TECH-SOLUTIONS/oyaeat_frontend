import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  icon,
  title,
  subtitle,
  href,
  hrefLabel,
  tone = "light",
}: {
  eyebrow: string;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
      <div className="max-w-2xl">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase px-3 py-1.5 mb-3 ${
            dark
              ? "bg-white/15 text-[var(--lp-mango)]"
              : "bg-[var(--lp-violet-100)] text-[var(--lp-violet-700)]"
          }`}
        >
          {icon}
          {eyebrow}
        </span>
        <h2
          className={`lp-display font-extrabold leading-[1.02] text-[clamp(2rem,4.5vw,3.25rem)] ${
            dark ? "text-[var(--lp-cream)]" : "text-[var(--lp-violet-900)]"
          }`}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={`mt-2 text-base font-medium ${
              dark ? "text-white/75" : "text-[var(--lp-ink-soft)]"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
      {href && hrefLabel && (
        <Link
          href={href}
          className={`group inline-flex items-center gap-2 text-sm font-extrabold rounded-full px-5 py-2.5 border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lp-mango)] ${
            dark
              ? "border-white/40 text-white hover:bg-white hover:text-[var(--lp-violet-900)]"
              : "border-[var(--lp-violet-700)] text-[var(--lp-violet-700)] hover:bg-[var(--lp-violet-700)] hover:text-white"
          }`}
        >
          {hrefLabel}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}
