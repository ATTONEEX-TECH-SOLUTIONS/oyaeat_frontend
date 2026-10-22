"use client";

import { useRef, useState } from "react";
import { AlertCircle, CheckCircle2, FileText, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentUpload {
  id: string;
  name: string;
  apiKey: string;
  description: string;
  file: File | null;
  uploaded: boolean;
  isFromDatabase?: boolean;
}

const OK = ["application/pdf", "image/jpeg", "image/png"];
const MAX = 5 * 1024 * 1024;

export default function DocumentCard({ doc, isSubmitting, onFileChange }: { doc: DocumentUpload; isSubmitting: boolean; onFileChange: (id: string, file: File | null) => void }) {
  const [localError, setLocalError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const pick = (file: File | null) => {
    setLocalError("");
    if (file) {
      if (file.type && !OK.includes(file.type)) return setLocalError("Use a PDF, JPG or PNG file.");
      if (file.size > MAX) return setLocalError("This file is over the 5MB limit.");
    }
    onFileChange(doc.id, file);
  };

  const size = doc.file ? (doc.file.size / 1024 / 1024).toFixed(1) : "";

  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-2.5 rounded-2xl border p-3.5 transition", doc.uploaded ? "border-primary/30 bg-violet-50" : localError ? "border-destructive/40 bg-destructive/5" : "border-border bg-card")}>
      <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", doc.uploaded ? "bg-primary text-primary-foreground" : "bg-violet-100 text-violet-600")}>
        {doc.uploaded ? <CheckCircle2 className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
      </span>
      <div className="min-w-0 flex-1 basis-40">
        <p className="truncate text-sm font-bold">{doc.name}</p>
        {localError ? (
          <p role="alert" className="flex items-center gap-1 text-xs font-semibold text-destructive"><AlertCircle className="h-3.5 w-3.5 shrink-0" /> {localError}</p>
        ) : doc.file ? (
          <p className="truncate text-xs text-muted-foreground">{doc.file.name}{doc.isFromDatabase ? " · already uploaded" : ` · ${size}MB`}</p>
        ) : (
          <p className="truncate text-xs text-muted-foreground">{doc.description}</p>
        )}
      </div>
      <input ref={input} type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" tabIndex={-1} disabled={isSubmitting} onChange={(e) => { pick(e.target.files?.[0] || null); e.target.value = ""; }} />
      <div className="ml-auto flex items-center gap-1.5">
      {doc.uploaded && (
        <button type="button" disabled={isSubmitting} onClick={() => pick(null)} aria-label={`Remove ${doc.name}`} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-40">
          <X className="h-4 w-4" />
        </button>
      )}
      <button type="button" disabled={isSubmitting} onClick={() => input.current?.click()} className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-bold text-primary-foreground transition hover:bg-violet-800 disabled:opacity-50">
        <Upload className="h-3.5 w-3.5" /> {doc.uploaded ? "Replace" : "Upload"}
      </button>
      </div>
    </div>
  );
}
