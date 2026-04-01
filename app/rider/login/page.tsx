"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

type FormData = {
  email: string;
  password: string;
};

const RiderLogin = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const stats = useMemo(
    () => [
      {
        icon: Wallet,
        label: "Avg. Daily Payout",
        value: "₦3,200+",
      },
      {
        icon: Zap,
        label: "Orders Available Now",
        value: "240+",
      },
      {
        icon: Star,
        label: "Rider Rating Average",
        value: "4.8 / 5",
      },
    ],
    []
  );

  const updateFormData = (field: keyof FormData, value: string) => {
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
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("riderToken", data.token);
      router.push("/rider/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap");

        :root {
          --green: #1A6B3C;
          --green-light: #22883F;
          --green-pale: #E8F5EE;
          --green-muted: #4A8C63;
          --green-border: #B8DDC5;
          --green-dark: #0F4526;
          --white: #FFFFFF;
          --text-dark: #0D2218;
          --text-mid: #3A5A47;
          --text-muted: #7A9A85;
          --shadow-green: rgba(26, 107, 60, 0.15);
          --danger-bg: rgba(239, 68, 68, 0.08);
          --danger-border: rgba(239, 68, 68, 0.3);
          --danger-text: #dc2626;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body {
          font-family: "DM Sans", sans-serif;
          background: var(--white);
          color: var(--text-dark);
        }

        .bebas {
          font-family: "Bebas Neue", sans-serif;
          letter-spacing: 0.04em;
        }

        .page {
          min-height: 100vh;
          display: flex;
          position: relative;
          z-index: 1;
        }

        .dot-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.3;
          background-image: radial-gradient(circle, #B8DDC5 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .left-panel {
          flex: 1;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: linear-gradient(145deg, var(--green-dark) 0%, var(--green) 55%, var(--green-light) 100%);
        }

        .right-panel {
          width: 500px;
          flex-shrink: 0;
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: var(--white);
        }

        .orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(80px);
          pointer-events: none;
        }

        .logo {
          text-decoration: none;
          display: inline-block;
        }

        .logo-title {
          font-size: 36px;
          line-height: 1;
        }

        .logo-subtitle {
          margin-top: 2px;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
        }

        .hero-icon {
          width: 96px;
          height: 96px;
          border-radius: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.12);
          border: 1.5px solid rgba(255, 255, 255, 0.25);
          margin-bottom: 32px;
        }

        .hero-title {
          font-size: clamp(48px, 6vw, 72px);
          line-height: 0.95;
          color: #fff;
          margin-bottom: 20px;
        }

        .hero-text {
          max-width: 320px;
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.72);
        }

        .stats {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 40px;
        }

        .stat-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
        }

        .stat-icon {
          color: #fff;
          opacity: 0.92;
          flex-shrink: 0;
        }

        .stat-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.65);
        }

        .stat-value {
          font-size: 0.95rem;
          font-weight: 700;
          color: #fff;
        }

        .bottom-note-label {
          margin-bottom: 8px;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
        }

        .bottom-note-text {
          font-size: 0.875rem;
          font-weight: 600;
          color: #fff;
        }

        .bottom-note-text span {
          color: rgba(255, 255, 255, 0.7);
        }

        .section-head {
          margin-bottom: 40px;
        }

        .status-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--green);
        }

        .status-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--green);
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 8px;
        }

        .section-subtitle {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .section-subtitle a {
          color: var(--green);
          font-weight: 600;
          text-decoration: none;
        }

        .error-box {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          padding: 12px 16px;
          border-radius: 10px;
          background: var(--danger-bg);
          border: 1px solid var(--danger-border);
          color: var(--danger-text);
          font-size: 0.875rem;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .field label {
          display: block;
          margin-bottom: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-mid);
        }

        .input {
          width: 100%;
          padding: 14px 16px;
          font-size: 0.95rem;
          font-family: "DM Sans", sans-serif;
          color: var(--text-dark);
          border: 1.5px solid var(--green-border);
          border-radius: 10px;
          background: var(--white);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .input::placeholder {
          color: var(--text-muted);
        }

        .input:focus {
          border-color: var(--green);
          box-shadow: 0 0 0 3px rgba(26, 107, 60, 0.10);
        }

        .password-wrap {
          position: relative;
        }

        .password-input {
          padding-right: 48px;
        }

        .password-toggle {
          position: absolute;
          top: 50%;
          right: 14px;
          transform: translateY(-50%);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
        }

        .password-toggle:hover {
          color: var(--green);
        }

        .forgot-wrap {
          margin-top: 8px;
          text-align: right;
        }

        .forgot-wrap a {
          color: var(--green);
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .checkbox-row input {
          width: 16px;
          height: 16px;
          accent-color: var(--green);
        }

        .checkbox-row span {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .primary-button {
          width: 100%;
          padding: 15px 32px;
          border: none;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 1rem;
          font-weight: 700;
          font-family: "DM Sans", sans-serif;
          background: var(--green);
          color: #fff;
          cursor: pointer;
          box-shadow: 0 4px 20px var(--shadow-green);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }

        .primary-button:hover {
          background: var(--green-light);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px var(--shadow-green);
        }

        .primary-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .action-row {
          display: flex;
          gap: 12px;
          margin-top: 32px;
          padding-top: 32px;
          border-top: 1.5px solid var(--green-border);
        }

        .secondary-link,
        .ghost-link {
          flex: 1;
          display: block;
          text-align: center;
          text-decoration: none;
          padding: 13px;
          border-radius: 10px;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .secondary-link {
          color: var(--green);
          font-weight: 700;
          border: 1.5px solid var(--green-border);
        }

        .secondary-link:hover {
          background: var(--green-pale);
        }

        .ghost-link {
          color: var(--text-muted);
          font-weight: 600;
          border: 1.5px solid var(--green-border);
        }

        .ghost-link:hover {
          color: var(--green);
          background: #fafdfa;
        }

        .footer-note {
          margin-top: 24px;
          text-align: center;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .footer-note a {
          color: var(--green);
          text-decoration: none;
        }

        @media (max-width: 1024px) {
          .page {
            flex-direction: column;
          }

          .left-panel {
            min-height: auto;
            padding: 32px 24px;
          }

          .right-panel {
            width: 100%;
            padding: 32px 24px 40px;
          }

          .hero-text {
            max-width: 100%;
          }
        }
      `}</style>

      <div className="dot-grid" />

      <div className="page">
        <aside className="left-panel">
          <div
            className="orb"
            style={{
              width: 400,
              height: 400,
              background: "rgba(255,255,255,0.08)",
              top: -100,
              right: -100,
            }}
          />
          <div
            className="orb"
            style={{
              width: 300,
              height: 300,
              background: "rgba(0,0,0,0.12)",
              bottom: -80,
              left: -80,
            }}
          />

          <Link href="/" className="logo">
            <div className="bebas logo-title">
              <span style={{ color: "#fff" }}>Oya</span>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>Eat</span>
            </div>
            <div className="logo-subtitle">Rider Portal</div>
          </Link>

          <div>
            <div className="hero-icon">
              <Bike size={42} color="#ffffff" strokeWidth={2} />
            </div>

            <h1 className="bebas hero-title">
              WELCOME
              <br />
              BACK,
              <br />
              <span style={{ color: "rgba(255,255,255,0.55)" }}>RIDER.</span>
            </h1>

            <p className="hero-text">
              Log in to your dashboard, check your earnings, and get back on the
              road.
            </p>

            <div className="stats">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="stat-pill">
                    <Icon className="stat-icon" size={20} strokeWidth={2} />
                    <div>
                      <div className="stat-label">{stat.label}</div>
                      <div className="stat-value">{stat.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="bottom-note-label">Today's top earner</div>
            <div className="bottom-note-text">
              Emeka from Lagos — <span>₦14,200 earned today</span>
            </div>
          </div>
        </aside>

        <section className="right-panel">
          <div className="section-head">
            <div className="status-row">
              <span className="status-dot" />
              <span className="status-text">Rider Portal Active</span>
            </div>

            <h2 className="section-title">Sign in to your account</h2>

            <p className="section-subtitle">
              Don&apos;t have an account?{" "}
              <Link href="/rider/register">Apply to ride</Link>
            </p>
          </div>

          {error && (
            <div className="error-box">
              <CircleAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                className="input"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>

              <div className="password-wrap">
                <input
                  id="password"
                  className="input password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  required
                  disabled={isLoading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="forgot-wrap">
                <Link href="/rider/forgot-password">Forgot password?</Link>
              </div>
            </div>

            <label className="checkbox-row">
              <input type="checkbox" />
              <span>Keep me signed in</span>
            </label>

            <button type="submit" className="primary-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="action-row">
            <Link href="/rider/register" className="secondary-link">
              New rider? Apply now
            </Link>

            <Link href="/" className="ghost-link">
              Back to Home
            </Link>
          </div>

          <p className="footer-note">
            By signing in you agree to our <a href="#">Terms</a> &amp;{" "}
            <a href="#">Privacy Policy</a>
          </p>
        </section>
      </div>
    </>
  );
};

export default RiderLogin;