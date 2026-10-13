"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import RecoveryShell, { loginFor, recoveryField } from "@/components/auth/RecoveryShell";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function Form() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";
  const role = params.get("role");
  const login = loginFor(role);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <RecoveryShell title="This link isn't valid" subtitle="The reset link is missing its code. Request a new one and use the link from the latest email." backHref={login}>
        <Link href={`/forgot-password${role ? `?role=${role}` : ""}`} className="flex h-12 items-center justify-center rounded-full bg-primary text-base font-extrabold text-primary-foreground hover:bg-violet-800">
          Request a new link
        </Link>
      </RecoveryShell>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return setError("Use at least 6 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "This link is invalid or has expired.");
      router.replace(`${login}?reset=1`);
    } catch (err) {
      setError(err instanceof TypeError ? "We couldn't reach OyaEat. Check your connection and try again." : err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <RecoveryShell title="Choose a new password" subtitle="You'll be asked to log in with it straight after." backHref={login}>
      <form onSubmit={submit} noValidate className="space-y-4">
        {error && (
          <div role="alert" className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
            {error}{" "}
            {/expired|invalid/i.test(error) && (
              <Link href={`/forgot-password${role ? `?role=${role}` : ""}`} className="underline">Request a new link</Link>
            )}
          </div>
        )}
        <div>
          <label htmlFor="pw" className="mb-1.5 block text-sm font-semibold">New password</label>
          <div className="relative">
            <input id="pw" type={show ? "text" : "password"} autoComplete="new-password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} className={`${recoveryField} pr-12`} disabled={loading} />
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-violet-50">
              {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="pw2" className="mb-1.5 block text-sm font-semibold">Confirm password</label>
          <input id="pw2" type={show ? "text" : "password"} autoComplete="new-password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setError(""); }} className={recoveryField} disabled={loading} />
        </div>
        <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-extrabold text-primary-foreground transition hover:bg-violet-800 disabled:opacity-60">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update password"}
        </button>
      </form>
    </RecoveryShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <Form />
    </Suspense>
  );
}
