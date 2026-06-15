"use client";

import NextImage from "next/image";
import Link from "next/link";
import { ArrowRight, Bike, Store, Briefcase } from "lucide-react";
import riderImage from "@/public/rider.png";
import chefImage from "@/public/vendor.png";
import careersImage from "@/public/career.png";

const opportunities = [
  {
    id: 1,
    image: riderImage,
    icon: Bike,
    eyebrow: "Flexible hours",
    title: "Become a Rider",
    description: "Earn on your own schedule. Deliver food across Abuja and get paid weekly.",
    buttonText: "Start Earning",
    link: "/rider",
    // Unique organic blob paths — each card has a different silhouette
    outerBlob: "M160,12 C218,8 305,72 308,152 C311,232 258,298 182,312 C106,326 30,288 10,210 C-10,132 18,52 80,26 C110,13 130,14 160,12 Z",
    innerBlob: "M140,18 C190,14 262,68 264,138 C266,208 218,266 152,278 C86,290 24,254 8,184 C-8,114 20,44 72,22 C98,10 116,20 140,18 Z",
    clipBlob: "M112,10 C152,6 206,48 208,108 C210,168 170,210 118,218 C66,226 18,196 6,144 C-6,88 16,34 58,16 C76,8 92,12 112,10 Z",
    ringColor: "#2d5f4f",
    innerFill: "#f0fdf4",
  },
  {
    id: 2,
    image: chefImage,
    icon: Store,
    eyebrow: "Grow your business",
    title: "Become a Partner",
    description: "Reach thousands of hungry customers in Abuja. Zero upfront cost to get started.",
    buttonText: "Get Started",
    link: "/partner-signup",
    outerBlob: "M155,8 C225,4 318,58 320,148 C322,238 264,308 178,318 C92,328 12,272 4,186 C-4,100 38,28 108,12 C128,6 142,10 155,8 Z",
    innerBlob: "M138,14 C200,10 278,58 280,138 C282,218 230,280 156,290 C82,300 10,252 4,172 C-2,92 36,22 98,10 C120,4 124,16 138,14 Z",
    clipBlob: "M108,8 C162,4 218,44 220,112 C222,180 178,222 116,230 C54,238 4,198 2,132 C0,66 36,14 84,8 C96,6 100,10 108,8 Z",
    ringColor: "#f97316",
    innerFill: "#fff7ed",
  },
  {
    id: 3,
    image: careersImage,
    icon: Briefcase,
    eyebrow: "Join the team",
    title: "Careers",
    description: "Help build the future of food delivery in Africa. Engineering, ops, design — we are hiring.",
    buttonText: "View Openings",
    link: "/careers",
    outerBlob: "M162,14 C230,6 312,68 314,158 C316,248 254,312 168,320 C82,328 6,268 2,180 C-2,92 44,18 118,8 C136,4 150,18 162,14 Z",
    innerBlob: "M142,18 C202,12 274,64 276,144 C278,224 224,282 148,290 C72,298 6,248 2,166 C-2,84 40,14 104,8 C124,4 130,22 142,18 Z",
    clipBlob: "M110,10 C158,4 212,46 214,114 C216,182 170,224 108,230 C46,236 2,196 2,128 C2,60 40,14 84,8 C96,4 102,14 110,10 Z",
    ringColor: "#3b82f6",
    innerFill: "#eff6ff",
  },
];

const LetsDoItTogether = () => {
  return (
    <section className="py-24 px-6 lg:px-10 bg-gradient-to-br from-[#e8f5f1] via-[#f0faf7] to-[#dceee8]">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-[#2d5f4f]/20 text-[#2d5f4f] text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-5 shadow-sm">
            Opportunities
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.08] mb-4">
            Let&apos;s do it{" "}
            <span className="text-[#2d5f4f]">together.</span>
          </h2>
          <p className="text-gray-500 text-base font-medium leading-relaxed">
            Whether you ride, cook, or build — there is a place for you in the OyaEat family.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-14">
          {opportunities.map((opp) => {
            const Icon = opp.icon;
            return (
              <div
                key={opp.id}
                className="flex flex-col items-center text-center group"
              >
                {/* Blob Image Stack */}
                <div className="relative w-72 h-72 flex items-center justify-center mb-8 cursor-pointer">

                  {/* Outer ring blob */}
                  <svg
                    viewBox="0 0 320 320"
                    className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d={opp.outerBlob} fill={opp.ringColor} />
                  </svg>

                  {/* Decorative dots — top right of blob */}
                  <svg
                    viewBox="0 0 60 60"
                    className="absolute -top-2 -right-2 w-14 h-14 opacity-40"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {[0,1,2].map(row =>
                      [0,1,2].map(col => (
                        <circle
                          key={`${row}-${col}`}
                          cx={10 + col * 20}
                          cy={10 + row * 20}
                          r="3"
                          fill={opp.ringColor}
                        />
                      ))
                    )}
                  </svg>

                  {/* Inner fill blob */}
                  <svg
                    viewBox="0 0 280 280"
                    className="absolute w-[268px] h-[268px] m-auto z-[3]"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d={opp.innerBlob} fill={opp.innerFill} />
                  </svg>

                  {/* Image with unique clip blob */}
                  <div className="relative w-56 h-56 z-10 transition-transform duration-500 group-hover:scale-105">
                    <svg
                      viewBox="0 0 224 224"
                      className="w-full h-full drop-shadow-xl"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <clipPath id={`clip-${opp.id}`}>
                          <path d={opp.clipBlob} />
                        </clipPath>
                      </defs>
                      <image
                        href={opp.image.src}
                        x="0"
                        y="0"
                        width="224"
                        height="224"
                        clipPath={`url(#clip-${opp.id})`}
                        preserveAspectRatio="xMidYMid slice"
                      />
                    </svg>
                  </div>

                  {/* Icon badge — anchored bottom-left of blob */}
                  <div
                    className="absolute bottom-4 -left-2 z-20 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border-2 border-white transition-transform duration-300 group-hover:-translate-y-1"
                    style={{ backgroundColor: opp.ringColor }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Text */}
                <div className="space-y-2 mb-5 max-w-xs">
                  <p
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: opp.ringColor }}
                  >
                    {opp.eyebrow}
                  </p>
                  <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-[#2d5f4f] transition-colors duration-200">
                    {opp.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    {opp.description}
                  </p>
                </div>

                {/* CTA */}
                <Link
                  href={opp.link}
                  className="inline-flex items-center gap-2 bg-white border-2 text-gray-800 font-bold text-sm px-6 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200 group/btn"
                  style={{ borderColor: opp.ringColor }}
                >
                  <span style={{ color: opp.ringColor }} className="group-hover/btn:translate-x-0 transition-transform">
                    {opp.buttonText}
                  </span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5"
                    style={{ color: opp.ringColor }}
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LetsDoItTogether;