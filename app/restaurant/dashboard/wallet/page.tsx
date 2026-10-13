"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Info, Wallet } from "lucide-react";
import { vendorApi } from "@/lib/api/vendor";
import BalanceCard from "../components/wallet/BalanceCard";
import TransactionList from "../components/wallet/TransactionList";
import { EmptyState, ErrorState, PageHeader } from "@/components/shared/states";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function WalletPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [hasBankDetails, setHasBankDetails] = useState(false);
  const [bankText, setBankText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [confirm, setConfirm] = useState<"payout" | "bank" | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await vendorApi.getWallet();
      setWallet(res.wallet || null);
      setHasBankDetails(!!res.hasBankDetails);
      setBankText(res.linkedBankAccount || "");
    } catch (e: any) {
      const m = String(e?.message || "").toLowerCase();
      if (m.includes("not found") || m.includes("404")) setWallet(null);
      else setError(e?.message || "We couldn't load your wallet.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const requestPayout = async () => {
    setConfirm(null);
    if (!wallet || wallet.balance <= 0) return;
    setWithdrawing(true);
    try {
      await vendorApi.requestWithdrawal(wallet.balance);
      toast.success("Payout requested. We'll notify you when it's sent.");
      await load();
    } catch (e: any) {
      toast.error(e?.message || "Couldn't submit the payout request");
    } finally {
      setWithdrawing(false);
    }
  };

  const naira = (n: number) => `₦${Math.round(n || 0).toLocaleString("en-NG")}`;

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader title="Wallet" subtitle="Your earnings and payouts." />

      {loading ? (
        <div className="space-y-4" aria-busy="true">
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-40 rounded-3xl bg-muted" />
            <Skeleton className="h-40 rounded-3xl bg-muted" />
          </div>
          <Skeleton className="h-64 rounded-3xl bg-muted" />
        </div>
      ) : error ? (
        <ErrorState title="We couldn't load your wallet" message={error} onRetry={load} />
      ) : !wallet ? (
        <EmptyState icon={Wallet} title="No earnings yet" body="Your wallet starts tracking once your first orders are delivered and paid." action={{ label: "Refresh", onClick: load }} />
      ) : (
        <>
          <div className={`flex items-start gap-3 rounded-2xl border p-4 ${hasBankDetails ? "border-border bg-card" : "border-mango-300 bg-mango-50"}`}>
            <Info className={`mt-0.5 h-5 w-5 shrink-0 ${hasBankDetails ? "text-primary" : "text-mango-700"}`} />
            <div>
              <p className="text-sm font-bold">Payout destination</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {hasBankDetails ? `Payouts are sent to ${bankText}.` : "No bank account is linked yet. Email your business bank details to support to enable payouts."}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <BalanceCard type="available" amount={wallet.balance} hasBankDetails={hasBankDetails} withdrawing={withdrawing} onWithdraw={() => setConfirm("payout")} onLinkBank={() => setConfirm("bank")} />
            <BalanceCard type="pending" amount={wallet.pendingPayouts} />
          </div>

          <TransactionList transactions={wallet.transactions} />
        </>
      )}

      <AlertDialog open={confirm !== null} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent className="rounded-3xl">
          {confirm === "payout" ? (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Request a payout of {naira(wallet?.balance)}?</AlertDialogTitle>
                <AlertDialogDescription>The full available balance will be sent to {bankText || "your linked bank account"}.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-full">Not now</AlertDialogCancel>
                <AlertDialogAction className="rounded-full bg-primary" onClick={requestPayout}>Request payout</AlertDialogAction>
              </AlertDialogFooter>
            </>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Link your bank account</AlertDialogTitle>
                <AlertDialogDescription>Email your business bank details from your registered email address to support. We&apos;ll link the account and enable payouts.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction className="rounded-full bg-primary">Got it</AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
