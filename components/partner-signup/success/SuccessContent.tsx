"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowLeft, LayoutDashboard } from "lucide-react";

export default function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [businessName, setBusinessName] = useState("your business");
  const [trackingId, setTrackingId] = useState("OYA-APP-PENDING");

  useEffect(() => {
    const queryBusinessName = searchParams.get("businessName");
    const queryBusinessId = searchParams.get("businessId");

    let finalName = queryBusinessName || "your business";
    let baseId = queryBusinessId || "0";

    if (!queryBusinessId && typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("businessData") || localStorage.getItem("businessData");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.businessId) baseId = String(parsed.businessId);
          if (parsed?.businessName) finalName = parsed.businessName;
        }
      } catch (err) {
        console.error("Cache read failed:", err);
      }
    }

    setBusinessName(finalName);
    const paddedId = String(baseId).padStart(4, "0");
    setTrackingId(`OYA-APP-${paddedId}`);
  }, [searchParams]);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col select-none">
      {/* Header */}
      <header className="h-16 border-b border-gray-50 px-6 md:px-10 flex items-center flex-shrink-0">
        <div className="max-w-[1400px] w-full mx-auto">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="flex flex-col">
              <span className="text-2xl font-black leading-none tracking-tight">
                <span className="text-[#2d5f4f]">Oya</span>
                <span className="text-gray-900">Eat</span>
              </span>
              <span className="text-[9px] font-bold tracking-wider uppercase text-gray-500 mt-0.5">
                Fast Delivery
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-6">
        <div className="w-full max-w-xl text-center space-y-5 flex flex-col justify-center">
          
          {/* Success Badge */}
          <div className="flex justify-center flex-shrink-0">
            <div className="w-14 h-14 bg-[#2d5f4f]/10 rounded-full flex items-center justify-center border border-[#2d5f4f]/20 shadow-sm relative">
              <CheckCircle2 className="w-7 h-7 text-[#2d5f4f]" />
              <span className="absolute inset-0 bg-[#2d5f4f]/5 rounded-full animate-ping scale-105" />
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
              Application Submitted!
            </h1>
            <p className="text-xs text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
              Thank you for partnering with OyaEat. Your operational documents have been compiled and sent up for legal review.
            </p>
          </div>

          {/* Reference Document Box */}
          <div className="bg-amber-50/60 border border-dashed border-amber-200 rounded-xl p-2.5 max-w-sm mx-auto text-center space-y-0.5 flex-shrink-0 w-full">
            <p className="text-[9px] font-bold text-amber-800 uppercase tracking-widest">Application Tracking ID</p>
            <p className="text-base font-black text-gray-900 tracking-wider font-mono">{trackingId}</p>
          </div>

          {/* What Happens Next Action Container */}
          <div className="bg-gray-50 rounded-xl p-4 text-left max-w-md mx-auto border border-gray-100 shadow-sm flex-shrink-0 w-full">
            <h2 className="text-xs font-black text-gray-900 tracking-tight mb-3 flex items-center gap-1.5 uppercase">
              What happens next?
            </h2>
            <ul className="space-y-3">
              <li className="flex gap-3 items-start">
                <span className="w-5 h-5 bg-[#2d5f4f] text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-bold text-gray-900 text-xs">Compliance Check</p>
                  <p className="text-[11px] text-gray-500 font-medium leading-normal">
                    Our verification unit will validate your uploaded CAC details and identity mapping within 2 business days.
                  </p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="w-5 h-5 bg-[#2d5f4f] text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-bold text-gray-900 text-xs">Dashboard Activation Link</p>
                  <p className="text-[11px] text-gray-500 font-medium leading-normal">
                    Once approved, an email link will activate access to your desktop OyaEat Merchant Portal.
                  </p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="w-5 h-5 bg-[#2d5f4f] text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-bold text-gray-900 text-xs">Storefront Setup & Launch</p>
                  <p className="text-[11px] text-gray-500 font-medium leading-normal">
                    Log in to add menu items, prices, and food portrait pictures to start taking orders sharp sharp!
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Action Pathways Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-1 max-w-md mx-auto flex-shrink-0 w-full">
            <button
              onClick={() => router.push("/partner-signup")}
              className="w-full sm:flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:border-[#2d5f4f] hover:text-[#2d5f4f] transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Signup
            </button>
            <button
              onClick={() => router.push("/restaurant/login")}
              className="w-full sm:flex-[1.3] px-4 py-3 bg-[#2d5f4f] text-white font-black text-xs rounded-xl hover:bg-[#234a3d] transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Monitor Dashboard Status</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
