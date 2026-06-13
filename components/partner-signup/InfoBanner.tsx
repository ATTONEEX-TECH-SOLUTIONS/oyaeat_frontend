"use client";

export default function InfoBanner() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex gap-3">
      <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <h4 className="font-semibold text-blue-900 mb-1">Important Information</h4>
        <p className="text-sm text-blue-800">
          All documents will be reviewed within 2-3 business days. Make sure all documents are clear, valid, and up to date. Accepted formats: PDF, JPG, PNG (Max size: 5MB per file).
        </p>
      </div>
    </div>
  );
}
