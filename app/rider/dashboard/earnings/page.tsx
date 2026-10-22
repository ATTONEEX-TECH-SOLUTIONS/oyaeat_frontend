"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowDownLeft, ArrowUpRight, Banknote, Clock, Info, Loader2, Wallet } from "lucide-react";
import { walletApi } from "@/lib/api/walletService";
import { EmptyState, ErrorState, PageHeader } from "@/components/shared/states";
import { Badge, Panel, adminField } from "@/components/superadmin/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const naira = (n: number) => `₦${Math.round(Number(n) || 0).toLocaleString("en-NG")}`;

export default function RiderEarningsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [confirming, setConfirming] = useState<number | null>(null);
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setSummary(await walletApi.getWalletSummary("riderToken"));
    } catch (e: any) {
      setError(e?.message || "We couldn't load your earnings.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const balance = Number(summary?.wallet?.balance) || 0;
  const hasBank = !!summary?.hasBankDetails;
  const txns: any[] = summary?.wallet?.transactions || [];

  const review = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseFloat(amount);
    if (!n || n <= 0) return setAmountError("Enter an amount to withdraw.");
    if (n > balance) return setAmountError(`You can withdraw up to ${naira(balance)}.`);
    setAmountError("");
    setConfirming(n);
  };

  const send = async () => {
    if (confirming === null) return;
    const n = confirming;
    setConfirming(null);
    setSending(true);
    try {
      await walletApi.submitWithdrawal(n, "riderToken");
      toast.success("Payout requested. We'll notify you when it's sent.");
      setAmount("");
      await load();
    } catch (e: any) {
      toast.error(e?.message || "Couldn't submit the payout request.");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="space-y-4" aria-busy="true"><Skeleton className="h-40 rounded-3xl bg-muted" /><Skeleton className="h-64 rounded-3xl bg-muted" /></div>;
  if (error) return <ErrorState title="We couldn't load your earnings" message={error} onRetry={load} />;

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader title="Earnings" subtitle="Your balance and payouts." />

      <section className="lp-doodles rounded-3xl p-5 text-white shadow-card sm:p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-violet-200">Available balance</p>
        <p className="font-display mt-1 text-4xl font-extrabold tracking-tight">{naira(balance)}</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-white/10 p-3"><dt className="text-violet-200">Today</dt><dd className="font-extrabold">{summary?.todayEarnings || "₦0"}</dd></div>
          <div className="rounded-2xl bg-white/10 p-3"><dt className="text-violet-200">This week</dt><dd className="font-extrabold">{summary?.weeklyEarnings || "₦0"}</dd></div>
        </dl>
      </section>

      <div className={`flex items-start gap-3 rounded-2xl border p-4 ${hasBank ? "border-border bg-card" : "border-mango-300 bg-mango-50"}`}>
        <Info className={`mt-0.5 h-5 w-5 shrink-0 ${hasBank ? "text-primary" : "text-mango-700"}`} />
        <div>
          <p className="text-sm font-bold">Payout destination</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{hasBank ? `Payouts go to ${summary.linkedBankAccount}.` : "No bank account is linked yet. Email your bank details to support to enable payouts."}</p>
        </div>
      </div>

      <Panel title="Request a payout">
        <form onSubmit={review} noValidate className="space-y-3">
          <div>
            <label htmlFor="amt" className="mb-1.5 block text-sm font-bold">Amount (₦)</label>
            <input id="amt" type="number" inputMode="decimal" min="0" value={amount} onChange={(e) => { setAmount(e.target.value); setAmountError(""); }} placeholder="0" disabled={!hasBank || sending} aria-invalid={!!amountError} className={adminField} />
            {amountError && <p role="alert" className="mt-1.5 text-sm font-semibold text-destructive">{amountError}</p>}
          </div>
          <button type="submit" disabled={!hasBank || balance <= 0 || sending} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-cta text-base font-extrabold text-cta-foreground shadow-sm transition hover:bg-mango-300 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8">
            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Banknote className="h-5 w-5" /> Review payout</>}
          </button>
        </form>
      </Panel>

      <Panel title="Activity">
        {txns.length === 0 ? (
          <EmptyState icon={Wallet} title="No activity yet" body="Earnings and payouts will be listed here." className="border-0 py-8" />
        ) : (
          <ul className="divide-y divide-border">
            {txns.map((t) => {
              const out = t.type === "withdrawal";
              return (
                <li key={t.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${out ? "bg-mango-100 text-mango-800" : "bg-success-soft text-success"}`}>{out ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold">{t.description}</span>
                    <span className="block text-sm text-muted-foreground">{new Date(t.createdAt).toLocaleString(undefined, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1">
                    <span className="font-extrabold">{out ? "−" : "+"}{naira(Number(t.amount))}</span>
                    <Badge tone={t.status === "completed" ? "success" : "mango"}>{t.status === "completed" ? "Completed" : <><Clock className="mr-1 h-3 w-3" />{t.status}</>}</Badge>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      <AlertDialog open={confirming !== null} onOpenChange={(o) => !o && setConfirming(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Request a payout of {naira(confirming || 0)}?</AlertDialogTitle>
            <AlertDialogDescription>It will be sent to {summary?.linkedBankAccount || "your linked bank account"}.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Not now</AlertDialogCancel>
            <AlertDialogAction className="rounded-full bg-primary" onClick={send}>Request payout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
