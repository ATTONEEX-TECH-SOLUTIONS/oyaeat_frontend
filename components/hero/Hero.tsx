"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Download, ArrowRight, Users, Star, UtensilsCrossed, Wine, ShoppingBag } from "lucide-react";
import jollofImage from "@/public/jollof.png";
import kitchenBg from "@/public/bg-jollof.png";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-4 min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image 
          src={kitchenBg}
          alt="Kitchen background"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay for readability */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/30 to-[#2d5f4f]/10"></div> */}
      </div>

      {/* Diagonal Slash at Bottom */}
      <div className="absolute bottom-0 right-0 w-full h-40 bg-gradient-to-r from-[#2d5f4f] to-[#3a7a63] origin-bottom-right -skew-y-2 shadow-2xl"></div>

      <div className="max-w-[1400px] mx-auto w-full relative z-10 px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* LEFT - Text Content */}
          <div className="space-y-8 order-2 lg:order-1">
            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 leading-[1.1] tracking-tight">
              Better chow,{" "}
              <span className="text-[#2d5f4f]">no wahala.</span>
            </h1>

            {/* Subtext with Icons */}
            <div className="space-y-4">
              <p className="text-xl sm:text-2xl lg:text-3xl text-gray-700 leading-relaxed font-medium max-w-2xl">
                <span className="inline-flex items-center gap-2">
                  <UtensilsCrossed className="w-7 h-7 text-orange-500" />
                  Hot food,
                </span>{" "}
                <span className="inline-flex items-center gap-2">
                  <Wine className="w-7 h-7 text-blue-500" />
                  cold drinks,
                </span>{" "}
                <span className="inline-flex items-center gap-2">
                  and
                  <ShoppingBag className="w-7 h-7 text-green-600" />
                  groceries
                </span>{" "}
                straight to your doorstep.
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl text-[#2d5f4f] font-bold">
                Order sharp sharp. Chop happy.
              </p>
            </div>

            {/* Location Input */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter your delivery address"
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-[#2d5f4f] focus:outline-none transition-colors bg-white/90 backdrop-blur-sm"
                />
              </div>
              <Link
                href="/partner-signup"
                className="px-8 py-4 bg-[#2d5f4f] text-white font-bold text-lg rounded-2xl hover:bg-[#234a3d] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-gray-900 text-white font-bold text-lg rounded-2xl hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-3">
                <Download className="w-5 h-5" />
                Download App
              </button>
              <button className="px-8 py-4 border-2 border-[#2d5f4f] text-[#2d5f4f] font-bold text-lg rounded-2xl hover:bg-[#2d5f4f] hover:text-white transition-all duration-300 hover:scale-105">
                Learn More
              </button>
              
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#2d5f4f] border-2 border-white flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900">5,000+</span>
                  <span className="text-sm font-semibold text-gray-600">Happy Customers</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center shadow-lg">
                  <Star className="w-6 h-6 text-white fill-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900">4.8</span>
                  <span className="text-sm font-semibold text-gray-600">Rating</span>
                </div>
              </div>
            </div>
          </div>

         
        </div>
      </div>
    </section>
  );
};

export default Hero;
