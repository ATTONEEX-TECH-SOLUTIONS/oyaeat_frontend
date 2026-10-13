"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { MapPin, ArrowRight, Clock, Zap, Star, BadgeCheck } from "lucide-react";

const dishes = [
  {
    src: "/landing/opt/pounded-yam-egusi.webp",
    alt: "Pounded yam with egusi soup",
    pos: "left-[28%] top-0",
    size: "w-[46%]",
    delay: "0s",
  },
  {
    src: "/landing/opt/ofada.webp",
    alt: "Ofada rice with assorted meat",
    pos: "left-0 top-[30%]",
    size: "w-[43%]",
    delay: "1.2s",
  },
  {
    src: "/landing/opt/suya.webp",
    alt: "Suya and grilled skewers",
    pos: "right-0 top-[27%]",
    size: "w-[43%]",
    delay: "0.6s",
  },
  {
    src: "/landing/opt/9.webp",
    alt: "Rice and plantain plate",
    pos: "left-[27%] top-[54%]",
    size: "w-[46%]",
    delay: "1.8s",
  },
];

function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={`absolute pointer-events-none ${className}`}
    >
      <path d="M6 58C6 28 24 6 58 6c0 34-22 52-52 52z" fill="var(--lp-leaf)" />
      <path
        d="M10 54C24 38 38 24 54 10"
        stroke="#3f9d2b"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

const Hero = () => {
  const router = useRouter();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push("/customer");
  };

  return (
    <section className="lp-doodles relative overflow-hidden pt-[72px]">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 grid lg:grid-cols-[1.05fr_1fr] items-center gap-6 lg:gap-4 pt-10 pb-16 lg:pt-14 lg:pb-24 min-h-[calc(100svh-0px)] lg:min-h-[720px]">
        {/* Copy */}
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 text-white text-xs font-extrabold tracking-wide uppercase px-3.5 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--lp-leaf)] animate-pulse" />
            Now delivering across Abuja
          </span>

          <h1 className="lp-display font-extrabold leading-[0.98] text-[clamp(2.75rem,8vw,5.75rem)] text-[var(--lp-cream)]">
            Better chow,
            <br />
            <span className="text-[var(--lp-mango)]">no wahala.</span>
          </h1>

          <p className="mt-5 text-lg text-white/85 font-medium max-w-md leading-relaxed">
            From hot swallows to suya and shawarma, your next meal is just a tap
            away. Hundreds of local restaurants, delivered in 30 minutes or
            less.
          </p>

          <form
            onSubmit={onSubmit}
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl"
          >
            <label className="flex-1 min-w-0 flex items-center gap-3 bg-[var(--lp-cream-50)] rounded-full px-5 border-2 border-transparent focus-within:border-[var(--lp-mango)] shadow-[0_6px_0_rgba(26,16,51,0.25)] transition-colors">
              <MapPin
                className="w-5 h-5 text-[var(--lp-violet-700)] flex-shrink-0"
                aria-hidden="true"
              />
              <span className="sr-only">Delivery address</span>
              <input
                type="text"
                name="address"
                autoComplete="street-address"
                placeholder="Enter your delivery address"
                className="w-full min-w-0 py-4 bg-transparent text-[var(--lp-ink)] placeholder:text-[var(--lp-ink-soft)]/70 font-semibold text-[15px] focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="group inline-flex items-center justify-center gap-2 bg-[var(--lp-mango)] text-[var(--lp-violet-950)] font-extrabold text-base rounded-full px-7 py-4 shadow-[0_6px_0_#c98a06] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_2px_0_#c98a06] transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Find food
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/85 font-semibold">
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--lp-mango)]" />
              Avg. delivery <strong className="text-white">28 min</strong>
            </li>
            <li className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[var(--lp-mango)]" />
              Express <strong className="text-white">15 min</strong>
            </li>
            <li className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[var(--lp-mango)] fill-[var(--lp-mango)]" />
              Top-rated vendors
            </li>
          </ul>
        </div>

        {/* Photo cluster */}
        <div className="relative z-10 mx-auto w-full max-w-[560px] aspect-square mt-6 lg:mt-0">
          {dishes.map((d, i) => (
            <div
              key={d.src}
              className={`absolute ${d.pos} ${d.size} aspect-square lp-float`}
              style={{ animationDelay: d.delay, zIndex: i === 3 ? 3 : 2 }}
            >
              <div className="relative w-full h-full rounded-full overflow-hidden border-[6px] sm:border-[8px] border-[var(--lp-cream)] bg-[var(--lp-cream)] shadow-[0_14px_30px_rgba(26,16,51,0.35)]">
                <Image
                  src={d.src}
                  alt={d.alt}
                  fill
                  priority={i < 2}
                  sizes="(max-width: 1024px) 45vw, 260px"
                  className="object-cover"
                />
              </div>
            </div>
          ))}

          {/* Pills */}
          <div className="absolute right-[2%] top-[14%] z-10 rounded-xl bg-[var(--lp-cream)] text-[var(--lp-ink)] font-extrabold text-sm sm:text-base px-4 py-2 shadow-[0_5px_0_rgba(26,16,51,0.3)] rotate-[3deg]">
            Order now
          </div>
          <div className="absolute left-[-2%] bottom-[22%] z-10 flex items-center gap-1.5 rounded-xl bg-[var(--lp-cream)] text-[var(--lp-ink)] font-extrabold text-xs sm:text-sm px-3.5 py-2 shadow-[0_5px_0_rgba(26,16,51,0.3)] -rotate-[3deg]">
            <BadgeCheck className="w-4 h-4 text-[var(--lp-violet-700)]" />
            Fast delivery
          </div>

          <Leaf className="w-10 h-10 -left-3 top-[6%] rotate-[-30deg] opacity-90" />
          <Leaf className="w-12 h-12 -right-2 bottom-[8%] rotate-[100deg] opacity-90" />
          <Leaf className="w-8 h-8 right-[18%] -top-2 rotate-[40deg] opacity-80" />
        </div>
      </div>

      {/* Scalloped hand-off into the cream page */}
      <svg
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute bottom-[-1px] left-0 w-full h-8 sm:h-12 text-[var(--lp-cream-50)]"
      >
        <path
          fill="currentColor"
          d="M0 48V24c120 20 240 24 360 12S600 4 720 8s240 28 360 30 240-10 360-22v32z"
        />
      </svg>
    </section>
  );
};

export default Hero;
