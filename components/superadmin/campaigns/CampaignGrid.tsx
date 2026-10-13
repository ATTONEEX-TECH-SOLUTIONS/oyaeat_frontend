"use client";

import { Eye, EyeOff, Megaphone, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/shared/states";
import { Badge, type Tone } from "@/components/superadmin/ui";
import { PromoCard } from "@/components/campaigns/PromoCard";
import { Switch } from "@/components/ui/switch";
import { campaignState, type Campaign, type CampaignState } from "@/lib/campaigns";

const LABEL: Record<CampaignState, { text: string; tone: Tone }> = {
  live: { text: "Live", tone: "success" },
  expired: { text: "Expired", tone: "neutral" },
  hidden: { text: "Hidden", tone: "mango" },
  pending: { text: "Pending", tone: "violet" },
  rejected: { text: "Rejected", tone: "danger" },
};

const when = (v?: string | null) => {
  const d = v ? new Date(v) : null;
  return d && !Number.isNaN(d.getTime())
    ? d.toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : null;
};

/** Live / expired / hidden campaigns as cards: preview + visibility switch + delete. */
export function CampaignGrid({
  items,
  pendingId,
  onToggle,
  onDelete,
  emptyTitle,
  emptyBody,
}: {
  items: Campaign[];
  pendingId: number | null;
  onToggle: (c: Campaign, visible: boolean) => void;
  onDelete: (c: Campaign) => void;
  emptyTitle: string;
  emptyBody: string;
}) {
  if (!items.length) return <EmptyState icon={Megaphone} title={emptyTitle} body={emptyBody} />;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((c) => {
        const state = campaignState(c);
        const label = LABEL[state];
        const ends = when(c.expiresAt);
        return (
          <article key={c.id} className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <PromoCard promo={c} preview className="rounded-none shadow-none" />
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-2">
                <Badge tone={label.tone}>{label.text}</Badge>
                {ends && (
                  <span className="text-xs text-muted-foreground">
                    {state === "live" ? "Ends" : "Ended"} {ends}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <Switch
                    checked={state === "live"}
                    disabled={pendingId === c.id}
                    onCheckedChange={(v) => onToggle(c, v)}
                    aria-label={state === "live" ? "Hide from customers" : "Show to customers"}
                  />
                  {state === "live" ? (
                    <span className="inline-flex items-center gap-1"><Eye className="h-4 w-4" /> Showing</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-muted-foreground"><EyeOff className="h-4 w-4" /> Not showing</span>
                  )}
                </label>
                <button
                  type="button"
                  onClick={() => onDelete(c)}
                  aria-label={`Delete ${c.title || "campaign"}`}
                  className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
