"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CircleAlert,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Wallet,
  Star,
  Zap,
  TrendingUp,
  ShieldCheck,
  Check,
} from "lucide-react";
import riderHero from "@/public/rider-anime.png";

type FormData = {
  email: string;
  password: string;
  remember: boolean;
};

const RiderLogin = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    remember: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const stats = useMemo(
    () => [
      { icon: Wallet, label: "Avg. Daily Payout", value: "₦3,200+" },
      { icon: Zap, label: "Orders Available Now", value: "240+" },
      { icon: Star, label: "Rider Rating Average", value: "4.8 / 5" },
    ],
    [],
  );

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

      const response = await fetch(`${API_BASE_URL}/auth/rider/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("riderToken", data.token);
      router.push("/rider/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* dot grid background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-[1] grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_520px]">
        {/* ── LEFT PANEL ── */}
        <aside className="relative flex min-h-[340px] flex-col overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={riderHero}
              alt="OyaEat rider in Lagos"
              fill
              priority
              sizes="55vw"
              style={{ objectFit: "cover", objectPosition: "center 30%" }}
            />
          </div>
          <div className="absolute inset-0 z-[1] bg-gradient-to-br from-primary/90 via-primary/70 to-primary/40" />

          <div className="relative z-[2] flex h-full flex-col justify-between gap-10 p-7 lg:p-14">
            {/* Logo */}
            <Link href="/" className="inline-flex flex-col gap-1">
              <span className="text-3xl font-bold tracking-tight text-primary-foreground">
                Oya<span className="text-primary-foreground/50">Eat</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-primary-foreground/50">
                Rider Portal
              </span>
            </Link>

            {/* Hero copy */}
            <div className="max-w-md">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3.5 py-1.5">
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-chart-4 shadow-[0_0_0_3px_rgba(74,222,128,0.25)]" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary-foreground/80">
                  Orders live in Lagos, Abuja & PH
                </span>
              </div>

              <h1 className="mb-5 text-[44px] font-bold leading-[1.0] tracking-tight text-primary-foreground sm:text-6xl">
                Welcome
                <br />
                Back,
                <br />
                <span className="italic text-primary-foreground/50">
                  Rider.
                </span>
              </h1>

              <p className="max-w-sm text-base font-light leading-relaxed text-primary-foreground/70">
                Log in to your dashboard, check your earnings, and get back on
                the road.
              </p>

              {/* Stats cards */}
              <div className="mt-11 grid grid-cols-3 gap-3">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 p-4 backdrop-blur-md transition-colors hover:bg-primary-foreground/15 hover:border-primary-foreground/25"
                    >
                      <Icon
                        size={18}
                        strokeWidth={2}
                        className="mb-2.5 text-primary-foreground/65"
                      />
                      <div className="mb-1 text-lg font-bold leading-none text-primary-foreground">
                        {stat.value}
                      </div>
                      <div className="text-[11px] font-bold uppercase tracking-wide text-primary-foreground/50">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leaderboard strip */}
            <div className="flex items-center gap-3 rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 px-4.5 py-3.5 backdrop-blur-sm">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground">
                <TrendingUp size={16} strokeWidth={2.5} />
              </div>
              <div>
                <div className="mb-0.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground/45">
                  Today&apos;s top earner
                </div>
                <div className="text-sm font-bold text-primary-foreground">
                  Emeka, Lagos Island —{" "}
                  <span className="text-primary-foreground/60">
                    ₦14,200 earned
                  </span>
                </div>
              </div>
              <div className="ml-auto whitespace-nowrap rounded-full border border-chart-4/30 bg-chart-4/20 px-2.5 py-1 text-xs font-bold text-chart-4">
                🏆 #1 Today
              </div>
            </div>
          </div>
        </aside>

        {/* ── RIGHT PANEL ── */}
        <section className="flex flex-col justify-center overflow-y-auto border-t border-border bg-card px-6 py-10 lg:border-l lg:border-t-0 lg:px-13 lg:py-14">
          {/* Header */}
          <div className="mb-9">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_0_3px_rgba(26,107,60,0.15)]" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Rider Portal Active
              </span>
            </div>

            <h2 className="mb-2.5 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              Sign in &amp;{" "}
              <span className="italic text-primary">start earning</span>
            </h2>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/rider/register"
                className="border-b-[1.5px] border-border font-bold text-primary transition-colors hover:border-primary"
              >
                Apply to ride →
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-destructive/25 bg-destructive/5 px-4 py-3.5 text-sm leading-relaxed text-destructive">
              <CircleAlert size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                required
                disabled={isLoading}
                autoComplete="email"
                className={`w-full rounded-lg border-[1.5px] bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:font-light placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-[3.5px] focus:ring-primary/10 ${
                  error
                    ? "border-destructive/50 ring-2 ring-destructive/10"
                    : "border-border"
                }`}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Password
                </label>
                <Link
                  href="/rider/forgot-password"
                  className="text-xs font-bold text-primary opacity-80 transition-opacity hover:opacity-100"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                  className={`w-full rounded-lg border-[1.5px] bg-background px-4 py-3 pr-12 text-sm text-foreground outline-none transition-colors placeholder:font-light placeholder:text-muted-foreground focus:border-primary focus:ring-[3.5px] focus:ring-primary/10 ${
                    error
                      ? "border-destructive/50 ring-2 ring-destructive/10"
                      : "border-border"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <label
              className="flex cursor-pointer select-none items-center gap-2.5"
              onClick={() => updateFormData("remember", !formData.remember)}
            >
              <span
                className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[5px] border-[1.5px] transition-colors ${
                  formData.remember
                    ? "border-primary bg-primary"
                    : "border-border bg-background"
                }`}
              >
                {formData.remember && (
                  <Check
                    size={11}
                    strokeWidth={3}
                    className="text-primary-foreground"
                  />
                )}
              </span>
              <span className="text-sm text-muted-foreground">
                Keep me signed in for 30 days
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-bold tracking-wide text-primary-foreground shadow-[0_4px_20px_rgba(26,107,60,0.18)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(26,107,60,0.18)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-7 flex items-center gap-3.5">
            <div className="h-px flex-1 bg-border" />
            <span className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-muted-foreground">
              or
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Action links */}
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <Link
              href="/rider/register"
              className="flex items-center justify-center rounded-lg border-[1.5px] border-transparent bg-secondary px-3 py-3 text-center text-sm font-bold text-primary transition-colors hover:bg-secondary/70"
            >
              New rider? Apply now
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center rounded-lg border-[1.5px] border-border bg-transparent px-3 py-3 text-center text-sm font-bold text-muted-foreground transition-colors hover:border-border hover:bg-secondary hover:text-primary"
            >
              ← Back to Home
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-7 flex items-center justify-center gap-5 border-t border-border pt-5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-muted-foreground">
              <ShieldCheck size={13} className="text-primary/70" />
              Secure login
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-muted-foreground">
              <Zap size={13} className="text-primary/70" />
              Instant access
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-muted-foreground">
              <Star size={13} className="text-primary/70" />
              4.8★ rated platform
            </div>
          </div>

          {/* Footer */}
          <p className="mt-5 text-center text-xs text-muted-foreground">
            By signing in you agree to our{" "}
            <a href="#" className="font-semibold text-primary">
              Terms of Service
            </a>{" "}
            &amp;{" "}
            <a href="#" className="font-semibold text-primary">
              Privacy Policy
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default RiderLogin;
