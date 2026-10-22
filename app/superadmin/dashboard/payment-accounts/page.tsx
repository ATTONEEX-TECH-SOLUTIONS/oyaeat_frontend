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
import {
  paymentAccountsApi,
  type CashCommissionRow,
  type PaymentAccountRow,
  type RiderAccountRow,
} from "@/lib/api/walletService";

type Bank = { name: string; code: string };
type Tab = "restaurants" | "riders" | "cash";

const naira = (n: number) => `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;

export default function PaymentAccountsPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("restaurants");
  const [rows, setRows] = useState<PaymentAccountRow[]>([]);
  const [riders, setRiders] = useState<RiderAccountRow[]>([]);
  const [cash, setCash] = useState<CashCommissionRow[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<PaymentAccountRow | null>(null);
  const [editingRider, setEditingRider] = useState<RiderAccountRow | null>(null);
  const [settling, setSettling] = useState<CashCommissionRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [a, b, c] = await Promise.all([
        paymentAccountsApi.list(),
        paymentAccountsApi.listRiders(),
        paymentAccountsApi.listCashCommissions(),
      ]);
      setRows(a);
      setRiders(b);
      setCash(c);
    } catch (e: any) {
      setError(e?.message || "Couldn't load payment accounts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    paymentAccountsApi.banks().then(setBanks).catch(() => {});
  }, [load]);

  const q = search.toLowerCase();
  const filtered = useMemo(() => rows.filter((r) => r.name.toLowerCase().includes(q)), [rows, q]);
  const filteredRiders = useMemo(() => riders.filter((r) => r.name.toLowerCase().includes(q)), [riders, q]);
  const activeCount = rows.filter((r) => r.account?.active).length;
  const totalOwed = cash.reduce((n, c) => n + c.owed, 0);

  const tabs: { id: Tab; label: string; count?: string }[] = [
    { id: "restaurants", label: "Restaurants", count: `${activeCount}/${rows.length}` },
    { id: "riders", label: "Riders", count: `${riders.filter((r) => r.account).length}/${riders.length}` },
    { id: "cash", label: "Cash commission", count: cash.length ? naira(totalOwed) : undefined },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">Payment accounts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Restaurants are paid straight to their bank when a customer pays, with OyaEat's commission taken from the same payment. Riders are paid
          automatically after each delivery.
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              tab === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-violet-100"
            }`}
          >
            {t.label}
            {t.count && <span className="ml-2 opacity-70">{t.count}</span>}
          </button>
        ))}
      </div>

      {tab !== "cash" && (
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input className={`${adminField} pl-10`} placeholder={`Search ${tab}…`} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" onClick={load} disabled={loading} className="h-11 rounded-xl gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      )}

      {error && <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</p>}

      <Panel>
        {loading ? (
          <div className="grid place-items-center py-16"><Loader2 className="h-6 w-6 animate-spin text-violet-600" /></div>
        ) : tab === "restaurants" ? (
          filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No approved restaurants found.</p>
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((r) => (
                <li key={r.businessId} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{r.name}</p>
                    {r.account ? (
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {r.account.bankName} · {r.account.accountNumber} · {r.account.accountName} ·{" "}
                        {r.account.commissionPercent != null ? `${r.account.commissionPercent}% commission` : "default commission"}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {r.submittedBank ? `Submitted: ${r.submittedBank.bankName} · ${r.submittedBank.accountNumber}` : "No bank details yet"}
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
          )
        ) : tab === "riders" ? (
          filteredRiders.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No riders found.</p>
          ) : (
            <ul className="divide-y divide-border">
              {filteredRiders.map((r) => (
                <li key={r.userId} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{r.name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {r.account
                        ? `${r.account.bankName} · ${r.account.accountNumber} · ${r.account.accountName}`
                        : r.submittedBank
                          ? `Submitted: ${r.submittedBank.bankName} · ${r.submittedBank.accountNumber}`
                          : "No bank details yet"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {r.account ? <Badge tone="success">Auto-pay on</Badge> : <Badge tone="mango">Not set up</Badge>}
                    <Button size="sm" className="rounded-full" onClick={() => setEditingRider(r)}>
                      <Landmark className="mr-1.5 h-4 w-4" /> {r.account ? "Edit" : "Set up"}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )
        ) : cash.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No restaurant owes commission on cash orders right now.</p>
        ) : (
          <ul className="divide-y divide-border">
            {cash.map((c) => (
              <li key={c.userId} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">Commission on cash orders the restaurant has not paid yet</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg font-extrabold">{naira(c.owed)}</span>
                  <Button size="sm" className="rounded-full" onClick={() => setSettling(c)}>Record payment</Button>
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
          onSave={async (v) => {
            await paymentAccountsApi.save(editing.businessId, v);
          }}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            toast("Payment account saved", "The restaurant can now take online payments.", "success");
            load();
          }}
          onPaused={async () => {
            await paymentAccountsApi.deactivate(editing.businessId);
            setEditing(null);
            toast("Payment account paused", "Online payments are off for this restaurant.", "success");
            load();
          }}
        />
      )}

      {editingRider && (
        <AccountDialog
          riderMode
          row={editingRider}
          banks={banks}
          onSave={async (v) => {
            await paymentAccountsApi.saveRider(editingRider.userId, v);
          }}
          onClose={() => setEditingRider(null)}
          onSaved={() => {
            setEditingRider(null);
            toast("Rider account saved", "Delivery fees will now be paid automatically.", "success");
            load();
          }}
        />
      )}

      {settling && (
        <SettleDialog
          row={settling}
          onClose={() => setSettling(null)}
          onDone={() => {
            setSettling(null);
            toast("Payment recorded", "The amount owed has been updated.", "success");
            load();
          }}
        />
      )}
    </div>
  );
}

function SettleDialog({ row, onClose, onDone }: { row: CashCommissionRow; onClose: () => void; onDone: () => void }) {
  const [amount, setAmount] = useState(String(row.owed));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const n = Number(amount);
  const valid = n > 0 && n <= row.owed + 0.005;

  const submit = async () => {
    setSaving(true);
    setErr("");
    try {
      await paymentAccountsApi.settleCashCommission(row.userId, n);
      onDone();
    } catch (e: any) {
      setErr(e.message);
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record commission payment</DialogTitle>
          <DialogDescription>{row.name} owes {naira(row.owed)}</DialogDescription>
        </DialogHeader>
        <label className="block text-sm font-semibold">
          Amount received (₦)
          <input className={`${adminField} mt-1.5`} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))} />
        </label>
        {err && <p className="text-sm font-medium text-destructive">{err}</p>}
        <DialogFooter>
          <Button onClick={submit} disabled={saving || !valid} className="rounded-full">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type DialogRow = {
  name: string;
  account: { bankName: string; bankCode: string | null; accountNumber: string; active: boolean; commissionPercent?: number | null } | null;
  submittedBank: { accountNumber: string } | null;
};

function AccountDialog({
  row,
  banks,
  riderMode,
  onSave,
  onClose,
  onSaved,
  onPaused,
}: {
  row: DialogRow;
  banks: Bank[];
  riderMode?: boolean;
  onSave: (v: { bankCode: string; bankName: string; accountNumber: string; commissionPercent: number | null }) => Promise<void>;
  onClose: () => void;
  onSaved: () => void;
  onPaused?: () => void;
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
      await onSave({ bankCode, bankName, accountNumber, commissionPercent: riderMode ? null : commissionNum });
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
      await onPaused?.();
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

          {!riderMode && (
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
          )}

          {err && <p className="text-sm font-medium text-destructive">{err}</p>}
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /> {riderMode ? "Delivery fees are sent to this account automatically after each delivery." : "Restaurants can't change these details themselves. Only an admin can."}
          </p>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          {!riderMode && existing?.active ? (
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
