"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SignupHeader from "./SignupHeader";
import StepIndicator from "./StepIndicator";
import UploadProgressBar from "./UploadProgressBar";
import DocumentCard from "./DocumentCard";

interface DocumentUpload {
  id: string;
  name: string;
  apiKey: string;
  description: string;
  file: File | null;
  uploaded: boolean;
  isFromDatabase?: boolean; //  Tracking flag for DB records
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
    { 
      id: "cac-certificate", 
      name: "CAC Certificate", 
      apiKey: "business_license", 
      description: "Corporate Affairs Commission registry scan", 
      file: null, 
      uploaded: false 
    },
    { 
      id: "firs-tin", 
      name: "FIRS Tax ID (TIN)", 
      apiKey: "tax_id", 
      description: "Federal Joint Tax Board verification", 
      file: null, 
      uploaded: false 
    },
    { 
      id: "lga-food-permit", 
      name: "LGA Food Permit", 
      apiKey: "food_certificate", 
      description: "Local Government Area sanitary permit", 
      file: null, 
      uploaded: false 
    },
    { 
      id: "owner-nin-id", 
      name: "Owner NIN Card", 
      apiKey: "owner_id", 
      description: "National Identification Number slip", 
      file: null, 
      uploaded: false 
    },
    { 
      id: "corporate-bank-proof", 
      name: "Corporate Bank Proof", 
      apiKey: "bank_document", 
      description: "Statement header matching CAC name", 
      file: null, 
      uploaded: false 
    },
  ]);

   useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchExistingDocuments = async (bId: string) => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/vendor/business/${bId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = await res.json().catch(() => ({}));
        
        // 🌟 FIXED STRATEGY: Enforce explicit state matching for clean registrations
        if (res.ok && data?.business?.documents && data.business.documents.length > 0) {
          const dbDocs = data.business.documents;

          setDocuments((prevDocs) =>
            prevDocs.map((localDoc) => {
              const matchingDbDoc = dbDocs.find((d: any) => d.type === localDoc.apiKey);
              
              if (matchingDbDoc) {
                return {
                  ...localDoc,
                  uploaded: true,
                  isFromDatabase: true, 
                  file: {
                    name: matchingDbDoc.fileName || "Uploaded_Document.png",
                    size: 1024, 
                  } as unknown as File
                };
              }
              return { ...localDoc, uploaded: false, isFromDatabase: false, file: null };
            })
          );
        } else {
          // 🧼 RECOVERY STRATEGY: Clear out fake persistent flags if backend yields empty metrics
          setDocuments((prevDocs) =>
            prevDocs.map((localDoc) => ({
              ...localDoc,
              uploaded: false,
              isFromDatabase: false,
              file: null
            }))
          );
        }
      } catch (err) {
        console.error("Failed to merge pre-existing compliance metadata arrays:", err);
      }
    };

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.replace("/restaurant/login");
        return;
      }

      const queryBusinessId = searchParams.get("businessId");
      const queryBusinessName = searchParams.get("businessName");

      let storedBusinessId = "";
      let storedBusinessName = "";

      const sessionData = sessionStorage.getItem("businessData");
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        storedBusinessId = parsed?.businessId ? String(parsed.businessId) : "";
        storedBusinessName = parsed?.businessName || "";
      }

      const finalBusinessId = queryBusinessId || storedBusinessId;
      const finalBusinessName = queryBusinessName || storedBusinessName || "your business";

      if (!finalBusinessId) {
        setError("Missing business identity tracking keys.");
        router.replace("/partner-signup/add-business");
        return;
      }

      setBusinessId(finalBusinessId);
      setBusinessName(finalBusinessName);

      fetchExistingDocuments(finalBusinessId);
    } catch (err) {
      setError("Unable to initialize document resolution matrix.");
    } finally {
      setPageLoading(false);
    }
  }, [router, searchParams]);

  const handleFileChange = (id: string, file: File | null) => {
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.id === id 
          ? { ...doc, file, uploaded: !!file, isFromDatabase: false } // Reset DB flag if replaced
          : doc
      )
    );
    if (error) setError("");
  };

const handleSubmit = async () => {
  const allValid = documents.every((doc) => doc.uploaded);
  if (!allValid) {
    setError("Please ensure all compliance document items are completed before submitting.");
    return;
  }

  setIsSubmitting(true);
  setError("");

  try {
    const formData = new FormData();
    let nativeFilesCount = 0;

    documents.forEach((doc) => {
      const isFreshFile = doc.file && doc.file instanceof File && (!doc.isFromDatabase || doc.file.size > 1024);
      
      if (isFreshFile) {
        // The '!' character bypasses the signature mismatch overload validation error safely
        formData.append(doc.apiKey, doc.file!);
        nativeFilesCount++;
      }
    });

    const clearCacheAndRedirect = () => {
      if (typeof window !== "undefined") {
        try {
          sessionStorage.removeItem("businessData");
          localStorage.removeItem("businessData");
          localStorage.removeItem("vendor_dashboard");
          localStorage.removeItem("dashboard"); 
        } catch (cacheErr) {
          console.error("Cache purge failed:", cacheErr);
        }
      }
       window.location.href = "/partner-signup/success";
    };

    if (nativeFilesCount === 0) {
      clearCacheAndRedirect();
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Your session has expired. Please log in again.");
      router.push("/restaurant/login");
      return;
    }

    console.log(`Sending ${nativeFilesCount} fresh documents to backend database server...`);

    const response = await fetch(`${API_BASE_URL}/vendor/${businessId}/upload-documents`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });

    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      throw new Error(data?.message || "Failed to finalize document changes.");
    }

    clearCacheAndRedirect();
  } catch (err: any) {
    setError(err?.message || "Failed to sync corrections with the database. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};


  const uploadedCount = documents.filter((doc) => doc.uploaded).length;

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 font-medium animate-pulse">Loading details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-[#f7f8f5] flex flex-col pb-12">
      <SignupHeader />
      <div className="max-w-4xl w-full mx-auto px-4 mt-8 flex-1">
        <StepIndicator currentStep={2} totalSteps={2} />
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Step 2 of 2 - KYB Compliance
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Verify your business</h1>
          <p className="text-gray-500 text-sm mt-1">
            Upload compliance credentials for <span className="font-semibold text-gray-700">{businessName}</span>.
          </p>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600 font-medium">
               {error}
            </div>
          )}

         {/*  FIXED: Passing correct prop names matching UploadProgressBarProps interface */}
<UploadProgressBar completedCount={uploadedCount} totalCount={documents.length} />

<div className="space-y-4 mt-6">
  {documents.map((item) => (
    /*  FIXED: Passing 'doc' and 'isSubmitting' to match DocumentCardProps interface */
    <DocumentCard
      key={item.id}
      doc={item}
      isSubmitting={isSubmitting}
      onFileChange={(id: string, file: File | null) => handleFileChange(id, file)}
    />
  ))}
</div>


          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-emerald-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Submitting Verification..." : "Submit Verification"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
