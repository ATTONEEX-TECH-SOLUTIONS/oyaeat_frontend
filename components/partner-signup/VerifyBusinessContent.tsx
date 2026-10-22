// VerifyBusinessContent.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FlowShell from "./FlowShell";
import { FormError, PrimaryButton } from "./ui";
import { Loader2 } from "lucide-react";
import DocumentCard from "./DocumentCard";

interface DocumentUpload {
  id: string;
  name: string;
  apiKey: string;
  description: string;
  file: File | null;
  uploaded: boolean;
  isFromDatabase?: boolean;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

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
      uploaded: false,
    },
    {
      id: "firs-tin",
      name: "FIRS Tax ID (TIN)",
      apiKey: "tax_id",
      description: "Federal Joint Tax Board verification",
      file: null,
      uploaded: false,
    },
    {
      id: "lga-food-permit",
      name: "LGA Food Permit",
      apiKey: "food_certificate",
      description: "Local Government Area sanitary permit",
      file: null,
      uploaded: false,
    },
    {
      id: "owner-nin-id",
      name: "Owner NIN Card",
      apiKey: "owner_id",
      description: "National Identification Number slip",
      file: null,
      uploaded: false,
    },
    {
      id: "corporate-bank-proof",
      name: "Corporate Bank Proof",
      apiKey: "bank_document",
      description: "Statement header matching CAC name",
      file: null,
      uploaded: false,
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
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json().catch(() => ({}));

        if (
          res.ok &&
          data?.business?.documents &&
          data.business.documents.length > 0
        ) {
          const dbDocs = data.business.documents;

          setDocuments((prevDocs) =>
            prevDocs.map((localDoc) => {
              const matchingDbDoc = dbDocs.find(
                (d: any) => d.type === localDoc.apiKey,
              );

              if (matchingDbDoc) {
                return {
                  ...localDoc,
                  uploaded: true,
                  isFromDatabase: true,
                  file: {
                    name: matchingDbDoc.fileName || "Uploaded_Document.png",
                    size: 1024,
                  } as unknown as File,
                };
              }
              return {
                ...localDoc,
                uploaded: false,
                isFromDatabase: false,
                file: null,
              };
            }),
          );
        } else {
          setDocuments((prevDocs) =>
            prevDocs.map((localDoc) => ({
              ...localDoc,
              uploaded: false,
              isFromDatabase: false,
              file: null,
            })),
          );
        }
      } catch (err) {
        console.error(
          "Failed to merge pre-existing compliance metadata arrays:",
          err,
        );
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
      const finalBusinessName =
        queryBusinessName || storedBusinessName || "your business";

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
          ? { ...doc, file, uploaded: !!file, isFromDatabase: false }
          : doc,
      ),
    );
    if (error) setError("");
  };

  const handleSubmit = async () => {
    const allValid = documents.every((doc) => doc.uploaded);
    if (!allValid) {
      setError(
        "Please ensure all compliance document items are completed before submitting.",
      );
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      let nativeFilesCount = 0;

      documents.forEach((doc) => {
        const isFreshFile =
          doc.file &&
          doc.file instanceof File &&
          (!doc.isFromDatabase || doc.file.size > 1024);

        if (isFreshFile) {
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
        window.location.href = `/partner-signup/success?businessName=${encodeURIComponent(businessName)}`;
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

      const response = await fetch(
        `${API_BASE_URL}/vendor/${businessId}/upload-documents`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to finalize document changes.",
        );
      }

      clearCacheAndRedirect();
    } catch (err: any) {
      setError(
        err?.message ||
          "Failed to sync corrections with the database. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadedCount = documents.filter((doc) => doc.uploaded).length;
  const pct = Math.round((uploadedCount / documents.length) * 100);

  if (pageLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-sm font-semibold text-muted-foreground" aria-busy="true">
        Loading your details…
      </div>
    );
  }

  return (
    <FlowShell
      step={4}
      wide
      eyebrow="Step 4 of 4"
      title="Verify your business"
      subtitle={`Upload the documents for ${businessName}. PDF, JPG or PNG, up to 5MB each.`}
    >
      <div className="space-y-5">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm font-bold">
            <span>{uploadedCount} of {documents.length} documents added</span>
            <span className="text-muted-foreground">{pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-violet-100" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <FormError>{error}</FormError>

        <div className="grid gap-3 sm:grid-cols-2">
          {documents.map((item) => (
            <DocumentCard key={item.id} doc={item} isSubmitting={isSubmitting} onFileChange={(id: string, file: File | null) => handleFileChange(id, file)} />
          ))}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">We review documents within 2 business days. You can come back to this page if you need to change a file.</p>
          <PrimaryButton onClick={handleSubmit} disabled={isSubmitting || uploadedCount < documents.length} className="w-full sm:w-auto">
            {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" /> Submitting…</> : "Submit for verification"}
          </PrimaryButton>
        </div>
      </div>
    </FlowShell>
  );
}
