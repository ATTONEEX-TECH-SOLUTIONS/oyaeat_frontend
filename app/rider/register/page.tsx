"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, FileCheck2, Loader2, Upload, X } from "lucide-react";
import RiderAuthShell from "@/components/rider/RiderAuthShell";
import { Field, FormError, PrimaryButton, fieldClass } from "@/components/partner-signup/ui";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const MAX = 5 * 1024 * 1024;
const OK = ["application/pdf", "image/jpeg", "image/png"];

type F = { firstName: string; lastName: string; email: string; phone: string; vehicleType: string; plateNumber: string; password: string };
type Errs = Partial<Record<keyof F | "idFile", string>>;

export default function RiderRegisterPage() {
  const router = useRouter();
  const [f, setF] = useState<F>({ firstName: "", lastName: "", email: "", phone: "", vehicleType: "", plateNumber: "", password: "" });
  const [idFile, setIdFile] = useState<File | null>(null);
  const [errs, setErrs] = useState<Errs>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const picker = useRef<HTMLInputElement>(null);

  const set = (k: keyof F) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const v = k === "phone" ? e.target.value.replace(/\D/g, "").slice(0, 11) : e.target.value;
    setF((p) => ({ ...p, [k]: v }));
    setErrs((p) => ({ ...p, [k]: undefined }));
    setFormError("");
  };

  const pick = (file: File | null) => {
    if (!file) return;
    if (file.type && !OK.includes(file.type)) return setErrs((p) => ({ ...p, idFile: "Use a PDF, JPG or PNG file." }));
    if (file.size > MAX) return setErrs((p) => ({ ...p, idFile: "This file is over the 5MB limit." }));
    setIdFile(file);
    setErrs((p) => ({ ...p, idFile: undefined }));
  };

  const validate = (): Errs => {
    const e: Errs = {};
    if (!f.firstName.trim()) e.firstName = "Enter your first name";
    if (!f.lastName.trim()) e.lastName = "Enter your last name";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address";
    if (f.phone.length !== 11) e.phone = "Phone number must be 11 digits";
    if (!f.vehicleType) e.vehicleType = "Choose your vehicle";
    if (!f.plateNumber.trim()) e.plateNumber = "Enter your plate number";
    if (f.password.length < 8) e.password = "Use at least 8 characters";
    if (!idFile) e.idFile = "Upload a valid ID document";
    return e;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const v = validate();
    setErrs(v);
    if (Object.keys(v).length) return;
    setLoading(true);
    setFormError("");
    try {
      const body = new FormData();
      Object.entries(f).forEach(([k, val]) => body.append(k, val));
      body.append("idDocument", idFile!);
      const res = await fetch(`${API}/auth/rider/register`, { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Registration failed. Please try again.");
      router.push("/rider/login?registered=true");
    } catch (err) {
      setFormError(err instanceof TypeError ? "We couldn't reach OyaEat. Check your connection and try again." : err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <RiderAuthShell title="Apply to ride" subtitle="Tell us about you and your vehicle. We'll review your ID and get you started." footer={<>Already a rider? <Link href="/rider/login" className="font-bold text-primary hover:underline">Log in</Link></>}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <FormError>{formError}</FormError>
        <div className="grid grid-cols-2 gap-3">
          <Field id="firstName" label="First name" error={errs.firstName}><input id="firstName" autoComplete="given-name" value={f.firstName} onChange={set("firstName")} className={fieldClass} aria-invalid={!!errs.firstName} disabled={loading} /></Field>
          <Field id="lastName" label="Last name" error={errs.lastName}><input id="lastName" autoComplete="family-name" value={f.lastName} onChange={set("lastName")} className={fieldClass} aria-invalid={!!errs.lastName} disabled={loading} /></Field>
        </div>
        <Field id="email" label="Email" error={errs.email}><input id="email" type="email" autoComplete="email" value={f.email} onChange={set("email")} className={fieldClass} aria-invalid={!!errs.email} disabled={loading} /></Field>
        <Field id="phone" label="Phone number" hint={`${f.phone.length}/11 digits`} error={errs.phone}><input id="phone" type="tel" inputMode="numeric" autoComplete="tel" value={f.phone} onChange={set("phone")} placeholder="08012345678" className={fieldClass} aria-invalid={!!errs.phone} disabled={loading} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field id="vehicleType" label="Vehicle" error={errs.vehicleType}>
            <select id="vehicleType" value={f.vehicleType} onChange={set("vehicleType")} className={fieldClass} aria-invalid={!!errs.vehicleType} disabled={loading}>
              <option value="">Select</option>
              <option value="motorcycle">Motorcycle / Okada</option>
              <option value="bicycle">Bicycle</option>
              <option value="car">Car</option>
            </select>
          </Field>
          <Field id="plateNumber" label="Plate number" error={errs.plateNumber}><input id="plateNumber" value={f.plateNumber} onChange={set("plateNumber")} placeholder="KJA-123XD" className={fieldClass} aria-invalid={!!errs.plateNumber} disabled={loading} /></Field>
        </div>

        <Field id="idDoc" label="ID document" hint="NIN, driver's licence or international passport. PDF, JPG or PNG, up to 5MB." error={errs.idFile}>
          <input ref={picker} id="idDoc" type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" disabled={loading} onChange={(e) => { pick(e.target.files?.[0] || null); e.target.value = ""; }} />
          {idFile ? (
            <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-violet-50 p-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"><FileCheck2 className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1 truncate text-sm font-bold">{idFile.name}</span>
              <button type="button" onClick={() => setIdFile(null)} aria-label="Remove file" className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><X className="h-4 w-4" /></button>
            </div>
          ) : (
            <button type="button" onClick={() => picker.current?.click()} disabled={loading} className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-input text-sm font-bold text-primary transition hover:bg-violet-50">
              <Upload className="h-4 w-4" /> Choose a file
            </button>
          )}
        </Field>

        <Field id="password" label="Password" hint="At least 8 characters." error={errs.password}>
          <div className="relative">
            <input id="password" type={show ? "text" : "password"} autoComplete="new-password" value={f.password} onChange={set("password")} className={`${fieldClass} pr-12`} aria-invalid={!!errs.password} disabled={loading} />
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-violet-50">{show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
          </div>
        </Field>

        <PrimaryButton type="submit" disabled={loading} className="w-full">{loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Submitting…</> : "Submit application"}</PrimaryButton>
      </form>
    </RiderAuthShell>
  );
}
