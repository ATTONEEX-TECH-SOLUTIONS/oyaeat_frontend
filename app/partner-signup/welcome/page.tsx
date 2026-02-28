"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "@/public/spalsh_oyaeat (3).png";

const WelcomePage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="py-6 px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image
              src={logo}
              alt="OyaEats Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold">
            <span className="text-[#2d5f4f]">Oya</span>
            <span className="text-gray-900">Eats</span>
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-20">
            {/* Left Side - Content */}
            <div className="flex-1 w-full max-w-md">
              <h2 className="text-[#2d5f4f] text-xl font-semibold mb-4">
                Welcome
              </h2>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Thank you for signing up
              </h1>
              <p className="text-gray-600 text-base mb-12">
                Below you will see the required details we need from you.
              </p>

              {/* Steps */}
              <div className="space-y-8 mb-12">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-[#2d5f4f] text-lg font-semibold mb-2">
                    Step 1
                  </h3>
                  <p className="text-gray-900 text-base">Add your business</p>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-[#2d5f4f] text-lg font-semibold mb-2">
                    Step 2
                  </h3>
                  <p className="text-gray-900 text-base">Verify your business</p>
                </div>
              </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="flex-1 w-full flex justify-center items-center">
              <div className="relative w-full max-w-sm">
                {/* Celebration illustration placeholder - you can replace with actual image */}
                <div className="w-full h-80 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🎉</div>
                    <div className="text-6xl text-[#2d5f4f]">🙌</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 px-8">
        <div className="w-full max-w-6xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push('/partner-signup')}
            className="text-[#2d5f4f] font-medium hover:underline flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            See Progress
          </button>

          <button
            onClick={() => router.push('/partner-signup/add-business')}
            className="bg-[#2d5f4f] hover:bg-[#234a3d] text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
          >
            Next
          </button>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;