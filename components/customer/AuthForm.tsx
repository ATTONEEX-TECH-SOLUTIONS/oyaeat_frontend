"use client";

import Logo from "@/components/brand/Logo";
import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { api } from "@/lib/customer";

type Mode = "login" | "signup";

const FIELD =
  "h-12 w-full rounded-xl border border-input bg-card px-4 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-ring focus:ring-4 focus:ring-ring/15 disabled:opacity-60";
const LABEL = "mb-1.5 block text-sm font-bold";

// Only allow same-site relative redirects.
const safeNext = (next: string | null) =>
  next && next.startsWith("/customer") && !next.startsWith("//") ? next : "/customer";

function Form({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [f, setF] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", emailOrPhone: "" });
  const set = (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [e.target.name]: e.target.value });
  const signup = mode === "signup";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (signup) {
      if (!f.firstName || !f.lastName || !f.email || !f.phone || !f.password)
        return setError("Please fill in every field.");
      if (f.password.length < 8) return setError("Use a password with at least 8 characters.");
    } else if (!f.emailOrPhone || !f.password) {
      return setError("Enter your email or phone and your password.");
    }
    setLoading(true);
    try {
      const body = signup
        ? { firstName: f.firstName, lastName: f.lastName, email: f.email, phone: f.phone, password: f.password }
        : { emailOrPhone: f.emailOrPhone, password: f.password };
      const json = await api(`/customer/auth/${signup ? "register" : "login"}`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      localStorage.setItem("customer_token", json.data.token);
      localStorage.setItem("customer_user", JSON.stringify(json.data.user));
      router.push(next);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const other = signup ? "/customer/login" : "/customer/signup";
  const otherHref = next !== "/customer" ? `${other}?next=${encodeURIComponent(next)}` : other;

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {error && (
        <div role="alert" className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
          {error}
        </div>
      )}

      {signup ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className={LABEL}>First name</label>
              <input id="firstName" name="firstName" autoComplete="given-name" value={f.firstName} onChange={set} className={FIELD} disabled={loading} />
            </div>
            <div>
              <label htmlFor="lastName" className={LABEL}>Last name</label>
              <input id="lastName" name="lastName" autoComplete="family-name" value={f.lastName} onChange={set} className={FIELD} disabled={loading} />
            </div>
          </div>
          <div>
            <label htmlFor="email" className={LABEL}>Email</label>
            <input id="email" name="email" type="email" autoComplete="email" value={f.email} onChange={set} placeholder="you@example.com" className={FIELD} disabled={loading} />
          </div>
          <div>
            <label htmlFor="phone" className={LABEL}>Phone</label>
            <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={set} placeholder="0803 000 0000" className={FIELD} disabled={loading} />
          </div>
        </>
      ) : (
        <div>
          <label htmlFor="emailOrPhone" className={LABEL}>Email or phone</label>
          <input id="emailOrPhone" name="emailOrPhone" autoComplete="username" value={f.emailOrPhone} onChange={set} className={FIELD} disabled={loading} />
        </div>
      )}

      <div>
        <label htmlFor="password" className={LABEL}>Password</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete={signup ? "new-password" : "current-password"}
            value={f.password}
            onChange={set}
            placeholder={signup ? "At least 8 characters" : undefined}
            className={`${FIELD} pr-12`}
            disabled={loading}
          />
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-violet-50">
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {!signup && (
          <div className="mt-2 text-right">
            <Link href="/forgot-password?role=customer" className="text-sm font-bold text-primary hover:underline">Forgot password?</Link>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-extrabold text-primary-foreground shadow-sm transition hover:bg-violet-800 active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : signup ? "Create account" : "Log in"}
      </button>

      <p className="pt-2 text-center text-sm text-muted-foreground">
        {signup ? "Already have an account?" : "New to OyaEat?"}{" "}
        <Link href={otherHref} className="font-bold text-primary hover:underline">
          {signup ? "Log in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}

export default function AuthScreen({ mode }: { mode: Mode }) {
  const signup = mode === "signup";
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside className="lp-doodles relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex">
        <Link href="/customer" className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/20">
          <ArrowLeft className="h-4 w-4" /> Back to restaurants
        </Link>
        <div className="max-w-md">
          <Logo variant="white" className="h-28 w-auto" />
          <h2 className="font-display mt-6 text-4xl font-extrabold leading-tight">
            {signup ? "Your next favourite meal is a few taps away." : "Good food, delivered hot."}
          </h2>
          <p className="mt-3 text-lg text-violet-100">Local kitchens, real riders, live tracking from stove to door.</p>
        </div>
        <span className="h-1.5 w-24 rounded-full bg-cta" />
      </aside>

      {/* Form */}
      <main className="flex flex-col justify-center px-5 py-10 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link href="/customer" className="mb-8 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-primary hover:bg-violet-50 lg:hidden">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <Logo className="mb-6 h-12 lg:hidden" />
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {signup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mb-8 mt-2 text-muted-foreground">
            {signup ? "Order in minutes and track every delivery." : "Log in to order and track deliveries."}
          </p>
          <Suspense>
            <Form mode={mode} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
