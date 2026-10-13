"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Inbox, Megaphone, Radio } from "lucide-react";
import { PageHeader, ErrorState, TableSkeleton, EmptyState } from "@/components/shared/states";
import { AdminStat, Badge } from "@/components/superadmin/ui";
import { ReviewDesk } from "@/components/superadmin/campaigns/ReviewDesk";
import { CampaignGrid } from "@/components/superadmin/campaigns/CampaignGrid";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast-provider";
import { campaignState, isImageUrl, type Campaign } from "@/lib/campaigns";
import {
  approveCampaign,
  deleteCampaign,
  fetchAllCampaigns,
  fetchPendingCampaigns,
  fetchRejectedCampaigns,
  rejectCampaign,
  setCampaignVisible,
} from "@/lib/api/campaigns";

type Confirm = { type: "reject" | "delete"; c: Campaign } | null;

export default function CampaignsPage() {
  const { toast } = useToast();
  const [all, setAll] = useState<Campaign[]>([]);
  const [pending, setPending] = useState<Campaign[]>([]);
  const [rejected, setRejected] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [rowBusy, setRowBusy] = useState<number | null>(null);
  const [confirm, setConfirm] = useState<Confirm>(null);
  const [reason, setReason] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const [a, p, r] = await Promise.all([fetchAllCampaigns(), fetchPendingCampaigns(), fetchRejectedCampaigns()]);
      setAll(a);
      setPending(p);
      setRejected(r);
    } catch (e: any) {
      setError(e.message || "Couldn't load campaigns.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // everything the admin has already decided on, minus the review queue and rejections
  const published = useMemo(
    () => all.filter((c) => ["live", "expired", "hidden"].includes(campaignState(c))),
    [all],
  );
  const liveCount = published.filter((c) => campaignState(c) === "live").length;

  const guard = async (fn: () => Promise<unknown>, ok: string, name?: string | null) => {
    try {
      await fn();
      toast(ok, name || undefined, "success");
      await load();
      return true;
    } catch (e: any) {
      toast("Action failed", e?.message || "Please try again.", "error");
      return false;
    }
  };

  const approve = async (c: Campaign, edits: { title: string; desc: string }) => {
    setBusy(true);
    await guard(() => approveCampaign(c.id, edits), "Campaign is live", edits.title);
    setBusy(false);
  };

  const toggle = async (c: Campaign, visible: boolean) => {
    setRowBusy(c.id);
    await guard(() => setCampaignVisible(c.id, visible), visible ? "Showing to customers" : "Hidden from customers", c.title);
    setRowBusy(null);
  };

  const runConfirm = async () => {
    if (!confirm) return;
    const { type, c } = confirm;
    setBusy(true);
    const ok = await guard(
      () => (type === "reject" ? rejectCampaign(c.id, reason.trim()) : deleteCampaign(c.id)),
      type === "reject" ? "Campaign rejected" : "Campaign deleted",
      c.title,
    );
    setBusy(false);
    if (ok) {
      setConfirm(null);
      setReason("");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        subtitle="Review restaurant banners before they reach customers, and control what is live."
      />

      {loading ? (
        <TableSkeleton rows={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => { setLoading(true); load(); }} />
      ) : (
        <>
          <p className="rounded-xl bg-card px-4 py-2.5 text-sm font-semibold shadow-card sm:hidden">
            <span className={pending.length ? "text-mango-700" : ""}>{pending.length} to review</span>
            <span className="text-muted-foreground"> · </span>{liveCount} live
            <span className="text-muted-foreground"> · </span>{rejected.length} rejected
          </p>
          <div className="hidden gap-3 sm:grid sm:grid-cols-3">
            <AdminStat label="Awaiting review" value={pending.length} icon={Inbox} tone="mango" highlight={pending.length > 0} sub={pending.length ? "Restaurants are waiting" : "All caught up"} />
            <AdminStat label="Live now" value={liveCount} icon={Radio} tone="success" sub="Visible on customer home" />
            <AdminStat label="Rejected" value={rejected.length} icon={Megaphone} sub="Kept for reference" />
          </div>

          <Tabs defaultValue={pending.length ? "review" : "live"} className="gap-4">
            <TabsList className="h-11 w-full justify-start overflow-x-auto sm:w-fit">
              <TabsTrigger value="review" className="gap-2">
                Review {pending.length > 0 && <Badge tone="mango">{pending.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="live">Published ({published.length})</TabsTrigger>
              <TabsTrigger value="history">Rejected ({rejected.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="review">
              <ReviewDesk
                queue={pending}
                busy={busy}
                onApprove={approve}
                onReject={(c) => { setReason(""); setConfirm({ type: "reject", c }); }}
              />
            </TabsContent>

            <TabsContent value="live">
              <CampaignGrid
                items={published}
                pendingId={rowBusy}
                onToggle={toggle}
                onDelete={(c) => setConfirm({ type: "delete", c })}
                emptyTitle="Nothing published yet"
                emptyBody="Approved campaigns appear here. Switch one off to hide it from customers without deleting it."
              />
            </TabsContent>

            <TabsContent value="history">
              {rejected.length === 0 ? (
                <EmptyState icon={Megaphone} title="No rejected campaigns" body="Rejected submissions are archived here." />
              ) : (
                <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                  {rejected.map((c) => (
                    <li key={c.id} className="flex items-center gap-3 p-3 sm:p-4">
                      <span
                        className="h-12 w-16 shrink-0 rounded-lg bg-violet-100 bg-cover bg-center"
                        style={isImageUrl(c.bgGradient) ? { backgroundImage: `url(${c.bgGradient})` } : undefined}
                        aria-hidden
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">{c.title || "(No headline)"}</p>
                        <p className="truncate text-xs text-muted-foreground">{c.business?.name || `Restaurant #${c.businessId}`}</p>
                      </div>
                      <Badge tone="danger">Rejected</Badge>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setConfirm({ type: "delete", c })}>
                        Delete
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}

      <Dialog open={!!confirm} onOpenChange={(o) => !o && !busy && setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirm?.type === "reject" ? "Reject this campaign?" : "Delete this campaign?"}</DialogTitle>
            <DialogDescription>
              {confirm?.type === "reject"
                ? `"${confirm.c.title || "Untitled"}" will not go live and the restaurant is told it was rejected.`
                : `"${confirm?.c.title || "Untitled"}" and its image are permanently removed. This can't be undone.`}
            </DialogDescription>
          </DialogHeader>
          {confirm?.type === "reject" && (
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for the restaurant (optional)"
              rows={3}
              maxLength={300}
            />
          )}
          <DialogFooter>
            <Button variant="outline" disabled={busy} onClick={() => setConfirm(null)}>Cancel</Button>
            <Button disabled={busy} onClick={runConfirm} className="bg-destructive text-white hover:bg-destructive/90">
              {confirm?.type === "reject" ? "Reject" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
