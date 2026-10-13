"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const C = {
  brand: "#3b0f7a",
  brandMid: "#6d28d9",
  brandLight: "#8b5cf6",
  bg: "#fffbef",
  white: "#FFFFFF",
  textDark: "#111827",
  textMuted: "#6b6480",
  border: "#e6e0f3",
  error: "#c8372d",
};

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ── Admin illustration ────────────────────────────────────────────────────────
function IllustrationPanel() {
  return (
    <div className="lp-doodles relative hidden min-h-screen flex-col justify-between p-10 text-white lg:flex">
      <div>
        <p className="font-display text-3xl font-extrabold tracking-tight">oyaeat</p>
        <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-violet-200">Super admin</p>
      </div>
      <div className="max-w-md">
        <h2 className="font-display text-4xl font-extrabold leading-tight">Full control, total visibility.</h2>
        <p className="mt-3 text-lg text-violet-100">Approve vendors, watch the fleet and keep every order moving.</p>
      </div>
      <span className="h-1.5 w-24 rounded-full bg-cta" />
    </div>
  );
}

// ── Animated field ────────────────────────────────────────────────────────────
function Field({
  label,
  type,
  placeholder,
  icon: Icon,
  error,
  value,
  onChange,
  onBlur,
}: {
  label: string;
  type: string;
  placeholder: string;
  icon: React.ElementType;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="mb-4">
      <label
        className="block text-xs font-bold uppercase tracking-widest mb-2"
        style={{ color: C.textDark }}
      >
        {label}
      </label>
      <div
        className="flex items-center gap-3 rounded-xl border transition-all duration-200 overflow-hidden cursor-text"
        style={{
          borderColor: error ? C.error : focused ? C.brandMid : C.border,
          backgroundColor: C.white,
          boxShadow: focused
            ? `0 0 0 3px ${error ? C.error : C.brandMid}18`
            : undefined,
        }}
        onClick={() => ref.current?.focus()}
      >
        <div className="pl-4">
          <Icon
            className="h-4 w-4 flex-shrink-0"
            style={{
              color: error ? C.error : focused ? C.brandMid : C.textMuted,
            }}
          />
        </div>
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            onBlur();
            setFocused(false);
          }}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          className="flex-1 py-3 pr-4 text-sm bg-transparent outline-none placeholder-gray-400"
          style={{ color: C.textDark }}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium" style={{ color: C.error }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminLoginPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setError(null);
    setSubmitting(true);
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";
    try {
      const res = await fetch(`${base}/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        setError("Invalid credentials. Please try again.");
        return;
      }

      const data = await res.json();

      if (data?.token) {
                // Admin has its own key so it never overwrites a vendor session.
        localStorage.setItem("admin_token", data.token);
      }

      if (data?.admin) {
        localStorage.setItem("admin_user", JSON.stringify(data.admin));
      }

      router.replace("/superadmin/dashboard");
    } catch (err: any) {
      console.error("JWT LOGIN ERROR:", err.message);
      setError(
        "A server or database runtime connection issue was encountered.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const {
    handleSubmit,
    formState: { errors },
    watch,
  } = form;
  const emailVal = watch("email");
  const passVal = watch("password");

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: C.bg }}>
      {/* ── Left: illustration ─────────────────────────── */}
      <div className="lg:w-1/2">
        <IllustrationPanel />
      </div>

      {/* ── Right: form ───────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: C.brand }}
            >
              <svg width="14" height="18" viewBox="0 0 16 20" fill="none">
                <path d="M9 1L1 11h7l-1 8 8-10H8l1-8z" fill="white" />
              </svg>
            </div>
            <div>
              <p
                className="font-black text-base tracking-tight"
                style={{ color: C.textDark }}
              >
                OyaEats
              </p>
              <p
                className="text-xs font-semibold tracking-widest"
                style={{ color: C.textMuted }}
              >
                SUPER ADMIN
              </p>
            </div>
          </div>

          {/* Shield badge */}
          <div
            className="flex items-center gap-2 mb-6 rounded-xl border px-4 py-3 w-fit"
            style={{ borderColor: C.border, backgroundColor: C.white }}
          >
            <ShieldCheck className="h-4 w-4" style={{ color: C.brandMid }} />
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: C.textMuted }}
            >
              Admin Access Only
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1
              className="text-2xl font-black tracking-tight mb-1"
              style={{ color: C.textDark }}
            >
              Admin Sign In
            </h1>
            <p className="text-sm" style={{ color: C.textMuted }}>
              Sign in to access the super admin dashboard.
            </p>
          </div>

          {/* Global error */}
          {error && (
            <div
              className="mb-5 flex items-start gap-3 rounded-xl border px-4 py-3"
              style={{ borderColor: "#FECACA", backgroundColor: "#FEF2F2" }}
            >
              <AlertCircle
                className="h-4 w-4 flex-shrink-0 mt-0.5"
                style={{ color: C.error }}
              />
              <p className="text-sm font-medium" style={{ color: C.error }}>
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Field
              label="Email"
              type="email"
              placeholder="admin@oya-eat.com"
              icon={Mail}
              error={errors.email?.message}
              value={emailVal}
              onChange={(v) => form.setValue("email", v)}
              onBlur={() => form.trigger("email")}
            />

            <Field
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              error={errors.password?.message}
              value={passVal}
              onChange={(v) => form.setValue("password", v)}
              onBlur={() => form.trigger("password")}
            />
            <div className="-mt-2 text-right">
              <Link href="/forgot-password?role=admin" className="text-xs font-bold hover:underline" style={{ color: C.brand }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-opacity"
              style={{
                backgroundColor: C.brand,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
