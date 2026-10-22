"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, Camera, Loader2, ShieldCheck } from "lucide-react";
import { useRider } from "@/components/rider/RiderProvider";
import { ErrorState, PageHeader } from "@/components/shared/states";
import { Badge, Panel, adminField } from "@/components/superadmin/ui";
import { Skeleton } from "@/components/ui/skeleton";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const VEHICLES = ["Motorcycle", "Bicycle", "Car"];

export default function RiderProfilePage() {
  const { data, loading, error, refresh } = useRider();
  const [f, setF] = useState({ firstName: "", lastName: "", phone: "", vehicleType: "Motorcycle", plateNumber: "" });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; firstName?: string }>({});
  const picker = useRef<HTMLInputElement>(null);
  const loaded = useRef(false);

  // fill the form once from the shared dashboard data
  useEffect(() => {
    const p = data?.profile;
    if (!p || loaded.current) return;
    loaded.current = true;
    setF({ firstName: p.firstName || "", lastName: p.lastName || "", phone: p.phone || "", vehicleType: p.vehicleType || "Motorcycle", plateNumber: p.plateNumber || "" });
    if (p.avatarUrl) setPreview(p.avatarUrl.startsWith("http") ? p.avatarUrl : `${API}${p.avatarUrl}`);
  }, [data]);

  if (loading) return <div className="space-y-4" aria-busy="true"><Skeleton className="h-32 rounded-3xl bg-muted" /><Skeleton className="h-72 rounded-3xl bg-muted" /></div>;
  if (error && !data) return <ErrorState title="We couldn't load your profile" message={error} onRetry={refresh} />;

  const verified = !!data?.profile?.isVerified;
  const initials = `${f.firstName[0] || ""}${f.lastName[0] || ""}`.toUpperCase() || "R";
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const v = k === "phone" ? e.target.value.replace(/\D/g, "").slice(0, 11) : e.target.value;
    setF((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!f.firstName.trim()) errs.firstName = "Enter your first name.";
    if (f.phone.length !== 11) errs.phone = "Phone number must be 11 digits.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      const body = new FormData();
      Object.entries(f).forEach(([k, v]) => body.append(k, v));
      if (file) body.append("avatar", file);
      const res = await fetch(`${API}/rider/profile/update`, { method: "PUT", headers: { Authorization: `Bearer ${localStorage.getItem("riderToken")}` }, body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || "Couldn't save your profile.");
      toast.success("Profile saved");
      setFile(null);
      await refresh();
    } catch (err: any) {
      toast.error(err?.message || "Couldn't save your profile.");
    } finally {
      setSaving(false);
    }
  };

  const label = "mb-1.5 block text-sm font-bold";
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader title="Profile" action={<Badge tone={verified ? "success" : "mango"}>{verified ? <><BadgeCheck className="mr-1 h-3.5 w-3.5" />Verified</> : <><ShieldCheck className="mr-1 h-3.5 w-3.5" />Awaiting verification</>}</Badge>} />

      <form onSubmit={save} noValidate className="space-y-5">
        <Panel>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => picker.current?.click()} aria-label="Change profile photo" className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-primary text-xl font-extrabold text-primary-foreground">
              {preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center">{initials}</span>}
              <span className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100"><Camera className="h-5 w-5 text-white" /></span>
            </button>
            <input ref={picker} type="file" accept="image/*" className="sr-only" tabIndex={-1} onChange={(e) => { const x = e.target.files?.[0]; if (x) { setFile(x); setPreview(URL.createObjectURL(x)); } }} />
            <div>
              <p className="font-bold">Profile photo</p>
              <p className="text-sm text-muted-foreground">Customers see this when you deliver. Tap to change.</p>
            </div>
          </div>
        </Panel>

        <Panel title="Your details">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fn" className={label}>First name</label>
              <input id="fn" value={f.firstName} onChange={set("firstName")} autoComplete="given-name" aria-invalid={!!errors.firstName} className={adminField} />
              {errors.firstName && <p role="alert" className="mt-1.5 text-sm font-semibold text-destructive">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="ln" className={label}>Last name</label>
              <input id="ln" value={f.lastName} onChange={set("lastName")} autoComplete="family-name" className={adminField} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="ph" className={label}>Phone number</label>
              <input id="ph" type="tel" inputMode="numeric" value={f.phone} onChange={set("phone")} placeholder="08012345678" autoComplete="tel" aria-invalid={!!errors.phone} className={adminField} />
              {errors.phone ? <p role="alert" className="mt-1.5 text-sm font-semibold text-destructive">{errors.phone}</p> : <p className="mt-1.5 text-xs text-muted-foreground">{f.phone.length}/11 digits</p>}
            </div>
          </div>
        </Panel>

        <Panel title="Vehicle">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="vt" className={label}>Type</label>
              <select id="vt" value={f.vehicleType} onChange={set("vehicleType")} className={adminField}>
                {VEHICLES.map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="pl" className={label}>Plate number</label>
              <input id="pl" value={f.plateNumber} onChange={set("plateNumber")} placeholder="e.g. KJA-123XD" className={adminField} />
            </div>
          </div>
        </Panel>

        <div className="sticky bottom-20 z-20 lg:static">
          <button type="submit" disabled={saving} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-cta text-base font-extrabold text-cta-foreground shadow-pop transition hover:bg-mango-300 active:scale-[0.98] disabled:opacity-60 sm:w-auto sm:px-10">
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
