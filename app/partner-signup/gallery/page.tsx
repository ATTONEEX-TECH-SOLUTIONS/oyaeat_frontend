"use client";

import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import GalleryFormContent from "@/components/gallery/GalleryFormContent";

export default function PartnerSignupGalleryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#2d5f4f]" />
      </div>
    }>
      <GalleryFormContent />
    </Suspense>
  );
}
