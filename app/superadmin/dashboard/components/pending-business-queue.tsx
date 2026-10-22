"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { Business } from "@/lib/api/superadmin";
import { approveBusiness, rejectBusiness, suspendBusiness } from "@/lib/api/superadmin";
import { useToast } from "@/components/ui/toast-provider";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge, Panel, adminField } from "@/components/superadmin/ui";

const nameOf = (b: Business) => b.businessName || b.name || `Business #${b.id}`;
const when = (v?: string) => {
  const d = v ? new Date(v) : null;
  return d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "-";
};

export function PendingBusinessQueue({ businesses, onChanged }: { businesses: Business[]; onChanged?: () => void }) {
  const { toast } = useToast();
  const [busyId, setBusyId] = useState<number | null>(null);
  const [dialog, setDialog] = useState<{ type: "reject" | "suspend"; b: Business } | null>(null);
  const [reason, setReason] = useState("");

  const pending = useMemo(() => businesses.filter((b) => b.status === "pending_review"), [businesses]);

  const run = async (b: Business, fn: () => Promise<unknown>, ok: string) => {
    setBusyId(b.id);
    try {
      await fn();
      toast(ok, nameOf(b), "success");
      onChanged?.();
    } catch (e: any) {
      toast("Action failed", e?.message || "Please try again.", "error");
    } finally {
      setBusyId(null);
    }
  };

  const confirm = async () => {
    if (!dialog) return;
    const { type, b } = dialog;
    if (type === "reject" && !reason.trim()) return;
    setDialog(null);
    await run(b, () => (type === "reject" ? rejectBusiness(b.id, reason.trim()) : suspendBusiness(b.id, reason.trim())), type === "reject" ? "Business rejected" : "Business suspended");
    setReason("");
  };

  return (
    <Panel
      title="Awaiting approval"
      subtitle="New business registrations to review."
      action={<Link href="/superadmin/dashboard/businesses" className="text-sm font-bold text-primary hover:underline">View all</Link>}
    >
      {pending.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-success-soft text-success"><CheckCircle2 className="h-7 w-7" /></span>
          <p className="font-display mt-3 text-lg font-bold">You&apos;re all caught up</p>
          <p className="text-sm text-muted-foreground">No businesses are waiting for review.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {pending.map((b) => {
            const busy = busyId === b.id;
            return (
              <li key={b.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold">{nameOf(b)}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {b.owner ? `${b.owner.firstName} ${b.owner.lastName} · ${b.owner.email}` : "Owner unknown"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Submitted {when(b.createdAt)}</p>
                  </div>
                  <Badge tone="mango">Pending</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button disabled={busy} onClick={() => run(b, () => approveBusiness(b.id), "Business approved")}
                    className="h-10 rounded-full bg-cta px-5 text-sm font-extrabold text-cta-foreground transition hover:bg-mango-300 disabled:opacity-60">
                    {busy ? "Working…" : "Approve"}
                  </button>
                  <button disabled={busy} onClick={() => { setReason(""); setDialog({ type: "reject", b }); }}
                    className="h-10 rounded-full border border-destructive/30 px-4 text-sm font-bold text-destructive transition hover:bg-destructive/10 disabled:opacity-60">
                    Reject
                  </button>
                  <button disabled={busy} onClick={() => { setReason(""); setDialog({ type: "suspend", b }); }}
                    className="h-10 rounded-full border border-border px-4 text-sm font-bold text-foreground transition hover:bg-violet-50 disabled:opacity-60">
                    Suspend
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={!!dialog} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>{dialog?.type === "reject" ? "Reject" : "Suspend"} {dialog && nameOf(dialog.b)}?</DialogTitle>
            <DialogDescription>
              {dialog?.type === "reject" ? "The owner will see this reason, so keep it clear and specific." : "Add an optional note for the audit trail."}
            </DialogDescription>
          </DialogHeader>
          <textarea
            autoFocus
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder={dialog?.type === "reject" ? "e.g. CAC document is unreadable" : "Optional reason"}
            className={`${adminField} h-auto py-3`}
            aria-label="Reason"
          />
          <DialogFooter className="gap-2">
            <button onClick={() => setDialog(null)} className="h-11 rounded-full border border-border px-5 text-sm font-bold hover:bg-violet-50">Cancel</button>
            <button onClick={confirm} disabled={dialog?.type === "reject" && !reason.trim()}
              className="h-11 rounded-full bg-destructive px-5 text-sm font-extrabold text-destructive-foreground disabled:opacity-50">
              {dialog?.type === "reject" ? "Reject business" : "Suspend business"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Panel>
  );
}
