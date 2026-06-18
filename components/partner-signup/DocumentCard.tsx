// DocumentCard.tsx
"use client";

import { useState } from "react";
import { FileText, CheckCircle2, AlertCircle, Upload, X } from "lucide-react";

interface DocumentUpload {
  id: string;
  name: string;
  apiKey: string;
  description: string;
  file: File | null;
  uploaded: boolean;
  isFromDatabase?: boolean;
}

interface DocumentCardProps {
  doc: DocumentUpload;
  isSubmitting: boolean;
  onFileChange: (id: string, file: File | null) => void;
}

export default function DocumentCard({ doc, isSubmitting, onFileChange }: DocumentCardProps) {
  const [localError, setLocalError] = useState("");

  const handleValidation = (file: File | null) => {
    setLocalError("");

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setLocalError("File size exceeds 5MB limit.");
        return;
      }
    }

    onFileChange(doc.id, file);
  };

  return (
    <div
      className={`rounded-md border transition-colors duration-200 px-2.5 py-2 h-full flex flex-col justify-between ${
        doc.uploaded
          ? "border-[#2d5f4f]/30 bg-[#2d5f4f]/[0.04]"
          : localError
          ? "border-red-200 bg-red-50/40"
          : "border-gray-200 bg-white hover:border-[#2d5f4f]/30"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center ${
            doc.uploaded ? "bg-[#2d5f4f] text-white" : "bg-gray-100 text-gray-400"
          }`}
        >
          {doc.uploaded ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <FileText className="w-3.5 h-3.5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-gray-900 truncate leading-tight">{doc.name}</p>

          {localError ? (
            <p className="text-[11px] text-red-600 font-semibold truncate leading-tight flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              {localError}
            </p>
          ) : doc.file ? (
            <p className="text-[11px] text-gray-500 truncate leading-tight">
              {doc.file.name} · {(doc.file.size / 1024 / 1024).toFixed(1)}MB
            </p>
          ) : (
            <p className="text-[11px] text-gray-400 truncate leading-tight">{doc.description}</p>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {doc.uploaded && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleValidation(null)}
              aria-label={`Remove ${doc.name}`}
              className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          <label className="cursor-pointer block">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              disabled={isSubmitting}
              onChange={(e) => handleValidation(e.target.files?.[0] || null)}
            />
            <div
              className={`px-2.5 py-1 rounded-md font-bold text-center text-[11px] transition-colors duration-150 select-none flex items-center gap-1 whitespace-nowrap ${
                isSubmitting
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : doc.uploaded
                  ? "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  : "bg-[#2d5f4f] text-white hover:bg-[#234a3d]"
              }`}
            >
              {!doc.uploaded && <Upload className="w-2.5 h-2.5" />}
              {doc.uploaded ? "Replace" : "Upload"}
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}