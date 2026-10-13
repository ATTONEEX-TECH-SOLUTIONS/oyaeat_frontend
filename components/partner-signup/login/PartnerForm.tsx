"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Field, FormError, PrimaryButton, fieldClass } from "../ui";

const TYPES = [
  ["dine_in_delivery", "Dine-in restaurant (with delivery)"],
  ["cloud_kitchen", "Cloud / ghost kitchen (delivery only)"],
  ["fast_food_takeaway", "Fast food & takeaway"],
  ["home_chef", "Home chef / home-based kitchen"],
  ["catering", "Catering service (bulk delivery)"],
  ["food_truck", "Food truck"],
] as const;

type Errors = Partial<Record<"firstName" | "lastName" | "businessType" | "email" | "phone" | "password", string>>;

export default function PartnerForm() {
  const router = useRouter();
  const [f, setF] = useState({ firstName: "", lastName: "", businessType: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
    if (formError) setFormError("");
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!f.firstName.trim()) e.firstName = "Enter your first name";
    if (!f.lastName.trim()) e.lastName = "Enter your last name";
    if (!f.businessType) e.businessType = "Choose your business type";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address";
    if (f.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a phone number we can verify";
    if (f.password.length < 8) e.password = "Use at least 8 characters";
    return e;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    setFormError("");
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
      const res = await fetch(`${base}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "We couldn't create your account. Please try again.");

      const token = data.token || data.authToken || data.data?.token || data.user?.token;
      if (token) localStorage.setItem("authToken", token);

      // Never keep the password: later steps only need these fields.
      const { password: _omit, ...safe } = f;
      sessionStorage.setItem(
        "partnerSignupData",
        JSON.stringify({ ...safe, userId: data.userId || data.id || data.user?.id || data.data?.userId }),
      );
      router.push("/partner-signup/verify-phone");
    } catch (err) {
      setFormError(
        err instanceof TypeError
          ? "We couldn't reach OyaEat. Check your connection and try again."
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <FormError>{formError}</FormError>

      <div className="grid grid-cols-2 gap-3">
        <Field id="firstName" label="First name" error={errors.firstName}>
          <input id="firstName" autoComplete="given-name" value={f.firstName} onChange={set("firstName")} className={fieldClass} aria-invalid={!!errors.firstName} disabled={loading} />
        </Field>
        <Field id="lastName" label="Last name" error={errors.lastName}>
          <input id="lastName" autoComplete="family-name" value={f.lastName} onChange={set("lastName")} className={fieldClass} aria-invalid={!!errors.lastName} disabled={loading} />
        </Field>
      </div>

      <Field id="businessType" label="Business type" error={errors.businessType}>
        <select id="businessType" value={f.businessType} onChange={set("businessType")} className={fieldClass} aria-invalid={!!errors.businessType} disabled={loading}>
          <option value="">Select your business type</option>
          {TYPES.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </Field>

      <Field id="email" label="Email" error={errors.email}>
        <input id="email" type="email" autoComplete="email" value={f.email} onChange={set("email")} placeholder="you@business.com" className={fieldClass} aria-invalid={!!errors.email} disabled={loading} />
      </Field>

      <Field id="phone" label="Phone number" hint="We'll text you a verification code." error={errors.phone}>
        <input id="phone" type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={set("phone")} placeholder="0803 000 0000" className={fieldClass} aria-invalid={!!errors.phone} disabled={loading} />
      </Field>

      <Field id="password" label="Password" hint="At least 8 characters." error={errors.password}>
        <div className="relative">
          <input id="password" type={show ? "text" : "password"} autoComplete="new-password" value={f.password} onChange={set("password")} className={`${fieldClass} pr-12`} aria-invalid={!!errors.password} disabled={loading} />
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-violet-50">
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </Field>

      <PrimaryButton type="submit" disabled={loading} className="w-full">
        {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Creating your account…</> : "Create my partner account"}
      </PrimaryButton>

      <p className="text-center text-xs text-muted-foreground">By continuing you agree to OyaEat&apos;s Terms of Service and Privacy Policy.</p>
    </form>
  );
}
