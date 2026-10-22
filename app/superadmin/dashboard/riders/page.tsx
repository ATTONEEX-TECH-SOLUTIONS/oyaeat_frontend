"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bike, Clock, Radio, Search, UserCheck } from "lucide-react";
import { PageHeader, EmptyState, ErrorState, TableSkeleton } from "@/components/shared/states";
import { AdminStat, Badge } from "@/components/superadmin/ui";
import RiderRow from "@/components/superadmin/riders/RiderRow";
import RiderSheet, { type RiderAction } from "@/components/superadmin/riders/RiderSheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast-provider";
import { deleteRiderApplication, fetchRiders, setRiderStatus, updateRider, type AdminRider, type RiderStatus } from "@/lib/api/riders";

const TABS: { id: "all" | RiderStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "verified", label: "Verified" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

const NEXT: Record<Exclude<RiderAction, "reject">, { status: RiderStatus; done: string }> = {
  verify: { status: "verified", done: "Rider verified" },
  activate: { status: "active", done: "Rider activated" },
  reactivate: { status: "active", done: "Rider reactivated" },
  deactivate: { status: "inactive", done: "Rider deactivated" },
};

export default function RidersPage() {
  const { toast } = useToast();
  const [riders, setRiders] = useState<AdminRider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | RiderStatus>("all");
  const [openId, setOpenId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<{ action: "reject" | "deactivate"; rider: AdminRider } | null>(null);

  const load = useCallback(async () => {
    setError("");
    try {
      setRiders(await fetchRiders());
    } catch (e: any) {
      setError(e.message || "Couldn't load riders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const count = (s: RiderStatus) => riders.filter((r) => r.status === s).length;
  const online = riders.filter((r) => r.isOnline).length;
  const open = riders.find((r) => r.id === openId) || null;

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return riders.filter(
      (r) =>
        (tab === "all" || r.status === tab) &&
        (!term || `${r.firstName} ${r.lastName} ${r.email} ${r.phone}`.toLowerCase().includes(term)),
    );
  }, [riders, q, tab]);

  const run = async (fn: () => Promise<unknown>, ok: string, name?: string) => {
    setBusy(true);
    try {
      await fn();
      toast(ok, name, "success");
      await load();
      return true;
    } catch (e: any) {
      toast("Action failed", e?.message || "Please try again.", "error");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const onAction = (action: RiderAction, rider: AdminRider) => {
    if (action === "reject" || action === "deactivate") return setConfirm({ action, rider });
    const n = NEXT[action];
    run(() => setRiderStatus(rider.id, n.status), n.done, `${rider.firstName} ${rider.lastName}`);
  };

  const runConfirm = async () => {
    if (!confirm) return;
    const { action, rider } = confirm;
    const name = `${rider.firstName} ${rider.lastName}`;
    const ok =
      action === "reject"
        ? await run(() => deleteRiderApplication(rider.id), "Application rejected", name)
        : await run(() => setRiderStatus(rider.id, "inactive"), NEXT.deactivate.done, name);
    if (ok) {
      setConfirm(null);
      if (action === "reject") setOpenId(null);
    }
  };

  const onSave = async (rider: AdminRider, edits: Parameters<typeof updateRider>[1]) =>
    run(() => updateRider(rider.id, edits), "Rider updated", `${edits.firstName} ${edits.lastName}`);

  return (
    <div className="space-y-6">
      <PageHeader title="Riders" subtitle="Review applications, verify identity documents and manage who can deliver." />

      {loading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => { setLoading(true); load(); }} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <AdminStat label="Awaiting review" value={count("pending")} icon={Clock} tone="mango" highlight={count("pending") > 0} sub={count("pending") ? "Need a decision" : "All caught up"} />
            <AdminStat label="Verified" value={count("verified")} icon={UserCheck} sub="Ready to activate" />
            <AdminStat label="Active" value={count("active")} icon={Bike} tone="success" sub="Can take deliveries" />
            <AdminStat label="Online now" value={online} icon={Radio} tone="success" sub="On shift" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="min-w-0">
              <TabsList className="no-scrollbar h-11 max-w-full justify-start overflow-x-auto">
                {TABS.map((t) => (
                  <TabsTrigger key={t.id} value={t.id} className="gap-1.5">
                    {t.label}
                    <span className="text-xs text-muted-foreground">{t.id === "all" ? riders.length : count(t.id)}</span>
                    {t.id === "pending" && count("pending") > 0 && <Badge tone="mango">new</Badge>}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="relative sm:ml-auto sm:w-72">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name, email or phone"
                aria-label="Search riders"
                className="h-11 w-full rounded-full border border-input bg-card pl-10 pr-4 text-sm outline-none focus:border-ring focus:ring-4 focus:ring-ring/15"
              />
            </div>
          </div>

          {shown.length === 0 ? (
            <EmptyState
              icon={Bike}
              title={riders.length === 0 ? "No riders yet" : "No riders match"}
              body={riders.length === 0 ? "Rider applications will show up here once people sign up to deliver." : "Try a different tab or search."}
            />
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              {shown.map((r) => (
                <RiderRow key={r.id} rider={r} onOpen={() => setOpenId(r.id)} />
              ))}
            </ul>
          )}
        </>
      )}

      <RiderSheet rider={open} busy={busy} onClose={() => setOpenId(null)} onAction={onAction} onSave={onSave} />

      <Dialog open={!!confirm} onOpenChange={(o) => !o && !busy && setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirm?.action === "reject" ? "Reject and delete this application?" : "Deactivate this rider?"}</DialogTitle>
            <DialogDescription>
              {confirm?.action === "reject"
                ? `${confirm.rider.firstName} ${confirm.rider.lastName}'s account and uploaded document are permanently deleted. They would have to sign up again.`
                : `${confirm?.rider.firstName} ${confirm?.rider.lastName} will stop receiving delivery requests until you reactivate them.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" disabled={busy} onClick={() => setConfirm(null)}>Cancel</Button>
            <Button disabled={busy} onClick={runConfirm} className="bg-destructive text-white hover:bg-destructive/90">
              {confirm?.action === "reject" ? "Reject & delete" : "Deactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
