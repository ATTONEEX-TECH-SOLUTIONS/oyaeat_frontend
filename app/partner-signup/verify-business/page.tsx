"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface DocumentUpload {
  id: string;
  name: string;
  apiKey: string;
  description: string;
  file: File | null;
  uploaded: boolean;
}

const VerifyBusinessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [businessName, setBusinessName] = useState("your business");
  const [businessId, setBusinessId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const [documents, setDocuments] = useState<DocumentUpload[]>([
    {
      id: "business-license",
      name: "Business License",
      apiKey: "business_license",
      description: "Upload your valid business license or registration certificate",
      file: null,
      uploaded: false,
    },
    {
      id: "tax-id",
      name: "Tax ID / TIN",
      apiKey: "tax_id",
      description: "Upload your tax identification number certificate",
      file: null,
      uploaded: false,
    },
    {
      id: "food-certificate",
      name: "Food Safety Certificate",
      apiKey: "food_certificate",
      description: "Upload your food handler's permit or health inspection certificate",
      file: null,
      uploaded: false,
    },
    {
      id: "owner-id",
      name: "Owner ID",
      apiKey: "owner_id",
      description: "Upload a valid government-issued ID of the business owner",
      file: null,
      uploaded: false,
    },
    {
      id: "bank-document",
      name: "Bank Account Details",
      apiKey: "bank_document",
      description: "Upload a void check or bank statement for payment verification",
      file: null,
      uploaded: false,
    },
  ]);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
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
      const finalBusinessName =
        queryBusinessName || storedBusinessName || "your business";

      if (!finalBusinessId) {
        setError("Missing business information. Please add your business again.");
        router.replace("/partner-signup/add-business");
        return;
      }

      setBusinessId(finalBusinessId);
      setBusinessName(finalBusinessName);

      // refresh storage so both are available
      const payload = {
        businessId: finalBusinessId,
        businessName: finalBusinessName,
      };

      sessionStorage.setItem("businessData", JSON.stringify(payload));
      localStorage.setItem("businessData", JSON.stringify(payload));
    } catch {
      setError("Unable to load business information. Please try again.");
      router.replace("/partner-signup/add-business");
      return;
    } finally {
      setPageLoading(false);
    }
  }, [router, searchParams]);

  const handleFileChange = (id: string, file: File | null) => {
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.id === id ? { ...doc, file, uploaded: !!file } : doc
      )
    );

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
        if (doc.file) {
          formData.append(doc.apiKey, doc.file);
        }
      });

      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You are not logged in. Please login again.");
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
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Failed to upload documents");
      }

      router.push("/partner-signup/success");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload documents. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const allDocumentsUploaded = documents.every((doc) => doc.uploaded);
  const uploadedCount = documents.filter((doc) => doc.uploaded).length;

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-card flex items-center justify-center">
        <p className="text-gray-600">Loading business details...</p>
      </div>
    );
  }

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
        <div className="w-full max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#2d5f4f] text-white rounded-full flex items-center justify-center font-semibold">
                  ✓
                </div>
                <span className="text-gray-600 font-medium">Add Business</span>
              </div>
              <div className="flex-1 h-0.5 bg-[#2d5f4f]"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#2d5f4f] text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <span className="text-[#2d5f4f] font-semibold">
                  Verify Business
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verify your business
          </h1>
          <p className="text-gray-600 mb-8">
            Please upload the following documents to verify {businessName}. All
            documents are required for approval.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Upload Progress
              </span>
              <span className="text-sm font-semibold text-[#2d5f4f]">
                {uploadedCount} of {documents.length} completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#2d5f4f] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(uploadedCount / documents.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-6 mb-8">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`border-2 rounded-lg p-6 transition-all duration-300 ${
                  doc.uploaded
                    ? "border-[#2d5f4f] bg-green-50"
                    : "border-gray-300 hover:border-[#2d5f4f]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {doc.name}
                      </h3>
                      {doc.uploaded && (
                        <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          ✓ Uploaded
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      {doc.description}
                    </p>

                    {doc.file && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 bg-card rounded px-3 py-2 border border-gray-200">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="truncate">{doc.file.name}</span>
                        <span className="text-gray-500 text-xs">
                          ({(doc.file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          if (file && file.size > 5 * 1024 * 1024) {
                            alert("File size must be less than 5MB");
                            return;
                          }
                          handleFileChange(doc.id, file);
                        }}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                      <div
                        className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                          isSubmitting
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : doc.uploaded
                            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            : "bg-[#2d5f4f] text-white hover:bg-[#234a3d]"
                        }`}
                      >
                        {doc.uploaded ? "Replace" : "Upload"}
                      </div>
                    </label>

                    {doc.uploaded && (
                      <button
                        onClick={() => handleFileChange(doc.id, null)}
                        disabled={isSubmitting}
                        className="px-6 py-2 border-2 border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex gap-3">
              <svg
                className="w-6 h-6 text-blue-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  Important Information
                </h4>
                <p className="text-sm text-blue-800">
                  All documents will be reviewed within 2-3 business days. Make
                  sure all documents are clear, valid, and up to date. Accepted
                  formats: PDF, JPG, PNG (Max size: 5MB per file).
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            <button
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
};

export default VerifyBusinessPage;