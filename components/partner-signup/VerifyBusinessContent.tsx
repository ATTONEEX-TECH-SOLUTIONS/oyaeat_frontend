"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SignupHeader from "./SignupHeader";
import StepIndicator from "./StepIndicator";
import UploadProgressBar from "./UploadProgressBar";
import DocumentCard from "./DocumentCard";
import InfoBanner from "./InfoBanner";

interface DocumentUpload {
  id: string;
  name: string;
  apiKey: string;
  description: string;
  file: File | null;
  uploaded: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function VerifyBusinessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [businessName, setBusinessName] = useState("your business");
  const [businessId, setBusinessId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const [documents, setDocuments] = useState<DocumentUpload[]>([
    { id: "business-license", name: "Business License", apiKey: "business_license", description: "Upload your valid business license or registration certificate", file: null, uploaded: false },
    { id: "tax-id", name: "Tax ID / TIN", apiKey: "tax_id", description: "Upload your tax identification number certificate", file: null, uploaded: false },
    { id: "food-certificate", name: "Food Safety Certificate", apiKey: "food_certificate", description: "Upload your food handler's permit or health inspection certificate", file: null, uploaded: false },
    { id: "owner-id", name: "Owner ID", apiKey: "owner_id", description: "Upload a valid government-issued ID of the business owner", file: null, uploaded: false },
    { id: "bank-document", name: "Bank Account Details", apiKey: "bank_document", description: "Upload a void check or bank statement for payment verification", file: null, uploaded: false },
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.warn("Auth token not found during step 2 init loop. Enforcing redirect.");
        router.replace("/restaurant/login");
        return;
      }

      const queryBusinessId = searchParams.get("businessId");
      const queryBusinessName = searchParams.get("businessName");

      let storedBusinessId = "";
      let storedBusinessName = "";

      const sessionData = sessionStorage.getItem("businessData");
      const localData = localStorage.getItem("businessData");

      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        storedBusinessId = parsed?.businessId ? String(parsed.businessId) : "";
        storedBusinessName = parsed?.businessName || "";
      }

      if (!storedBusinessId && localData) {
        const parsed = JSON.parse(localData);
        storedBusinessId = parsed?.businessId ? String(parsed.businessId) : "";
        storedBusinessName = parsed?.businessName || "";
      }

      const finalBusinessId = queryBusinessId || storedBusinessId;
      const finalBusinessName = queryBusinessName || storedBusinessName || "your business";

      if (!finalBusinessId) {
        setError("Missing business information. Please add your business again.");
        router.replace("/partner-signup/add-business");
        return;
      }

      setBusinessId(finalBusinessId);
      setBusinessName(finalBusinessName);

      const payload = { businessId: finalBusinessId, businessName: finalBusinessName };
      sessionStorage.setItem("businessData", JSON.stringify(payload));
      localStorage.setItem("businessData", JSON.stringify(payload));
    } catch (err) {
      setError("Unable to load business information. Please try again.");
      router.replace("/partner-signup/add-business");
    } {
      setPageLoading(false);
    }
  }, [router, searchParams]);

  const handleFileChange = (id: string, file: File | null) => {
    setDocuments((docs) => docs.map((doc) => doc.id === id ? { ...doc, file, uploaded: !!file } : doc));
    if (error) setError("");
  };

  const handleSubmit = async () => {
    const allUploaded = documents.every((doc) => doc.uploaded);
    if (!allUploaded) {
      setError("Please upload all required documents before continuing.");
      return;
    }

    if (!businessId) {
      setError("Missing business ID. Please go back and add your business again.");
      router.push("/partner-signup/add-business");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      documents.forEach((doc) => {
        if (doc.file) formData.append(doc.apiKey, doc.file);
      });

      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You are not logged in. Please login again.");
        router.push("/restaurant/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/vendor/${businessId}/upload-documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.message || "Failed to upload documents");

      router.push(`/partner-signup/gallery?businessId=${businessId}`);
    } catch (err: any) {
      setError(err?.message || "Failed to upload documents. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const allDocumentsUploaded = documents.every((doc) => doc.uploaded);
  const uploadedCount = documents.filter((doc) => doc.uploaded).length;

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 font-medium">Loading business details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SignupHeader />

      <div className="flex-1 px-6 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <StepIndicator />

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify your business</h1>
          <p className="text-gray-600 mb-8">
            Please upload the following documents to verify {businessName}. All documents are required for approval.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <UploadProgressBar completedCount={uploadedCount} totalCount={documents.length} />

          <div className="space-y-6 mb-8">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                isSubmitting={isSubmitting}
                onFileChange={handleFileChange}
              />
            ))}
          </div>

          <InfoBanner />

          {/* Action Footer Navigation Grid */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!allDocumentsUploaded || isSubmitting}
              className="flex-1 bg-[#2d5f4f] hover:bg-[#234a3d] text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Uploading..." : "Submit for Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
