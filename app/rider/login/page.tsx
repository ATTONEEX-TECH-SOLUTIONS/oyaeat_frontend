"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import RiderAuthShell from "@/components/rider/RiderAuthShell";
import { Field, FormError, PrimaryButton, fieldClass } from "@/components/partner-signup/ui";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function LoginForm() {
  const router = useRouter();
  const registered = useSearchParams().get("registered") === "true";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return setError("Enter your email and password.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/rider/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Login failed. Check your details and try again.");
      localStorage.setItem("riderToken", data.token);
      router.push("/rider/dashboard");
    } catch (err) {
      setError(err instanceof TypeError ? "We couldn't reach OyaEat. Check your connection and try again." : err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {registered && (
        <div role="status" className="flex items-start gap-3 rounded-xl border border-success/30 bg-success-soft px-4 py-3 text-sm font-semibold text-success">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> Application received. You can log in while we review your documents.
        </div>
      )}
      <FormError>{error}</FormError>
      <Field id="email" label="Email">
        <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} className={fieldClass} disabled={loading} />
      </Field>
      <Field id="password" label="Password">
        <div className="relative">
          <input id="password" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} className={`${fieldClass} pr-12`} disabled={loading} />
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-violet-50">
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </Field>
      <PrimaryButton type="submit" disabled={loading} className="w-full">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Log in"}
      </PrimaryButton>
    </form>
  );
}

export default function RiderLoginPage() {
  return (
    <RiderAuthShell title="Welcome back" subtitle="Log in to start receiving deliveries." footer={<>New rider? <Link href="/rider/register" className="font-bold text-primary hover:underline">Apply to ride</Link></>}>
      <Suspense>
        <LoginForm />
      </Suspense>
    </RiderAuthShell>
  );
}
