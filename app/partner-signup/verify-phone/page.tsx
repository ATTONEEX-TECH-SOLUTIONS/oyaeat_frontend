"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import FlowShell from "@/components/partner-signup/FlowShell";
import { FormError, PrimaryButton } from "@/components/partner-signup/ui";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const LEN = 6;
const COOLDOWN = 30;

export default function VerifyPhonePage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState("");
  const [code, setCode] = useState<string[]>(Array(LEN).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [wait, setWait] = useState(COOLDOWN);
  const [resending, setResending] = useState(false);
  const [notice, setNotice] = useState("");
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("partnerSignupData");
      if (raw) {
        const d = JSON.parse(raw);
        setPhone(d.phone || "");
        setUserId(d.userId || "");
      }
    } catch {}
    setReady(true);
    refs.current[0]?.focus();
  }, []);

  // The code was just sent at sign-up, so the first resend unlocks after a short wait.
  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const resend = async () => {
    if (wait > 0 || resending || !userId) return;
    setResending(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch(`${API}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 429) setWait(Number(data.retryAfter) || COOLDOWN);
      if (!res.ok) throw new Error(data.message || "Couldn't send a new code.");
      setNotice(`A new code was sent to ${phone || "your phone"}.`);
      setCode(Array(LEN).fill(""));
      refs.current[0]?.focus();
      setWait(COOLDOWN);
    } catch (err) {
      setError(err instanceof TypeError ? "We couldn't reach OyaEat. Check your connection and try again." : err instanceof Error ? err.message : "Couldn't send a new code.");
    } finally {
      setResending(false);
    }
  };

  const setDigit = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    setCode((c) => c.map((x, idx) => (idx === i ? digit : x)));
    if (error) setError("");
    if (digit && i < LEN - 1) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < LEN - 1) refs.current[i + 1]?.focus();
  };

  // Pasting a full code fills every box.
  const onPaste = (e: React.ClipboardEvent) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LEN);
    if (!digits) return;
    e.preventDefault();
    setCode(Array.from({ length: LEN }, (_, i) => digits[i] || ""));
    refs.current[Math.min(digits.length, LEN - 1)]?.focus();
  };

  const complete = code.every(Boolean);

  const verify = async () => {
    if (!complete || verifying) return;
    setVerifying(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/verify-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp: code.join("") }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "That code is invalid or has expired.");
      if (data.token) localStorage.setItem("authToken", data.token);
      router.push("/partner-signup/welcome");
    } catch (err) {
      setError(err instanceof TypeError ? "We couldn't reach OyaEat. Check your connection and try again." : err instanceof Error ? err.message : "Verification failed.");
      setCode(Array(LEN).fill(""));
      refs.current[0]?.focus();
      setVerifying(false);
    }
  };

  // No session data means they skipped the signup step.
  if (ready && !userId) {
    return (
      <FlowShell step={2} title="Let's start with your account" subtitle="We couldn't find your sign-up details, so we can't verify a phone number yet.">
        <PrimaryButton onClick={() => router.push("/partner-signup")} className="w-full sm:w-auto">Go to sign up</PrimaryButton>
      </FlowShell>
    );
  }

  return (
    <FlowShell
      step={2}
      eyebrow="Step 2 of 4"
      title="Verify your phone number"
      subtitle={phone ? `Enter the 6-digit code we sent to ${phone}.` : "Enter the 6-digit code we sent to your phone."}
    >
      <div className="space-y-5">
        <FormError>{error}</FormError>
        {notice && <p role="status" className="rounded-2xl bg-success-soft px-4 py-3 text-sm font-semibold text-success">{notice}</p>}

        <div className="flex justify-between gap-2 sm:justify-start sm:gap-3" onPaste={onPaste} role="group" aria-label="Verification code">
          {code.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              aria-label={`Digit ${i + 1}`}
              disabled={verifying}
              className={cn(
                "h-14 w-full max-w-14 rounded-xl border-2 bg-card text-center text-2xl font-extrabold outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/15 disabled:opacity-60 sm:h-16",
                d ? "border-primary" : "border-input",
              )}
            />
          ))}
        </div>

        <PrimaryButton onClick={verify} disabled={!complete || verifying} className="w-full sm:w-auto">
          {verifying ? <><Loader2 className="h-5 w-5 animate-spin" /> Verifying…</> : "Verify and continue"}
        </PrimaryButton>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-primary" /> Didn&apos;t get a code?</span>
          <button type="button" onClick={resend} disabled={wait > 0 || resending} className="font-bold text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline">
            {resending ? "Sending…" : wait > 0 ? `Resend in ${wait}s` : "Resend code"}
          </button>
        </div>
      </div>
    </FlowShell>
  );
}
