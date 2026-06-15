"use client";

import { useState } from "react";
import { FileText, CheckCircle2, AlertCircle } from "lucide-react";

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
      className={`border-2 rounded-xl p-4 transition-all duration-300 w-full h-full flex flex-col justify-between min-h-[170px] ${
        doc.uploaded 
          ? "border-[#2d5f4f] bg-[#2d5f4f]/5" 
          : localError 
          ? "border-red-300 bg-red-50/30" 
          : "border-gray-200 bg-white hover:border-[#2d5f4f]/40 shadow-sm"
      }`}
    >
      {/* Top Body Content */}
      <div className="space-y-1.5 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-black text-gray-900 tracking-tight line-clamp-1">
            {doc.name}
          </h3>
          {doc.uploaded && (
            <span className="bg-[#2d5f4f] text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 flex-shrink-0">
              <CheckCircle2 className="w-3 h-3" /> Linked
            </span>
          )}
        </div>

        <p className="text-xs text-gray-400 font-medium leading-normal line-clamp-2">
          {doc.description}
        </p>

        {/* Local Error Warning */}
        {localError && (
          <div className="text-red-600 text-[11px] font-bold flex items-center gap-1 mt-auto">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> 
            <span>{localError}</span>
          </div>
        )}

        {/* Selected File Details Snippet */}
        {doc.file && !localError && (
          <div className="flex items-center gap-2 text-xs text-gray-700 bg-white shadow-sm border border-gray-100 rounded-lg px-2.5 py-1.5 mt-auto w-full overflow-hidden">
            <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="truncate font-bold text-gray-800 flex-1">{doc.file.name}</span>
            <span className="text-gray-400 font-semibold text-[10px] flex-shrink-0">
              ({(doc.file.size / 1024 / 1024).toFixed(1)}MB)
            </span>
          </div>
        )}
      </div>

      {/* Dynamic Actions Row Block Bottom Anchor */}
      <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-50 flex-shrink-0">
        {doc.uploaded && (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleValidation(null)}
            className="px-3 py-1.5 text-red-500 hover:text-red-700 text-xs font-bold transition-all disabled:opacity-30"
          >
            Remove
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
            className={`px-4 py-1.5 rounded-lg font-black text-center text-xs transition-all duration-200 select-none shadow-sm ${
              isSubmitting
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : doc.uploaded
                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                : "bg-[#2d5f4f] text-white hover:bg-[#234a3d]"
            }`}
          >
            {doc.uploaded ? "Replace" : "Upload"}
          </div>
        </label>
      </div>
    </div>
  );
}
