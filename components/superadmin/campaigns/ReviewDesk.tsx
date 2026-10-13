"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Inbox, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/states";
import { Panel, adminField } from "@/components/superadmin/ui";
import { PromoCard } from "@/components/campaigns/PromoCard";
import { discountLabel, isImageUrl, type Campaign } from "@/lib/campaigns";
import { cn } from "@/lib/utils";

const TITLE_MAX = 60;
const DESC_MAX = 140;

export function ReviewDesk({
  queue,
  busy,
  onApprove,
  onReject,
}: {
  queue: Campaign[];
  busy: boolean;
  onApprove: (c: Campaign, edits: { title: string; desc: string }) => void;
  onReject: (c: Campaign) => void;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const selected = queue.find((c) => c.id === selectedId) || null;

  // open the first submission on desktop; clear when the selection leaves the queue
  useEffect(() => {
    if (selectedId && !queue.some((c) => c.id === selectedId)) setSelectedId(null);
  }, [queue, selectedId]);

  const open = (c: Campaign) => {
    setSelectedId(c.id);
    setTitle(c.title || "");
    setDesc(c.desc || "");
  };

  if (!queue.length) {
    return (
      <EmptyState
        icon={Inbox}
        title="Nothing waiting for review"
        body="When a restaurant submits a banner it will show up here for you to check before customers see it."
      />
    );
  }

  const code = selected?.code;
  const discount = discountLabel(selected?.discount);

  return (
    <div className="grid gap-4 lg:grid-cols-[22rem_1fr]">
      {/* queue */}
      <div className={cn("space-y-2", selected && "hidden lg:block")}>
        {queue.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => open(c)}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left shadow-card transition hover:border-violet-300",
              c.id === selectedId ? "border-primary ring-2 ring-primary/20" : "border-border",
            )}
          >
            <span
              className="h-14 w-20 shrink-0 rounded-xl bg-violet-100 bg-cover bg-center"
              style={isImageUrl(c.bgGradient) ? { backgroundImage: `url(${c.bgGradient})` } : undefined}
              aria-hidden
            />
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-foreground">{c.title || "(No headline)"}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {c.business?.name || `Restaurant #${c.businessId}`}
                {c.business?.city ? ` · ${c.business.city}` : ""}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* review */}
      <div className={cn(!selected && "hidden lg:block")}>
        {!selected ? (
          <EmptyState
            icon={CheckCircle2}
            title="Pick a submission"
            body="Choose one from the list to preview it as customers will see it, tidy the wording, then approve or reject."
          />
        ) : (
          <Panel
            title="Review submission"
            subtitle={`${selected.business?.name || `Restaurant #${selected.businessId}`}${selected.business?.city ? ` · ${selected.business.city}` : ""}`}
            action={
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary lg:hidden"
              >
                <ArrowLeft className="h-4 w-4" /> Queue
              </button>
            }
          >
            <div className="grid gap-5 xl:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  What customers will see
                </p>
                <PromoCard promo={{ ...selected, title, desc }} preview />
                {(code || discount) && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Submitted with {discount ? <b>{discount}</b> : null}
                    {discount && code ? " and code " : code ? "code " : ""}
                    {code ? <b className="font-mono">{code}</b> : null}. Not shown on the customer card.
                  </p>
                )}
              </div>

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  onApprove(selected, { title: title.trim(), desc: desc.trim() });
                }}
              >
                <div>
                  <div className="mb-1 flex justify-between text-sm font-semibold">
                    <label htmlFor="cmp-title">Headline</label>
                    <span className={cn("text-xs", title.length > TITLE_MAX ? "text-destructive" : "text-muted-foreground")}>
                      {title.length}/{TITLE_MAX}
                    </span>
                  </div>
                  <input
                    id="cmp-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={TITLE_MAX}
                    required
                    className={adminField}
                  />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-sm font-semibold">
                    <label htmlFor="cmp-desc">Message</label>
                    <span className="text-xs text-muted-foreground">
                      {desc.length}/{DESC_MAX}
                    </span>
                  </div>
                  <textarea
                    id="cmp-desc"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    maxLength={DESC_MAX}
                    rows={3}
                    className={cn(adminField, "h-auto py-3")}
                  />
                </div>
                <p className="rounded-xl bg-violet-50 px-3 py-2 text-xs text-violet-900">
                  Approving puts this banner on the customer home screen for 24 hours. The restaurant is notified either way.
                </p>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={busy}
                    onClick={() => onReject(selected)}
                    className="rounded-full border-destructive/40 text-destructive hover:bg-destructive/10"
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </Button>
                  <Button
                    type="submit"
                    disabled={busy || !title.trim()}
                    className="rounded-full bg-cta px-6 font-bold text-cta-foreground hover:bg-mango-300"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    Approve &amp; go live
                  </Button>
                </div>
              </form>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
