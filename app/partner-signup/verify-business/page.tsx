"use client";

import { Suspense } from "react";
import VerifyBusinessContent from "@/components/partner-signup/VerifyBusinessContent";

export default function VerifyBusinessPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-gray-500 font-medium animate-pulse">
            Loading secure connection...
          </p>
        </div>
      }
    >
      <VerifyBusinessContent />
    </Suspense>
  );
}
