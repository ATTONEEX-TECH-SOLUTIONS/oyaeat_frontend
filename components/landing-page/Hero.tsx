"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Download, ArrowRight, Star, UtensilsCrossed, Wine, ShoppingBag, Clock, Zap } from "lucide-react";
import kitchenBg from "@/public/bg-jollof.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-[72px] overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={kitchenBg}
          alt="OyaEat Kitchen Hub"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/*
          Scrim strategy:
          - Left side stays readable for content
          - Right side opens up so the image is clearly visible
          - A very subtle dark base overlay improves overall contrast without killing the photo
        */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 lg:via-white/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-10 relative z-10">
        <div className="max-w-[560px] space-y-6 py-16">

          {/* Live Badge */}
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-3.5 py-1.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-[11px] font-bold text-gray-700 tracking-widest uppercase">Delivering now in Abuja</span>
          </div>

          {/* Headline */}
          <div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.08] tracking-tight">
              Better chow,
            </h1>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#2d5f4f] leading-[1.08] tracking-tight">
              no wahala.
            </h1>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: UtensilsCrossed, label: "Hot Food", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
              { icon: Wine, label: "Cold Drinks", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
              { icon: ShoppingBag, label: "Groceries", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
            ].map(({ icon: Icon, label, bg, text, border }) => (
              <span
                key={label}
                className={`inline-flex items-center gap-1.5 ${bg} ${text} px-3 py-1.5 rounded-full text-xs font-bold border ${border} tracking-wide`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </span>
            ))}
          </div>

          {/* Sub-headline */}
          <p className="text-base font-medium text-gray-600 leading-relaxed max-w-sm">
            Order from hundreds of local restaurants and shops.{" "}
            <span className="text-[#2d5f4f] font-bold">Delivered in 30 mins or less.</span>
          </p>

          {/* Address Input */}
          <div className="flex flex-col sm:flex-row gap-0 bg-white rounded-xl border-2 border-gray-200 shadow-lg max-w-lg focus-within:border-[#2d5f4f] transition-colors duration-200 overflow-hidden">
            <div className="flex-1 flex items-center px-4">
              <MapPin className="text-[#2d5f4f] w-4 h-4 flex-shrink-0" />
              <input
                type="text"
                placeholder="Enter your delivery address"
                className="w-full pl-3 pr-2 py-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent font-medium"
              />
            </div>
            <Link
              href="/customer"
              className="px-6 py-3.5 bg-[#2d5f4f] text-white font-bold text-sm hover:bg-[#234a3d] transition-colors duration-200 flex items-center justify-center gap-2 group whitespace-nowrap"
            >
              Find Food
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </div>

          {/* ETA Info */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-gray-600 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#2d5f4f]" />
              Avg. delivery: <strong className="text-gray-900 ml-1">28 min</strong>
            </div>
            <div className="w-px h-3.5 bg-gray-300" />
            <div className="flex items-center gap-1.5 text-gray-600 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Express: <strong className="text-gray-900 ml-1">15 min</strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-lg hover:bg-gray-800 transition-colors duration-200">
              <Download className="w-4 h-4" />
              Download App
            </button>
            <button className="px-5 py-2.5 border-2 border-gray-300 bg-white/70 backdrop-blur-sm text-gray-700 font-bold text-sm rounded-lg hover:border-[#2d5f4f] hover:text-[#2d5f4f] transition-colors duration-200">
              Browse Restaurants
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-5 pt-4 border-t border-gray-200/70">
            <div className="flex -space-x-2">
              {[
                { bg: "bg-orange-400", initial: "A" },
                { bg: "bg-teal-500", initial: "B" },
                { bg: "bg-purple-400", initial: "C" },
                { bg: "bg-pink-400", initial: "D" },
                { bg: "bg-amber-400", initial: "E" },
              ].map(({ bg, initial }) => (
                <div
                  key={initial}
                  className={`w-7 h-7 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold`}
                >
                  {initial}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                ))}
                <span className="text-sm font-black text-gray-900 ml-1">4.8</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Loved by 5,000+ customers in Abuja</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;