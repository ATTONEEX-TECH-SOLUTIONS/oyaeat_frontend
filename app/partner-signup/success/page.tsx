"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "@/public/spalsh_oyaeat (3).png";

const SuccessPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="py-6 px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image
              src={logo}
              alt="OyaEat Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold">
            <span className="text-[#2d5f4f]">Oya</span>
            <span className="text-gray-900">Eat</span>
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl text-center">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for partnering with OyaEat. Your business information and documents have been submitted for review.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What happens next?</h2>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-[#2d5f4f] font-bold">1.</span>
                <span className="text-gray-700">Our team will review your application and documents within 2-3 business days.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#2d5f4f] font-bold">2.</span>
                <span className="text-gray-700">You'll receive an email notification once your application is approved.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#2d5f4f] font-bold">3.</span>
                <span className="text-gray-700">After approval, you can start setting up your menu and accepting orders!</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-900">
              <strong>Application ID:</strong> OYA-{Math.random().toString(36).substr(2, 9).toUpperCase()}
              <br />
              <span className="text-blue-700">Save this for your records. You'll receive updates via email.</span>
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 border-2 border-[#2d5f4f] text-[#2d5f4f] font-semibold rounded-lg hover:bg-[#2d5f4f] hover:text-white transition-all duration-300"
            >
              Back to Home
            </button>
            <button
              onClick={() => router.push('/partner-signup')}
              className="px-8 py-3 bg-[#2d5f4f] text-white font-semibold rounded-lg hover:bg-[#234a3d] transition-all duration-300"
            >
              View Application Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;