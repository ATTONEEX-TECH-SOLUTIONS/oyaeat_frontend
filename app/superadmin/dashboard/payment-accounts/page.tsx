"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Landmark, Loader2, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { Panel, Badge, adminField } from "@/components/superadmin/ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast-provider";
import { paymentAccountsApi, type PaymentAccountRow } from "@/lib/api/walletService";

type Bank = { name: string; code: string };

export default function PaymentAccountsPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<PaymentAccountRow[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<PaymentAccountRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRows(await paymentAccountsApi.list());
    } catch (e: any) {
      setError(e?.message || "Couldn't load restaurants");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    paymentAccountsApi.banks().then(setBanks).catch(() => {});
  }, [load]);

  const filtered = useMemo(
    () => rows.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())),
    [rows, search],
  );
  const activeCount = rows.filter((r) => r.account?.active).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">Payment accounts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Each restaurant is paid straight to its bank when a customer pays. OyaEat keeps its commission from the same payment.
          </p>
        </div>
        {!loading && (
          <Badge tone={activeCount === rows.length && rows.length > 0 ? "success" : "mango"}>
            {activeCount} of {rows.length} set up
          </Badge>
        )}
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input className={`${adminField} pl-10`} placeholder="Search restaurants…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="outline" onClick={load} disabled={loading} className="h-11 rounded-xl gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {error && <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</p>}

      <Panel>
        {loading ? (
          <div className="grid place-items-center py-16"><Loader2 className="h-6 w-6 animate-spin text-violet-600" /></div>
        ) : filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No approved restaurants found.</p>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((r) => (
              <li key={r.businessId} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{r.name}</p>
                  {r.account ? (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {r.account.bankName} · {r.account.accountNumber} · {r.account.accountName}
                      {" · "}
                      {r.account.commissionPercent != null ? `${r.account.commissionPercent}% commission` : "default commission"}
                    </p>
                  ) : (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {r.submittedBank
                        ? `Submitted: ${r.submittedBank.bankName} · ${r.submittedBank.accountNumber}`
                        : "No bank details yet"}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {r.account?.active ? <Badge tone="success">Active</Badge> : r.account ? <Badge tone="danger">Paused</Badge> : <Badge tone="mango">Not set up</Badge>}
                  <Button size="sm" className="rounded-full" onClick={() => setEditing(r)}>
                    <Landmark className="mr-1.5 h-4 w-4" /> {r.account ? "Edit" : "Set up"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {editing && (
        <AccountDialog
          row={editing}
          banks={banks}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            toast("Payment account saved", "The restaurant can now take online payments.", "success");
            load();
          }}
          onPaused={() => {
            setEditing(null);
            toast("Payment account paused", "Online payments are off for this restaurant.", "success");
            load();
          }}
        />
      )}
    </div>
  );
}

function AccountDialog({
  row,
  banks,
  onClose,
  onSaved,
  onPaused,
}: {
  row: PaymentAccountRow;
  banks: Bank[];
  onClose: () => void;
  onSaved: () => void;
  onPaused: () => void;
}) {
  const existing = row.account;
  const [bankCode, setBankCode] = useState(existing?.bankCode || "");
  const [accountNumber, setAccountNumber] = useState(existing?.accountNumber || row.submittedBank?.accountNumber || "");
  const [commission, setCommission] = useState(existing?.commissionPercent != null ? String(existing.commissionPercent) : "");
  const [resolvedName, setResolvedName] = useState("");
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const bankName = banks.find((b) => b.code === bankCode)?.name || existing?.bankName || "";
  const numberOk = /^\d{10}$/.test(accountNumber);

  // Verify the account with the bank as soon as both fields are valid.
  useEffect(() => {
    setResolvedName("");
    setErr("");
    if (!bankCode || !numberOk) return;
    let cancelled = false;
    setChecking(true);
    paymentAccountsApi
      .resolve(accountNumber, bankCode)
      .then((r) => !cancelled && setResolvedName(r.accountName))
      .catch((e) => !cancelled && setErr(e.message))
      .finally(() => !cancelled && setChecking(false));
    return () => {
      cancelled = true;
    };
  }, [bankCode, accountNumber, numberOk]);

  const commissionNum = commission.trim() === "" ? null : Number(commission);
  const commissionOk = commissionNum === null || (commissionNum >= 0 && commissionNum < 100);

  const save = async () => {
    setSaving(true);
    setErr("");
    try {
      await paymentAccountsApi.save(row.businessId, { bankCode, bankName, accountNumber, commissionPercent: commissionNum });
      onSaved();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const pause = async () => {
    setSaving(true);
    try {
      await paymentAccountsApi.deactivate(row.businessId);
      onPaused();
    } catch (e: any) {
      setErr(e.message);
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{existing ? "Edit" : "Set up"} payment account</DialogTitle>
          <DialogDescription>{row.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="block text-sm font-semibold">
            Bank
            <select className={`${adminField} mt-1.5`} value={bankCode} onChange={(e) => setBankCode(e.target.value)}>
              <option value="">Select a bank…</option>
              {banks.map((b) => (
                <option key={b.code} value={b.code}>{b.name}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold">
            Account number
            <input
              className={`${adminField} mt-1.5`}
              inputMode="numeric"
              maxLength={10}
              placeholder="10 digits"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
            />
          </label>

          <div className="min-h-[44px] rounded-xl bg-muted px-4 py-3 text-sm">
            {checking ? (
              <span className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Verifying with the bank…</span>
            ) : resolvedName ? (
              <span className="flex items-center gap-2 font-semibold text-success"><CheckCircle2 className="h-4 w-4" /> {resolvedName}</span>
            ) : (
              <span className="text-muted-foreground">The account name appears here once the bank confirms it. Check it matches the business.</span>
            )}
          </div>

          <label className="block text-sm font-semibold">
            Commission % <span className="font-normal text-muted-foreground">(leave empty for the platform default)</span>
            <input
              className={`${adminField} mt-1.5`}
              inputMode="decimal"
              placeholder="e.g. 15"
              value={commission}
              onChange={(e) => setCommission(e.target.value.replace(/[^\d.]/g, ""))}
            />
          </label>

          {err && <p className="text-sm font-medium text-destructive">{err}</p>}
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /> Restaurants can't change these details themselves. Only an admin can.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          {existing?.active ? (
            <Button variant="outline" onClick={pause} disabled={saving} className="rounded-full text-destructive">Pause payments</Button>
          ) : <span />}
          <Button onClick={save} disabled={saving || !resolvedName || !commissionOk} className="rounded-full">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
