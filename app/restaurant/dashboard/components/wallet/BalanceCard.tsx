"use client";

import { Clock, Landmark, Loader2 } from "lucide-react";

interface BalanceCardProps {
  type: "available" | "pending";
  amount: number;
  hasBankDetails?: boolean;
  withdrawing?: boolean;
  onWithdraw?: () => void;
  onLinkBank?: () => void;
}

const naira = (n: number) => `₦${Math.round(n || 0).toLocaleString("en-NG")}`;

export default function BalanceCard({ type, amount, hasBankDetails, withdrawing, onWithdraw, onLinkBank }: BalanceCardProps) {
  if (type === "available") {
    return (
      <div className="lp-doodles relative flex flex-col justify-between overflow-hidden rounded-3xl p-5 text-white shadow-card sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-violet-200">Available balance</p>
          <p className="font-display mt-1 text-4xl font-extrabold tracking-tight">{naira(amount)}</p>
        </div>
        <div className="mt-6">
          {hasBankDetails ? (
            <button
              onClick={onWithdraw}
              disabled={amount <= 0 || withdrawing}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-cta px-6 text-base font-extrabold text-cta-foreground shadow-sm transition hover:bg-mango-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {withdrawing ? <Loader2 className="h-5 w-5 animate-spin" /> : "Request payout"}
            </button>
          ) : (
            <button
              onClick={onLinkBank}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-extrabold text-violet-900 transition hover:bg-violet-50 sm:w-auto"
            >
              <Landmark className="h-4 w-4" /> Link a bank account to cash out
            </button>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
      <div>
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <Clock className="h-4 w-4 text-mango-600" /> Pending payouts
        </p>
        <p className="font-display mt-1 text-3xl font-extrabold tracking-tight">{naira(amount)}</p>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">These funds are being processed and will reach your bank account shortly.</p>
    </div>
  );
}
