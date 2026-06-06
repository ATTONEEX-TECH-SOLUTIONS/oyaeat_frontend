"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Bike,
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
} from "lucide-react";
import riderHero from "@/public/rider-hero.png";

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
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const stats = useMemo(
    () => [
      { icon: Wallet, label: "Avg. Daily Payout", value: "₦3,200+" },
      { icon: Zap, label: "Orders Available Now", value: "240+" },
      { icon: Star, label: "Rider Rating Average", value: "4.8 / 5" },
    ],
    []
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
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("riderToken", data.token);
      router.push("/rider/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Lato:wght@300;400;700;900&display=swap');

        :root {
          --green: #1A6B3C;
          --green-light: #22883F;
          --green-pale: #E8F5EE;
          --green-pale2: #D0EBD9;
          --green-border: #B8DDC5;
          --green-dark: #0F4526;
          --white: #FFFFFF;
          --text-dark: #0D2218;
          --text-mid: #3A5A47;
          --text-muted: #7A9A85;
          --shadow-green: rgba(26, 107, 60, 0.18);
          --font-display: 'Playfair Display', Georgia, serif;
          --font-body: 'Lato', sans-serif;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          font-family: var(--font-body);
          background: var(--white);
          color: var(--text-dark);
          -webkit-font-smoothing: antialiased;
        }

        /* ── PAGE LAYOUT ── */
        .login-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 520px;
          position: relative;
        }

        /* ── DOT GRID ── */
        .dot-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.28;
          background-image: radial-gradient(circle, #B8DDC5 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* ── LEFT PANEL ── */
        .left-panel {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* Full-bleed image */
        .left-image-wrap {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        /* Dark-to-transparent gradient over the image */
        .left-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            135deg,
            rgba(10, 35, 20, 0.88) 0%,
            rgba(15, 69, 38, 0.75) 45%,
            rgba(26, 107, 60, 0.55) 75%,
            rgba(26, 107, 60, 0.35) 100%
          );
        }

        /* Diagonal accent stripe */
        .left-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            -55deg,
            transparent,
            transparent 60px,
            rgba(255,255,255,0.015) 60px,
            rgba(255,255,255,0.015) 61px
          );
        }

        .left-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          padding: 48px 56px;
        }

        /* Logo */
        .logo {
          text-decoration: none;
          display: inline-flex;
          flex-direction: column;
          gap: 3px;
        }
        .logo-name {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 32px;
          line-height: 1;
          color: #fff;
          letter-spacing: -0.01em;
        }
        .logo-name em {
          font-style: normal;
          color: rgba(255,255,255,0.45);
        }
        .logo-tag {
          font-family: var(--font-body);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
        }

        /* Hero copy */
        .hero-copy { max-width: 420px; }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.08);
          margin-bottom: 28px;
        }
        .hero-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 0 3px rgba(74,222,128,0.25);
          flex-shrink: 0;
        }
        .hero-eyebrow span {
          font-family: var(--font-body);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.8);
        }

        .hero-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(44px, 5.5vw, 68px);
          line-height: 1.0;
          letter-spacing: -0.01em;
          color: #fff;
          margin-bottom: 20px;
        }
        .hero-title em {
          font-style: italic;
          color: rgba(255,255,255,0.45);
        }

        .hero-body {
          font-family: var(--font-body);
          font-weight: 300;
          font-size: 1rem;
          line-height: 1.75;
          color: rgba(255,255,255,0.68);
          max-width: 360px;
        }

        /* Stats grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 44px;
        }

        .stat-card {
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          transition: background 0.2s, border-color 0.2s;
        }
        .stat-card:hover {
          background: rgba(255,255,255,0.13);
          border-color: rgba(255,255,255,0.25);
        }
        .stat-card-icon {
          color: rgba(255,255,255,0.65);
          margin-bottom: 10px;
        }
        .stat-card-value {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.15rem;
          color: #fff;
          line-height: 1;
          margin-bottom: 5px;
        }
        .stat-card-label {
          font-family: var(--font-body);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }

        /* Bottom leaderboard strip */
        .leaderboard-strip {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(8px);
        }
        .lb-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #fff;
        }
        .lb-label {
          font-family: var(--font-body);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-bottom: 3px;
        }
        .lb-value {
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.875rem;
          color: #fff;
        }
        .lb-value span { color: rgba(255,255,255,0.6); }
        .lb-badge {
          margin-left: auto;
          padding: 3px 10px;
          border-radius: 20px;
          background: rgba(74,222,128,0.18);
          border: 1px solid rgba(74,222,128,0.3);
          font-family: var(--font-body);
          font-size: 0.68rem;
          font-weight: 700;
          color: #4ade80;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        /* ── RIGHT PANEL ── */
        .right-panel {
          position: relative;
          z-index: 1;
          background: var(--white);
          border-left: 1px solid var(--green-border);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 56px 52px;
          overflow-y: auto;
        }

        /* Section header */
        .form-header { margin-bottom: 36px; }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 5px 14px;
          border-radius: 20px;
          background: var(--green-pale);
          border: 1px solid var(--green-border);
          margin-bottom: 20px;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 0 3px rgba(26,107,60,0.15);
        }
        .status-label {
          font-family: var(--font-body);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--green);
        }

        .form-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(26px, 3vw, 34px);
          color: var(--text-dark);
          line-height: 1.1;
          margin-bottom: 10px;
        }
        .form-title em {
          font-style: italic;
          color: var(--green);
        }

        .form-subtitle {
          font-family: var(--font-body);
          font-weight: 400;
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.6;
        }
        .form-subtitle a {
          color: var(--green);
          font-weight: 700;
          text-decoration: none;
          border-bottom: 1.5px solid var(--green-border);
          transition: border-color 0.2s;
        }
        .form-subtitle a:hover { border-color: var(--green); }

        /* Error */
        .error-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 24px;
          padding: 14px 16px;
          border-radius: 10px;
          background: rgba(239,68,68,0.06);
          border: 1px solid rgba(239,68,68,0.25);
          color: #dc2626;
          font-family: var(--font-body);
          font-size: 0.875rem;
          line-height: 1.5;
        }
        .error-box svg { flex-shrink: 0; margin-top: 1px; }

        /* Form fields */
        .form { display: flex; flex-direction: column; gap: 20px; }

        .field { display: flex; flex-direction: column; gap: 0; }

        .field-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .field-label label {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-mid);
        }
        .field-label a {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--green);
          text-decoration: none;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        .field-label a:hover { opacity: 1; }

        .input-wrap { position: relative; }

        .input {
          width: 100%;
          padding: 13px 16px;
          font-size: 0.95rem;
          font-family: var(--font-body);
          font-weight: 400;
          color: var(--text-dark);
          border: 1.5px solid var(--green-border);
          border-radius: 10px;
          background: var(--white);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          -webkit-appearance: none;
        }
        .input::placeholder { color: var(--text-muted); font-weight: 300; }
        .input:focus {
          border-color: var(--green);
          box-shadow: 0 0 0 3.5px rgba(26,107,60,0.09);
          background: #fafcfb;
        }
        .input.has-suffix { padding-right: 48px; }
        .input.error-state {
          border-color: rgba(239,68,68,0.5);
          box-shadow: 0 0 0 3px rgba(239,68,68,0.07);
        }

        .input-suffix-btn {
          position: absolute;
          top: 50%;
          right: 14px;
          transform: translateY(-50%);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: 6px;
          transition: color 0.2s, background 0.2s;
        }
        .input-suffix-btn:hover {
          color: var(--green);
          background: var(--green-pale);
        }

        /* Remember row */
        .remember-row {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
        }
        .custom-checkbox {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          border: 1.5px solid var(--green-border);
          background: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s;
          cursor: pointer;
        }
        .custom-checkbox.checked {
          background: var(--green);
          border-color: var(--green);
        }
        .custom-checkbox svg { display: none; }
        .custom-checkbox.checked svg { display: block; }
        .remember-row span {
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: var(--text-muted);
          font-weight: 400;
        }

        /* Submit button */
        .submit-btn {
          width: 100%;
          padding: 15px 28px;
          border: none;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          background: var(--green);
          color: #fff;
          cursor: pointer;
          box-shadow: 0 4px 20px var(--shadow-green);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .submit-btn:hover:not(:disabled) {
          background: var(--green-light);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px var(--shadow-green);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 4px 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: var(--green-border);
        }
        .divider-label {
          font-family: var(--font-body);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          white-space: nowrap;
        }

        /* Action links */
        .action-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .action-link {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          border-radius: 10px;
          border: 1.5px solid var(--green-border);
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
          text-align: center;
        }
        .action-link.primary-ghost {
          color: var(--green);
          background: var(--green-pale);
          border-color: transparent;
        }
        .action-link.primary-ghost:hover { background: var(--green-pale2); }
        .action-link.secondary-ghost {
          color: var(--text-muted);
          background: transparent;
        }
        .action-link.secondary-ghost:hover {
          color: var(--green);
          background: var(--green-pale);
          border-color: var(--green-border);
        }

        /* Trust badges */
        .trust-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--green-border);
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-body);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--text-muted);
        }
        .trust-item svg { color: var(--green); opacity: 0.7; }

        /* Footer */
        .form-footer {
          text-align: center;
          font-family: var(--font-body);
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .form-footer a { color: var(--green); text-decoration: none; font-weight: 600; }

        /* Animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .anim-up { animation: fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) both; }
        .anim-fade { animation: fadeIn 0.5s ease both; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.12s; }
        .d3 { animation-delay: 0.20s; }
        .d4 { animation-delay: 0.28s; }
        .d5 { animation-delay: 0.36s; }

        /* Responsive */
        @media (max-width: 1024px) {
          .login-page { grid-template-columns: 1fr; }
          .left-panel { min-height: 340px; }
          .left-content { padding: 36px 28px; }
          .stats-grid { grid-template-columns: repeat(3, 1fr); }
          .right-panel { padding: 40px 28px 48px; border-left: none; border-top: 1px solid var(--green-border); }
        }
        @media (max-width: 560px) {
          .stats-grid { grid-template-columns: 1fr; gap: 8px; }
          .action-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="dot-grid" />

      <div className="login-page">

        {/* ── LEFT PANEL ── */}
        <aside className="left-panel">
          <div className="left-image-wrap">
            <Image
              src={riderHero}
              alt="OyaEat rider in Lagos"
              fill
              priority
              sizes="55vw"
              style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
            />
          </div>
          <div className="left-overlay" />

          <div className="left-content">
            {/* Logo */}
            <Link href="/" className="logo">
              <div className="logo-name">
                Oya<em>Eat</em>
              </div>
              <div className="logo-tag">Rider Portal</div>
            </Link>

            {/* Hero copy */}
            <div className="hero-copy">
              <div className="hero-eyebrow">
                <span className="hero-eyebrow-dot" />
                <span>Orders live in Lagos, Abuja & PH</span>
              </div>

              <h1 className="hero-title">
                Welcome<br />
                Back,<br />
                <em>Rider.</em>
              </h1>

              <p className="hero-body">
                Log in to your dashboard, check your earnings, and get back on the road.
              </p>

              {/* Stats cards */}
              <div className="stats-grid">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="stat-card">
                      <div className="stat-card-icon">
                        <Icon size={18} strokeWidth={2} />
                      </div>
                      <div className="stat-card-value">{stat.value}</div>
                      <div className="stat-card-label">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leaderboard strip */}
            <div className="leaderboard-strip">
              <div className="lb-icon">
                <TrendingUp size={16} strokeWidth={2.5} />
              </div>
              <div>
                <div className="lb-label">Today's top earner</div>
                <div className="lb-value">
                  Emeka, Lagos Island — <span>₦14,200 earned</span>
                </div>
              </div>
              <div className="lb-badge">🏆 #1 Today</div>
            </div>
          </div>
        </aside>

        {/* ── RIGHT PANEL ── */}
        <section className="right-panel">

          {/* Header */}
          <div className="form-header anim-up d1">
            <div className="status-pill">
              <span className="status-dot" />
              <span className="status-label">Rider Portal Active</span>
            </div>

            <h2 className="form-title">
              Sign in &amp; <em>start earning</em>
            </h2>

            <p className="form-subtitle">
              Don&apos;t have an account?{" "}
              <Link href="/rider/register">Apply to ride →</Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="error-box anim-fade">
              <CircleAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="form" onSubmit={handleSubmit}>

            <div className="field anim-up d2">
              <div className="field-label">
                <label htmlFor="email">Email Address</label>
              </div>
              <div className="input-wrap">
                <input
                  id="email"
                  className={`input${error ? ' error-state' : ''}`}
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="field anim-up d3">
              <div className="field-label">
                <label htmlFor="password">Password</label>
                <Link href="/rider/forgot-password">Forgot password?</Link>
              </div>
              <div className="input-wrap">
                <input
                  id="password"
                  className={`input has-suffix${error ? ' error-state' : ''}`}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-suffix-btn"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="anim-up d4">
              <label
                className="remember-row"
                onClick={() => updateFormData("remember", !formData.remember)}
              >
                <div className={`custom-checkbox${formData.remember ? ' checked' : ''}`}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span>Keep me signed in for 30 days</span>
              </label>
            </div>

            <div className="anim-up d5">
              <button type="submit" className="submit-btn" disabled={isLoading}>
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
            </div>

          </form>

          {/* Divider */}
          <div className="divider" style={{ marginTop: 28 }}>
            <div className="divider-line" />
            <span className="divider-label">or</span>
            <div className="divider-line" />
          </div>

          {/* Action links */}
          <div className="action-row" style={{ marginTop: 16 }}>
            <Link href="/rider/register" className="action-link primary-ghost">
              New rider? Apply now
            </Link>
            <Link href="/" className="action-link secondary-ghost">
              ← Back to Home
            </Link>
          </div>

          {/* Trust badges */}
          <div className="trust-row" style={{ marginTop: 28 }}>
            <div className="trust-item">
              <ShieldCheck size={13} />
              Secure login
            </div>
            <div className="trust-item">
              <Zap size={13} />
              Instant access
            </div>
            <div className="trust-item">
              <Star size={13} />
              4.8★ rated platform
            </div>
          </div>

          {/* Footer */}
          <p className="form-footer" style={{ marginTop: 20 }}>
            By signing in you agree to our{" "}
            <a href="#">Terms of Service</a> &amp;{" "}
            <a href="#">Privacy Policy</a>
          </p>

        </section>
      </div>
    </>
  );
};

export default RiderLogin;