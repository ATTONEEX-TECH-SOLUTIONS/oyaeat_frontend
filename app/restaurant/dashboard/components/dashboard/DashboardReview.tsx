"use client";

import { useMemo } from 'react';
import { Clock, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

interface DashboardReviewProps {
  business: {
    id: number;
    status: string;
    documents?: any[];
    bankDetail?: any;
    hasDocuments?: boolean;   // Added from backend payload
    hasBankDetails?: boolean; // Added from backend payload
    rejectionReason?: string | null;
  } | null;
  localSubmissionSync: boolean;
}

export default function DashboardReview({ business, localSubmissionSync }: DashboardReviewProps) {
  
  // Checks explicit backend flag or array lengths safely
  const isDocumentsUploaded = useMemo(() => {
    if (!business) return false;
    if (localSubmissionSync || business.hasDocuments === true) return true;
    if (Array.isArray(business.documents) && business.documents.length > 0) return true;
    return false;
  }, [business, localSubmissionSync]);

  // Checks explicit backend flag or structural properties
  const isBankDetailsCompleted = useMemo(() => {
    if (!business) return false;
    if (business.hasBankDetails === true) return true;
    return business.bankDetail !== null && business.bankDetail !== undefined;
  }, [business]);

  return (
    <div style={{ background: '#fff', border: '1px solid #c8e6c9', borderRadius: 16, padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ background: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={14} /> Under Review
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af' }}>ID: OYA-V-{business?.id || '000'}</span>
      </div>

      <h2 style={{ color: '#1a5c2a', fontWeight: 700, fontSize: 22, margin: '0 0 8px' }}>Business review pending</h2>
      <p style={{ color: '#4a7c59', marginBottom: 24, fontSize: 14 }}>
        Your credentials and legal certificates have been successfully received and are currently undergoing admin check verification.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Compliance Documents Card */}
        <div style={{ background: isDocumentsUploaded ? '#f4fbf7' : '#fefaf4', border: isDocumentsUploaded ? '1px solid #c8e6c9' : '1px solid #fde8c9', borderRadius: 12, padding: 16 }}>
          <p style={{ color: '#88a48e', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>Compliance Documents</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isDocumentsUploaded ? (
              <>
                <CheckCircle2 size={18} className="text-green-600" />
                <span style={{ color: '#1a5c2a', fontWeight: 700, fontSize: 16 }}>✓ Submitted</span>
              </>
            ) : (
              <>
                <AlertTriangle size={18} className="text-amber-600" />
                <span style={{ color: '#b45309', fontWeight: 700, fontSize: 16 }}>✗ Missing</span>
              </>
            )}
          </div>
        </div>

        {/* Bank Account Details Card */}
        <div style={{ background: isBankDetailsCompleted ? '#f4fbf7' : '#fefaf4', border: isBankDetailsCompleted ? '1px solid #c8e6c9' : '1px solid #fde8c9', borderRadius: 12, padding: 16 }}>
          <p style={{ color: '#88a48e', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>Settlement Bank Details</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isBankDetailsCompleted ? (
              <>
                <CheckCircle2 size={18} className="text-green-600" />
                <span style={{ color: '#1a5c2a', fontWeight: 700, fontSize: 16 }}>✓ Completed</span>
              </>
            ) : (
              <>
                <HelpCircle size={18} className="text-amber-600" />
                <span style={{ color: '#b45309', fontWeight: 700, fontSize: 16 }}>✗ Incomplete</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 12, fontSize: 12, fontWeight: 600, color: '#6b7280', lineHeight: '1.5' }}>
        💡 <strong>Note:</strong> Verification usually takes between 24 to 48 hours. You will receive an automated email activation link to start configuring your menus immediately once approved.
      </div>
    </div>
  );
}
