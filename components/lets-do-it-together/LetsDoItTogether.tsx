"use client";

import NextImage from "next/image";
import riderImage from "@/public/rider.png";
import chefImage from "@/public/vendor.png";
import careersImage from "@/public/career.png";


const LetsDoItTogether = () => {
  const opportunities = [
    {
      id: 1,
      image: riderImage,
      title: "Become a rider",
      description: "Join our team of riders and earn money on your own schedule",
      buttonText: "Sign Up",
      link: "/rider-signup"
    },
    {
      id: 2,
      image: chefImage,
      title: "Become a partner",
      description: "Partner with us and grow your restaurant business",
      buttonText: "Get Started",
      link: "/partner-signup"
    },
    {
      id: 3,
      image: careersImage,
      title: "Careers",
      description: "Join our team and help us deliver happiness",
      buttonText: "View Openings",
      link: "/careers"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#e8f5f1] to-[#d4ebe5]">
      <div className="max-w-7xl mx-auto">
        {/* Header with Icon */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#2d5f4f] rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Let's do it together
          </h2>
        </div>

        {/* Three Cards */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {opportunities.map((opportunity, index) => (
            <div key={opportunity.id} className="flex flex-col items-center group">
              <div className="relative mb-6 w-80 h-80 flex items-center justify-center cursor-pointer">
                {/* OUTER Blob Shape - Green Border/Ring */}
                <svg 
                  viewBox="0 0 320 320" 
                  className="absolute inset-0 w-full h-full"
                >
                  <path
                    d="M 160,10 
                       C 240,10 310,80 310,160
                       C 310,195 298,225 275,248
                       C 252,271 220,288 185,298
                       C 150,308 115,308 80,298
                       C 45,288 20,271 10,240
                       C 0,209 0,175 10,142
                       C 20,109 45,76 80,53
                       C 115,30 140,10 160,10 Z"
                    fill="#2d5f4f"
                  />
                </svg>
                
                {/* INNER Blob Shape - Light Background */}
                <svg 
                  viewBox="0 0 280 280" 
                  className="absolute inset-0 w-[280px] h-[280px] m-auto z-[5]"
                >
                  <path
                    d="M 140,15 
                       C 210,15 265,70 265,140
                       C 265,172 254,200 234,221
                       C 214,242 186,255 155,263
                       C 124,271 93,271 62,263
                       C 31,255 15,242 8,214
                       C 1,186 1,155 8,126
                       C 15,97 31,68 62,48
                       C 93,28 118,15 140,15 Z"
                    fill="#f0fdf4"
                  />
                </svg>
                
                {/* Image container with blob mask */}
                <div className="relative w-56 h-56 z-10">
                  <svg viewBox="0 0 224 224" className="w-full h-full drop-shadow-2xl">
                    <defs>
                      <clipPath id={`blob-clip-${opportunity.id}`}>
                        <path
                          d="M 112,8 
                             C 160,8 200,48 200,96
                             C 200,118 194,138 183,154
                             C 172,170 157,182 139,190
                             C 121,198 101,198 83,190
                             C 65,182 52,170 43,154
                             C 34,138 29,122 29,106
                             C 29,90 36,74 47,61
                             C 58,48 73,38 91,33
                             C 100,30 109,8 112,8 Z"
                        />
                      </clipPath>
                    </defs>
                    <image
                      href={opportunity.image.src}
                      width="224"
                      height="224"
                      clipPath={`url(#blob-clip-${opportunity.id})`}
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 transition-colors duration-300 group-hover:text-[#2d5f4f]">
                {opportunity.title}
              </h3>
              <p className="text-gray-600 text-center mb-6 max-w-sm">
                {opportunity.description}
              </p>
              <a href={opportunity.link}>
                <button className="bg-[#2d5f4f] hover:bg-[#234a3d] text-white font-bold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                  {opportunity.buttonText}
                </button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LetsDoItTogether;