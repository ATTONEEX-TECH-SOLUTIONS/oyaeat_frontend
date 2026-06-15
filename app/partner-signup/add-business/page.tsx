// page.tsx - AddBusinessPage
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/partner-signup/ProgressBar";
import BusinessForm from "@/components/partner-signup/BusinessForm";
import { ArrowLeft, ArrowRight } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function AddBusinessPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [markerPos, setMarkerPos] = useState({ lat: 6.5244, lng: 3.3792 });
  const [subStep, setSubStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    businessPhone: "",
    businessEmail: "",
    website: "",
    description: "",
  });

 
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("partnerSignupData");
      if (raw) {
        const parsed = JSON.parse(raw);
        const id = Number(parsed?.userId);
        if (!Number.isNaN(id) && id > 0) setUserId(id);

        // Pre-populate input states matching your onboarding payload keys
        setFormData((prev) => ({
          ...prev,
          businessPhone: parsed?.phone || "",
          businessEmail: parsed?.email || "",
          businessType: parsed?.businessType || "",
        }));
      }
    } catch (err) {
      console.error("Failed to parse partner signup data:", err);
    }
  }, []);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleMapClick = (e: any) => {
    if (e?.detail?.latLng) {
      setMarkerPos({ lat: e.detail.latLng.lat, lng: e.detail.latLng.lng });
    }
  };

  const handleNextStageValidation = () => {
    if (!formData.businessName || !formData.businessType || !formData.businessPhone || !formData.businessEmail) {
      setError("Fill in your business name, type, phone, and email to continue.");
      return;
    }
    setError("");
    setSubStep(2);
  };

  const handleSubmit = async () => {
    if (!formData.streetAddress || !formData.city || !formData.state) {
      setError("Street address, city, and state are required.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Your session has expired. Please restart registration.");
        router.push("/partner-signup");
        return;
      }
      if (!userId) {
        setError("Missing session ID. Please restart signup.");
        router.push("/partner-signup");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/vendor/${userId}/business-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessName: formData.businessName,
          businessType: formData.businessType,
          streetAddress: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode || "100001",
          businessPhone: formData.businessPhone,
          businessEmail: formData.businessEmail,
          websiteUrl: formData.website || null,
          description: formData.description,
          latitude: markerPos.lat,
          longitude: markerPos.lng,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Failed to save details (${res.status})`);

      const businessId = data?.businessId || data?.id || data?.business?.id || data?.data?.businessId;
      if (!businessId) throw new Error("Business created but ID was not returned.");

      const payload = { businessName: formData.businessName, businessId };
      sessionStorage.setItem("businessData", JSON.stringify(payload));
      localStorage.setItem("businessData", JSON.stringify(payload));

      router.push(
        `/partner-signup/verify-business?businessId=${businessId}&businessName=${encodeURIComponent(formData.businessName)}`,
      );
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f7f8f5] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-[60px] bg-white border-b border-gray-100 px-6 md:px-10 flex items-center justify-between flex-shrink-0">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-[22px] font-black tracking-tight leading-none">
            <span className="text-[#2d5f4f]">Oya</span>
            <span className="text-gray-900">Eat</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className={subStep === 1 ? "text-[#2d5f4f]" : "text-gray-400"}>Business Info</span>
          <span className="text-gray-300">›</span>
          <span className={subStep === 2 ? "text-[#2d5f4f]" : "text-gray-400"}>Location</span>
          <span className="text-gray-300">›</span>
          <span className="text-gray-300">Verify</span>
        </div>
      </header>

      {/* Page body — no scroll, full height fill */}
      <div className="flex-1 flex flex-col px-6 md:px-10 py-8 max-w-2xl w-full mx-auto">

        {/* Progress */}
        <div className="mb-6 flex-shrink-0">
          <ProgressBar currentStep={1} />
        </div>

        {/* Step label + heading */}
        <div className="mb-6 flex-shrink-0">
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#2d5f4f] mb-1">
            Step 1 of 2 — {subStep === 1 ? "Business Info" : "Location & Address"}
          </p>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-snug">
            {subStep === 1 ? "Tell us about your business" : "Where are you located?"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {subStep === 1
              ? "Basic info customers will see on your profile."
              : "Customers use this to find and contact you."}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 flex-shrink-0 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold flex items-start gap-2">
            <span className="mt-0.5 shrink-0">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form — no scroll, expands naturally */}
        <div className="flex-1">
          <BusinessForm
            subStep={subStep}
            formData={formData}
            markerPos={markerPos}
            isLoading={isLoading}
            handleChange={handleChange}
            handleMapClick={handleMapClick}
          />
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-6 mt-2 border-t border-gray-200 flex-shrink-0">
          {subStep === 1 ? (
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSubStep(1)}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Business Info
            </button>
          )}

          {subStep === 1 ? (
            <button
              type="button"
              onClick={handleNextStageValidation}
              className="flex items-center gap-2 bg-[#2d5f4f] hover:bg-[#234a3d] active:scale-[0.98] text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 bg-[#2d5f4f] hover:bg-[#234a3d] active:scale-[0.98] disabled:opacity-40 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Saving…
                </>
              ) : (
                <>Save & Continue <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}