import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Flame } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import type { Restaurant } from "./data";

export default function NearbyRestaurants({ data }: { data: Restaurant[] }) {
  return (
    <section
      aria-label="Popular restaurants"
      className="py-16 lg:py-20 px-5 lg:px-10 max-w-[1400px] mx-auto"
    >
      <SectionHeading
        eyebrow="Trending near you"
        icon={<Flame className="w-3.5 h-3.5" />}
        title="Popular restaurants"
        subtitle="Top-rated kitchens delivering sharp sharp to your door."
        href="/customer"
        hrefLabel="See all"
      />

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        {data.map((r) => (
          <li key={r.id}>
            <Link
              href="/customer"
              className="group h-full flex flex-col bg-white rounded-3xl overflow-hidden border-2 border-[var(--lp-cream)] hover:border-[var(--lp-violet-700)] hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(91,33,182,0.18)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lp-violet-700)]"
            >
              <span className="relative block h-48 bg-[var(--lp-cream)] overflow-hidden">
                <Image
                  src={r.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {r.isPopular && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-[var(--lp-mango)] text-[var(--lp-violet-950)] text-[11px] font-extrabold tracking-wide uppercase px-2.5 py-1 rounded-full shadow">
                    <Flame className="w-3 h-3" />
                    Popular
                  </span>
                )}
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-[var(--lp-cream)] text-[var(--lp-ink)] text-xs font-extrabold px-3 py-1.5 rounded-full shadow">
                  <Clock className="w-3.5 h-3.5 text-[var(--lp-violet-700)]" />
                  {r.time}
                </span>
              </span>

              <span className="flex flex-col flex-1 p-4 gap-3">
                <span>
                  <span className="block font-extrabold text-[var(--lp-violet-900)] text-base leading-tight line-clamp-1">
                    {r.name}
                  </span>
                  <span className="block text-sm text-[var(--lp-ink-soft)] mt-1 font-medium">
                    {r.cuisine}
                  </span>
                </span>
                <span className="mt-auto flex items-center justify-between pt-3 border-t border-[var(--lp-cream)]">
                  <span className="flex items-center gap-1 text-sm font-extrabold text-[var(--lp-ink)]">
                    <Star className="w-4 h-4 fill-[var(--lp-mango)] text-[var(--lp-mango)]" />
                    {r.rating.toFixed(1)}
                  </span>
                  <span className="text-xs font-extrabold text-[var(--lp-violet-700)] bg-[var(--lp-violet-100)] px-2.5 py-1 rounded-full">
                    {r.price}
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
