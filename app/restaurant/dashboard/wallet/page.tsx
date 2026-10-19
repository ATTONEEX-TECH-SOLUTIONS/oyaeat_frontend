"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Banknote, Info, Loader2, Wallet } from "lucide-react";
import { vendorApi, type EarningsData } from "@/lib/api/vendor";
import { EmptyState, ErrorState, PageHeader } from "@/components/shared/states";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const naira = (n: number | null | undefined) =>
  n == null ? "—" : `₦${(Math.round(n * 100) / 100).toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;

function Stat({ label, value, sub, tone = "default" }: { label: string; value: string; sub?: string; tone?: "default" | "warn" | "good" }) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-5 shadow-card",
        tone === "warn" ? "border-mango-300 bg-mango-50" : "border-border bg-card",
      )}
    >
      <p className="text-sm font-semibold text-muted-foreground">{label}</p>
      <p className={cn("font-display mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl", tone === "good" && "text-success")}>{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export default function EarningsPage() {
  const [data, setData] = useState<EarningsData | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await vendorApi.getEarnings(page));
    } catch (e: any) {
      setError(e?.message || "We couldn't load your earnings.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const withdrawEarlierBalance = async () => {
    if (!data || data.summary.walletBalance <= 0) return;
    setWithdrawing(true);
    try {
      await vendorApi.requestWithdrawal(data.summary.walletBalance);
      toast.success("Payout requested. We'll notify you when it's sent.");
      await load();
    } catch (e: any) {
      toast.error(e?.message || "Couldn't submit the payout request");
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader title="Earnings" subtitle="What you've earned, and what OyaEat keeps from each order." />

      {loading && !data ? (
        <div className="space-y-4" aria-busy="true">
          <div className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-32 rounded-3xl bg-muted" />)}
          </div>
          <Skeleton className="h-64 rounded-3xl bg-muted" />
        </div>
      ) : error ? (
        <ErrorState title="We couldn't load your earnings" message={error} onRetry={load} />
      ) : !data ? null : (
        <>
          <div className={cn("flex items-start gap-3 rounded-2xl border p-4", data.account?.active ? "border-border bg-card" : "border-mango-300 bg-mango-50")}>
            <Info className={cn("mt-0.5 h-5 w-5 shrink-0", data.account?.active ? "text-primary" : "text-mango-700")} />
            <div>
              <p className="text-sm font-bold">Where your money goes</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {data.account?.active
                  ? `When a customer pays online, your share is sent straight to ${data.account.bankName} · ${data.account.accountNumber} (${data.account.accountName}) by Paystack, usually the next business day. You don't need to withdraw anything.`
                  : data.account
                    ? "Online payments are paused for your restaurant. Contact support to turn them back on."
                    : "Your payout account hasn't been set up yet, so customers can't pay online. Contact support and we'll set it up."}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Stat label="Sent to your bank" value={naira(data.summary.paidToBank)} sub={`from ${naira(data.summary.onlineSales)} of online sales`} tone="good" />
            <Stat label="OyaEat fees" value={naira(data.summary.platformFees)} sub="Kept from online payments" />
            {data.summary.cashOwed > 0 && (
              <Stat label="You owe OyaEat" value={naira(data.summary.cashOwed)} sub="Fee on orders customers paid you in cash. We'll collect it from you." tone="warn" />
            )}
          </div>

          {data.summary.walletBalance > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
              <div>
                <p className="text-sm font-bold">Earlier balance: {naira(data.summary.walletBalance)}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">From orders paid before your payout account was set up. You can withdraw this once.</p>
              </div>
              <button
                onClick={withdrawEarlierBalance}
                disabled={withdrawing}
                className="flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition hover:bg-violet-800 disabled:opacity-60"
              >
                {withdrawing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />} Withdraw
              </button>
            </div>
          )}

          {data.orders.length === 0 ? (
            <EmptyState icon={Banknote} title="No earnings yet" body="Paid orders show up here with the fee OyaEat kept and what you received." />
          ) : (
            <section className="rounded-3xl border border-border bg-card shadow-card">
              <h2 className="font-display border-b border-border px-5 py-4 text-lg font-bold">Orders</h2>
              <ul className="divide-y divide-border">
                {data.orders.map((o) => (
                  <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                    <div className="min-w-0">
                      <p className="font-semibold">
                        Order #{o.id}{" "}
                        <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">
                          {o.mode === "cash" ? "Cash" : "Online"}
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {new Date(o.createdAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })} · {o.note}
                      </p>
                    </div>
                    <dl className="flex gap-6 text-right text-sm">
                      <div><dt className="text-xs text-muted-foreground">Order total</dt><dd className="font-semibold">{naira(o.total)}</dd></div>
                      <div><dt className="text-xs text-muted-foreground">OyaEat fee</dt><dd className="font-semibold">{naira(o.platformFee)}</dd></div>
                      <div><dt className="text-xs text-muted-foreground">You get</dt><dd className="font-bold text-success">{naira(o.youReceive)}</dd></div>
                    </dl>
                  </li>
                ))}
              </ul>
              {data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border px-5 py-3 text-sm">
                  <button disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)} className="font-semibold text-primary disabled:opacity-40">Previous</button>
                  <span className="text-muted-foreground">Page {data.pagination.page} of {data.pagination.totalPages}</span>
                  <button disabled={page >= data.pagination.totalPages || loading} onClick={() => setPage((p) => p + 1)} className="font-semibold text-primary disabled:opacity-40">Next</button>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
