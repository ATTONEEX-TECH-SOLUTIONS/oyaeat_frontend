"use client";

import { DollarSign, Clock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BalanceCardProps {
  type: "available" | "pending";
  amount: number;
  hasBankDetails?: boolean;
  withdrawing?: boolean;
  onWithdraw?: () => void;
  onLinkBank?: () => void;
}

export default function BalanceCard({
  type,
  amount,
  hasBankDetails,
  withdrawing,
  onWithdraw,
  onLinkBank,
}: BalanceCardProps) {
  if (type === "available") {
    return (
      <div className="flex flex-col justify-between rounded-2xl border p-6 shadow-sm relative overflow-hidden bg-[#3b0f7a] border-[#3b0f7a]">
        <div className="absolute right-0 top-0 opacity-10">
          <DollarSign className="h-48 w-48 -mr-10 -mt-10 text-white" />
        </div>
        <div className="relative z-10 space-y-1">
          <p className="text-sm font-bold uppercase tracking-widest text-[#c4b5fd]">
            Available Balance
          </p>
          <p className="text-4xl font-black text-white">
            ₦{Math.round(amount).toLocaleString("en-NG")}
          </p>
        </div>
        <div className="relative z-10 mt-8 flex flex-col sm:flex-row gap-2">
          {hasBankDetails ? (
            <Button
              onClick={onWithdraw}
              disabled={amount <= 0 || withdrawing}
              className="w-full sm:w-auto font-bold bg-white text-[#3b0f7a]"
            >
              {withdrawing ? "Processing..." : "Request Payout"}
            </Button>
          ) : (
            <Button
              onClick={onLinkBank}
              className="w-full sm:w-auto font-bold flex items-center gap-1.5 bg-[#E6F4EA] text-[#137333]"
            >
              <ShieldAlert className="h-4 w-4" /> Link Bank Account To Cashout
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between rounded-2xl border p-6 shadow-sm bg-white border-[#ddd6fe]">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-mango-500" />
          <p className="text-sm font-bold uppercase tracking-widest text-[#6b6480]">
            Pending Payouts
          </p>
        </div>
        <p className="text-3xl font-black text-gray-900">
          ₦{Math.round(amount).toLocaleString("en-NG")}
        </p>
      </div>
      <div className="mt-4">
        <p className="text-xs text-[#6b6480]">
          These funds are currently being processed by the system.
        </p>
      </div>
    </div>
  );
}
