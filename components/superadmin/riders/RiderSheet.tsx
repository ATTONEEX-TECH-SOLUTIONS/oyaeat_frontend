"use client";

import { useEffect, useState } from "react";
import { Check, ExternalLink, FileText, Loader2, Pencil, Power, Trash2, X } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge, adminField } from "@/components/superadmin/ui";
import { documentUrl, type AdminRider, type RiderStatus } from "@/lib/api/riders";
import { STATUS_TONE } from "@/components/superadmin/riders/RiderRow";

export type RiderAction = "verify" | "activate" | "deactivate" | "reactivate" | "reject";

const VEHICLES = ["motorcycle", "bicycle", "car"];

/** Everything about one rider: documents, editable details, and the status actions that make sense for them. */
export default function RiderSheet({
  rider,
  busy,
  onClose,
  onAction,
  onSave,
}: {
  rider: AdminRider | null;
  busy: boolean;
  onClose: () => void;
  onAction: (a: RiderAction, r: AdminRider) => void;
  onSave: (r: AdminRider, edits: { firstName: string; lastName: string; phone: string; vehicleType: string; plateNumber: string }) => Promise<boolean>;
}) {
  const [editing, setEditing] = useState(false);
  const [f, setF] = useState({ firstName: "", lastName: "", phone: "", vehicleType: "motorcycle", plateNumber: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditing(false);
    if (rider) {
      setF({
        firstName: rider.firstName || "",
        lastName: rider.lastName || "",
        phone: rider.phone || "",
        vehicleType: (rider.riderProfile?.vehicleType || "motorcycle").toLowerCase(),
        plateNumber: rider.riderProfile?.plateNumber || "",
      });
    }
  }, [rider?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const profile = rider?.riderProfile || {};
  const doc = documentUrl(profile.idDocumentUrl);
  const status = rider?.status as RiderStatus | undefined;
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF((s) => ({ ...s, [k]: e.target.value }));

  const save = async () => {
    if (!rider) return;
    setSaving(true);
    const ok = await onSave(rider, f);
    setSaving(false);
    if (ok) setEditing(false);
  };

  return (
    <Sheet open={!!rider} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {rider && (
          <>
            <SheetHeader>
              <SheetTitle className="font-display text-xl font-extrabold">{rider.firstName} {rider.lastName}</SheetTitle>
              <SheetDescription asChild>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={STATUS_TONE[rider.status] || "neutral"}>{rider.status}</Badge>
                  {rider.isOnline && <Badge tone="success">Online now</Badge>}
                  <span className="text-xs text-muted-foreground">{rider.deliveryCount ?? 0} deliveries</span>
                </div>
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 px-4 pb-6">
              <section>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Details</h3>
                  {!editing && (
                    <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                  )}
                </div>
                {editing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input aria-label="First name" value={f.firstName} onChange={set("firstName")} className={adminField} placeholder="First name" />
                      <input aria-label="Last name" value={f.lastName} onChange={set("lastName")} className={adminField} placeholder="Last name" />
                    </div>
                    <input aria-label="Phone" value={f.phone} onChange={set("phone")} className={adminField} placeholder="Phone" inputMode="tel" />
                    <div className="grid grid-cols-2 gap-3">
                      <select aria-label="Vehicle" value={f.vehicleType} onChange={set("vehicleType")} className={`${adminField} capitalize`}>
                        {[...new Set([...VEHICLES, f.vehicleType])].map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                      <input aria-label="Plate number" value={f.plateNumber} onChange={set("plateNumber")} className={adminField} placeholder="Plate number" />
                    </div>
                    <p className="text-xs text-muted-foreground">Email can&apos;t be changed here.</p>
                    <div className="flex gap-2">
                      <Button onClick={save} disabled={saving || !f.firstName.trim() || !f.lastName.trim()} className="rounded-full">
                        {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
                      </Button>
                      <Button variant="ghost" onClick={() => setEditing(false)} disabled={saving} className="rounded-full">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <dl className="divide-y divide-border rounded-2xl border border-border text-sm">
                    {[
                      ["Email", rider.email],
                      ["Phone", rider.phone],
                      ["Vehicle", (profile.vehicleType || "—") as string],
                      ["Plate", profile.plateNumber || "—"],
                      ["Joined", rider.createdAt ? new Date(rider.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 px-4 py-2.5">
                        <dt className="text-muted-foreground">{k}</dt>
                        <dd className="min-w-0 break-all text-right font-semibold">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </section>

              <section>
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">Identity document</h3>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border p-4">
                  <span className="flex min-w-0 items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate">{doc ? decodeURIComponent(doc.split("/").pop() || "ID document") : "Nothing uploaded"}</span>
                  </span>
                  {doc ? (
                    <a href={doc} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary hover:underline">
                      View <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <Badge tone="danger">Missing</Badge>
                  )}
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Actions</h3>
                {status === "pending" && (
                  <>
                    {!doc && <p className="rounded-xl bg-cream px-3 py-2 text-sm text-mango-800">Can&apos;t verify until an identity document is uploaded.</p>}
                    <Button disabled={busy || !doc} onClick={() => onAction("verify", rider)} className="w-full rounded-full bg-cta font-bold text-cta-foreground hover:bg-mango-300">
                      <Check className="h-4 w-4" /> Verify documents
                    </Button>
                    <Button disabled={busy} variant="outline" onClick={() => onAction("reject", rider)} className="w-full rounded-full border-destructive/40 text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" /> Reject &amp; delete application
                    </Button>
                  </>
                )}
                {status === "verified" && (
                  <Button disabled={busy} onClick={() => onAction("activate", rider)} className="w-full rounded-full bg-cta font-bold text-cta-foreground hover:bg-mango-300">
                    <Check className="h-4 w-4" /> Activate account
                  </Button>
                )}
                {(status === "verified" || status === "active") && (
                  <Button disabled={busy} variant="outline" onClick={() => onAction("deactivate", rider)} className="w-full rounded-full border-destructive/40 text-destructive hover:bg-destructive/10">
                    <Power className="h-4 w-4" /> Deactivate account
                  </Button>
                )}
                {status === "inactive" && (
                  <Button disabled={busy} onClick={() => onAction("reactivate", rider)} className="w-full rounded-full bg-cta font-bold text-cta-foreground hover:bg-mango-300">
                    <Check className="h-4 w-4" /> Reactivate account
                  </Button>
                )}
              </section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
