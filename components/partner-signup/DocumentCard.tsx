"use client";

interface DocumentUpload {
  id: string;
  name: string;
  apiKey: string;
  description: string;
  file: File | null;
  uploaded: boolean;
}

interface DocumentCardProps {
  doc: DocumentUpload;
  isSubmitting: boolean;
  onFileChange: (id: string, file: File | null) => void;
}

export default function DocumentCard({ doc, isSubmitting, onFileChange }: DocumentCardProps) {
  return (
    <div
      className={`border-2 rounded-lg p-6 transition-all duration-300 ${
        doc.uploaded ? "border-[#2d5f4f] bg-green-50" : "border-gray-300 hover:border-[#2d5f4f]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{doc.name}</h3>
            {doc.uploaded && (
              <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                ✓ Uploaded
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-4">{doc.description}</p>

          {doc.file && (
            <div className="flex items-center gap-2 text-sm text-gray-700 bg-white rounded px-3 py-2 border border-gray-200 w-fit">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="truncate max-w-[200px] font-medium">{doc.file.name}</span>
              <span className="text-gray-400 text-xs">({(doc.file.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              disabled={isSubmitting}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                if (file && file.size > 5 * 1024 * 1024) {
                  alert("File size must be less than 5MB");
                  return;
                }
                onFileChange(doc.id, file);
              }}
            />
            <div
              className={`px-6 py-2 rounded-lg font-semibold text-center text-sm transition-all duration-300 ${
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
              type="button"
              disabled={isSubmitting}
              onClick={() => onFileChange(doc.id, null)}
              className="px-6 py-2 border-2 border-red-500 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-50 transition-all duration-300 disabled:opacity-50"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
