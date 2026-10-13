import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Sparkles } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import type { RecommendationItem } from "./data";

export default function PersonalizedRecommendations({
  data,
}: {
  data: RecommendationItem[];
}) {
  return (
    <section
      aria-label="Popular dishes"
      className="py-16 lg:py-20 px-5 lg:px-10 max-w-[1400px] mx-auto"
    >
      <SectionHeading
        eyebrow="Chow we love"
        icon={<Sparkles className="w-3.5 h-3.5" />}
        title="Dishes people keep ordering"
        subtitle="Naija classics, made fresh and sent your way."
        href="/customer"
        hrefLabel="See all dishes"
      />

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        {data.map((item) => (
          <li key={item.id}>
            <Link
              href="/customer"
              className="group h-full flex flex-col bg-[var(--lp-cream)] rounded-3xl p-3 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(91,33,182,0.18)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lp-violet-700)]"
            >
              <span className="relative block aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 bg-[var(--lp-cream-50)] text-[var(--lp-ink)] text-xs font-extrabold px-2.5 py-1 rounded-full shadow">
                  <Clock className="w-3.5 h-3.5 text-[var(--lp-violet-700)]" />
                  {item.time}
                </span>
              </span>

              <span className="flex flex-col flex-1 gap-3 px-2 pt-4 pb-2">
                <span>
                  <span className="block font-extrabold text-[var(--lp-violet-900)] text-base leading-tight line-clamp-2">
                    {item.name}
                  </span>
                  <span className="block text-sm text-[var(--lp-ink-soft)] mt-1 font-medium line-clamp-1">
                    {item.restaurant}
                  </span>
                </span>
                <span className="mt-auto flex items-center justify-between">
                  <span className="lp-display text-xl font-extrabold text-[var(--lp-violet-700)]">
                    {item.price}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-extrabold text-[var(--lp-ink)]">
                    <Star className="w-4 h-4 fill-[var(--lp-mango)] text-[var(--lp-mango)]" />
                    {item.rating.toFixed(1)}
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
