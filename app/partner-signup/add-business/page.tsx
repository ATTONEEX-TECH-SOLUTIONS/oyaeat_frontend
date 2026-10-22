// page.tsx - AddBusinessPage
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FlowShell from "@/components/partner-signup/FlowShell";
import { FormError, PrimaryButton, SecondaryButton } from "@/components/partner-signup/ui";
import BusinessForm from "@/components/partner-signup/BusinessForm";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function AddBusinessPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [markerPos, setMarkerPos] = useState({ lat: 6.5244, lng: 3.3792 });
  const [subStep, setSubStep] = useState<1 | 2>(1);
  const [pinMoved, setPinMoved] = useState(false);
  const [locating, setLocating] = useState(false);

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
        }));
      }
    } catch (err) {
      console.error("Failed to parse partner signup data:", err);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleMapClick = (e: any) => {
    if (e?.detail?.latLng) {
      setMarkerPos({ lat: e.detail.latLng.lat, lng: e.detail.latLng.lng });
      setPinMoved(true);
    }
  };

  const handleLocate = () => {
    if (!("geolocation" in navigator)) return setError("Your browser can't share your location. Tap the map to place the pin instead.");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setMarkerPos({ lat: coords.latitude, lng: coords.longitude });
        setPinMoved(true);
        setLocating(false);
      },
      () => {
        setLocating(false);
        setError("We couldn't get your location. Tap the map to place the pin instead.");
      },
      { timeout: 10000 },
    );
  };

  const handleNextStageValidation = () => {
    if (
      !formData.businessName ||
      !formData.businessType ||
      !formData.businessPhone ||
      !formData.businessEmail
    ) {
      setError(
        "Fill in your business name, type, phone, and email to continue.",
      );
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
    if (!pinMoved) {
      setError("Place the pin on your storefront. Tap the map or use your current location.");
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

      const res = await fetch(
        `${API_BASE_URL}/vendor/${userId}/business-details`,
        {
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
        },
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(
          data?.message || `Failed to save details (${res.status})`,
        );

      const businessId =
        data?.businessId ||
        data?.id ||
        data?.business?.id ||
        data?.data?.businessId;
      if (!businessId)
        throw new Error("Business created but ID was not returned.");

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
    <FlowShell
      step={3}
      eyebrow={`Step 3 of 4 · ${subStep === 1 ? "Business info" : "Location"}`}
      title={subStep === 1 ? "Tell us about your business" : "Where are you located?"}
      subtitle={subStep === 1 ? "This is what customers see on your profile." : "Customers and riders use this to find you."}
    >
      <div className="space-y-5">
        <FormError>{error}</FormError>

        <BusinessForm
          subStep={subStep}
          formData={formData}
          markerPos={markerPos}
          pinMoved={pinMoved}
          locating={locating}
          isLoading={isLoading}
          handleChange={handleChange}
          handleMapClick={handleMapClick}
          onLocate={handleLocate}
        />

        <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
          {subStep === 1 ? (
            <SecondaryButton type="button" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" /> Back
            </SecondaryButton>
          ) : (
            <SecondaryButton type="button" onClick={() => setSubStep(1)}>
              <ArrowLeft className="h-4 w-4" /> Back
            </SecondaryButton>
          )}
          {subStep === 1 ? (
            <PrimaryButton type="button" onClick={handleNextStageValidation}>
              Continue <ArrowRight className="h-5 w-5" />
            </PrimaryButton>
          ) : (
            <PrimaryButton type="button" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> Saving…</> : <>Save & continue <ArrowRight className="h-5 w-5" /></>}
            </PrimaryButton>
          )}
        </div>
      </div>
    </FlowShell>
  );
}
