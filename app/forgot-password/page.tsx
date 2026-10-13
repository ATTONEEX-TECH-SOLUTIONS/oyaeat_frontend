"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import RecoveryShell, { loginFor, recoveryField } from "@/components/auth/RecoveryShell";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function Form() {
  const role = useSearchParams().get("role");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return setError("Enter the email you signed up with.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Something went wrong. Please try again.");
      setSent(true);
    } catch (err) {
      setError(err instanceof TypeError ? "We couldn't reach OyaEat. Check your connection and try again." : err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RecoveryShell
      title={sent ? "Check your email" : "Forgot your password?"}
      subtitle={sent ? undefined : "Enter your email and we'll send you a link to choose a new one."}
      backHref={loginFor(role)}
    >
      {sent ? (
        <div role="status" className="flex items-start gap-3 rounded-2xl bg-success-soft p-4 text-sm text-success">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            If <b>{email}</b> is registered, a reset link is on its way. It works for 30 minutes. Check your spam folder if you don&apos;t see it.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          {error && (
            <div role="alert" className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">Email</label>
            <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} className={recoveryField} disabled={loading} placeholder="you@example.com" />
          </div>
          <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-extrabold text-primary-foreground transition hover:bg-violet-800 disabled:opacity-60">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send reset link"}
          </button>
        </form>
      )}
    </RecoveryShell>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <Form />
    </Suspense>
  );
}
