"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  ArrowRight,
  UtensilsCrossed,
  Wine,
  ShoppingBag,
  Clock,
  Zap,
} from "lucide-react";
import riderImage from "@/public/oyaeat-rider.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f7faf9] pt-[72px]">
      {/* Subtle background accents */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#2d5f4f]/[0.06] rounded-full blur-3xl" />

        <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] bg-[#2d5f4f]/[0.05] rounded-full blur-3xl" />
      </div>

      {/* 
        Rider
        Positioned absolutely behind the content.
        
        Increased size with scale-[1.1]
        Pushed slightly to the right with translate-x-[24px]
        
        The z-0 keeps it underneath the text overlay.
      */}
      <div
        className="hidden lg:block absolute left-0 z-0"
        style={{
          top: "72px",
          bottom: 0,
          width: "44%",
          minWidth: "460px",
          maxWidth: "620px",
        }}
      >
        <Image
          src={riderImage}
          alt="OyaEat delivery rider"
          fill
          priority
          sizes="44vw"
          className="
            object-contain
            object-left-bottom
            scale-[1.1]
            translate-x-[24px]
            origin-bottom-left
          "
        />
      </div>

      {/* 
        Full-width content container.
        KEEPING THIS FIXED — no max-width restriction.
        This allows the headline to continue stretching to the right.
      */}
      <div className="w-full px-6 lg:px-10 relative z-40">
        <div className="flex flex-col lg:block">
          {/* Main content */}
          <div
            className="
              relative
              z-10
              w-full
              space-y-6
              py-12
              lg:py-16
              lg:pl-[27%]
              xl:pl-[26%]
            "
          >
            {/* =========================
                HEADLINE
            ========================== */}
            <div className="w-full">
              <h1
                className="
                  whitespace-nowrap
                  text-5xl
                  sm:text-6xl
                  lg:text-7xl
                  xl:text-8xl
                  font-black
                  text-gray-900
                  leading-[1.08]
                  tracking-tight
                "
              >
                Better chow, no
              </h1>

              <h1
                className="
                  whitespace-nowrap
                  text-5xl
                  sm:text-6xl
                  lg:text-7xl
                  xl:text-8xl
                  font-black
                  text-[#2d5f4f]
                  leading-[1.08]
                  tracking-tight
                "
              >
                wahala.
              </h1>
            </div>

            {/* =========================
                CATEGORY PILLS
            ========================== */}
            <div className="flex flex-wrap gap-2">
              {[
                {
                  icon: UtensilsCrossed,
                  label: "Hot Food",
                  bg: "bg-orange-50",
                  text: "text-orange-700",
                  border: "border-orange-200",
                },
                {
                  icon: Wine,
                  label: "Cold Drinks",
                  bg: "bg-blue-50",
                  text: "text-blue-700",
                  border: "border-blue-200",
                },
                {
                  icon: ShoppingBag,
                  label: "Groceries",
                  bg: "bg-emerald-50",
                  text: "text-emerald-700",
                  border: "border-emerald-200",
                },
              ].map(({ icon: Icon, label, bg, text, border }) => (
                <span
                  key={label}
                  className={`
                      inline-flex
                      items-center
                      gap-1.5
                      ${bg}
                      ${text}
                      px-3
                      py-1.5
                      rounded-full
                      text-xs
                      font-bold
                      border
                      ${border}
                      tracking-wide
                    `}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </span>
              ))}
            </div>

            {/* =========================
                SUB HEADLINE
            ========================== */}
            <p className="text-base font-medium text-gray-600 leading-relaxed max-w-md">
              Order from hundreds of local restaurants and shops.{" "}
              <span className="text-[#2d5f4f] font-bold">
                Delivered in 30 mins or less.
              </span>
            </p>

            {/* =========================
                ADDRESS INPUT
            ========================== */}
            <div
              className="
                flex
                flex-col
                sm:flex-row
                gap-0
                bg-white
                rounded-xl
                border-2
                border-gray-200
                shadow-lg
                max-w-xl
                focus-within:border-[#2d5f4f]
                transition-colors
                duration-200
                overflow-hidden
              "
            >
              <div className="flex-1 min-w-0 flex items-center px-4">
                <MapPin className="text-[#2d5f4f] w-4 h-4 flex-shrink-0" />

                <input
                  type="text"
                  placeholder="Enter your delivery address"
                  className="
                    w-full
                    min-w-0
                    pl-3
                    pr-2
                    py-3.5
                    text-sm
                    text-gray-800
                    placeholder-gray-400
                    focus:outline-none
                    bg-transparent
                    font-medium
                  "
                />
              </div>

              <Link
                href="/customer"
                className="
                  shrink-0
                  px-6
                  py-3.5
                  bg-[#2d5f4f]
                  text-white
                  font-bold
                  text-sm
                  hover:bg-[#234a3d]
                  transition-colors
                  duration-200
                  flex
                  items-center
                  justify-center
                  gap-2
                  group
                  whitespace-nowrap
                "
              >
                Find Food
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </div>

            {/* =========================
                ETA INFO
            ========================== */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#2d5f4f]" />

                <span>
                  Avg. delivery:
                  <strong className="text-gray-900 ml-1">28 min</strong>
                </span>
              </div>

              <div className="w-px h-3.5 bg-gray-300" />

              <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-500" />

                <span>
                  Express:
                  <strong className="text-gray-900 ml-1">15 min</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          MOBILE RIDER
      ========================== */}
      <div className="lg:hidden relative z-10 -mt-4 pb-8 flex justify-center px-4">
        <div className="relative w-full max-w-[420px] aspect-[848/1256]">
          <Image
            src={riderImage}
            alt="OyaEat delivery rider"
            fill
            sizes="90vw"
            className="object-contain object-bottom"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
