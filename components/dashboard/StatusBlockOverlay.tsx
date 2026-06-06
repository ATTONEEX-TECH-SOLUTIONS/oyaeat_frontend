'use client'

import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StatusBlockOverlay({ riderStatus }: { riderStatus: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-6 text-center bg-slate-50">
      <div className="p-4 bg-orange-100 rounded-full text-orange-600 mb-4 animate-pulse">
        <ShieldAlert className="w-12 h-12" />
      </div>
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">Account Restricted</h1>
      
      {riderStatus === "pending" && (
        <p className="text-sm text-slate-500 max-w-sm mt-2">
          Your application documentation is currently undergoing review. Our team will verify your vehicle registry details shortly.
        </p>
      )}
      {riderStatus === "verified" && (
        <p className="text-sm text-slate-500 max-w-sm mt-2">
          Your profile details have been verified, but your account permissions are currently awaiting activation.
        </p>
      )}
      {riderStatus === "inactive" && (
        <p className="text-sm text-slate-500 max-w-sm mt-2">
          Your account permissions have been deactivated by administration operations. Please reach out to customer support.
        </p>
      )}

      <Button 
        onClick={() => { localStorage.clear(); window.location.href = "/login"; }} 
        className="mt-6 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl"
      >
        Return to Sign In
      </Button>
    </div>
  );
}
