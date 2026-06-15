import { Suspense } from "react";
import SuccessContent from "@/components/partner-signup/success/SuccessContent";

export default function SuccessPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen w-full bg-white flex flex-col justify-center items-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">
            Loading confirmation...
          </p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
