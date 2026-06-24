'use client'



interface ShadowSuspensionBannerProps {
  rejectionReason?: string
}

export function ShadowSuspensionBanner({ rejectionReason }: ShadowSuspensionBannerProps) {
  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 px-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
      <div className="space-y-0.5">
        <h4 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-1.5">
          ⚠️ Store Storefront Hidden (Shadow Suspended)
        </h4>
        <p className="text-xs text-amber-50 leading-relaxed max-w-xl">
          Customers cannot locate your restaurant menu or place incoming platform orders right now. 
          <strong> Reason for Flagging:</strong> "{rejectionReason || 'Operational verification review.'}"
        </p>
      </div>
      <a
        href="https://google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition border border-white/20 shrink-0 text-center"
      >
        Contact Operations Support
      </a>
    </div>
  )
}
