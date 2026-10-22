"use client";

import { ChevronDown } from "lucide-react";
import { FAQItem } from "@/lib/data/data";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function PartnerFAQ({ data }: { data: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-4 pb-16 sm:pb-24">
      <h2 className="lp-display text-3xl font-extrabold tracking-tight text-[var(--lp-ink)] sm:text-4xl">Questions, answered</h2>
      <div className="mt-8 space-y-3">
        {data.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="overflow-hidden rounded-2xl border border-[#ecdcae] bg-white">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-bold text-[var(--lp-ink)]"
              >
                {faq.question}
                <ChevronDown className={cn("h-5 w-5 shrink-0 text-[var(--lp-violet-700)] transition", isOpen && "rotate-180")} />
              </button>
              {isOpen && <p className="px-5 pb-5 text-[var(--lp-ink-soft)]">{faq.answer}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
