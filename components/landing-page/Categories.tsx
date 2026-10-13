import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "./SectionHeading";
import type { Category } from "./data";

export default function Categories({ data }: { data: Category[] }) {
  return (
    <section
      aria-labelledby="categories-heading"
      className="py-16 lg:py-20 px-5 lg:px-10 max-w-[1400px] mx-auto"
    >
      <div id="categories-heading" className="sr-only">
        Browse categories
      </div>
      <SectionHeading
        eyebrow="Browse categories"
        title="What's for lunch?"
        subtitle="Pick a craving and we'll show you who's cooking it nearby."
        href="/customer"
        hrefLabel="All categories"
      />

      <ul className="flex gap-5 sm:gap-7 overflow-x-auto pb-4 -mx-5 px-5 lg:mx-0 lg:px-0 lg:justify-between snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {data.map((c) => (
          <li key={c.name} className="snap-start flex-shrink-0">
            <Link
              href="/customer"
              className="group flex flex-col items-center gap-3 w-[112px] sm:w-[132px] rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--lp-violet-700)]"
            >
              <span className="relative block w-[112px] h-[112px] sm:w-[132px] sm:h-[132px] rounded-full overflow-hidden border-[5px] border-[var(--lp-cream)] bg-[var(--lp-cream)] ring-2 ring-transparent group-hover:ring-[var(--lp-mango)] shadow-[0_8px_18px_rgba(91,33,182,0.18)] group-hover:-translate-y-1 transition-all duration-200">
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="132px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </span>
              <span className="text-sm font-extrabold text-center leading-tight text-[var(--lp-violet-900)] group-hover:text-[var(--lp-violet-700)]">
                {c.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
