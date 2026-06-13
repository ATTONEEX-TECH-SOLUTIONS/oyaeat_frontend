"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/partner-signup/ProgressBar";
import BusinessForm from "@/components/partner-signup/BusinessForm";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function AddBusinessPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [markerPos, setMarkerPos] = useState({ lat: 6.5244, lng: 3.3792 }); // Lagos Fallback

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
    if (!e.detail.latLng) return;
    setMarkerPos({
      lat: e.detail.latLng.lat,
      lng: e.detail.latLng.lng,
    });
  };

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Your signup session has expired. Please restart the registration process.");
        router.push("/partner-signup");
        return;
      }

      if (!userId) {
        setError("Missing registration session ID. Please restart signup.");
        router.push("/partner-signup");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/vendor/${userId}/business-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({
          businessName: formData.businessName,
          businessType: formData.businessType,
          streetAddress: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          businessPhone: formData.businessPhone,
          businessEmail: formData.businessEmail,
          websiteUrl: formData.website || null,
          description: formData.description,
          latitude: markerPos.lat,
          longitude: markerPos.lng,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || `Failed to save business details (${res.status})`);
      }

      const businessId = data?.businessId || data?.id || data?.business?.id || data?.data?.businessId;

      if (!businessId) {
        throw new Error("Business created but businessId was not returned.");
      }

      const payload = { businessName: formData.businessName, businessId };
      sessionStorage.setItem("businessData", JSON.stringify(payload));
      localStorage.setItem("businessData", JSON.stringify(payload));

      router.push(`/partner-signup/verify-business?businessId=${businessId}&businessName=${encodeURIComponent(formData.businessName)}`);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="py-6 px-8 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">
            <span className="text-[#2d5f4f]">Oya</span>
            <span className="text-gray-900">Eat</span>
          </span>
        </Link>
      </header>

      <div className="flex-1 px-6 py-8">
        <div className="w-full max-w-3xl mx-auto">
          <ProgressBar currentStep={1} />

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add your business</h1>
          <p className="text-gray-600 mb-8">Please provide accurate information about your business.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <BusinessForm
            formData={formData}
            markerPos={markerPos}
            isLoading={isLoading}
            handleChange={handleChange}
            handleMapClick={handleMapClick}
            handleSubmit={handleSubmit}
            onBack={() => router.back()}
          />
        </div>
      </div>
    </div>
  );
}
