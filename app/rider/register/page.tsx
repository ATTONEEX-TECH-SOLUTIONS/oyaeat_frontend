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
  ShieldCheck,
  Zap,
  Banknote,
  UploadCloud,
  FileCheck2
} from "lucide-react";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleType: string;
  plateNumber: string;
  password: string;
};

const RiderRegister = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    vehicleType: "",
    plateNumber: "",
    password: "",
  });
  
  const [idFile, setIdFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const perks = useMemo(
    () => [
      {
        icon: Banknote,
        label: "Competitive Earnings",
        value: "Earn up to ₦50k+ weekly",
      },
      {
        icon: Zap,
        label: "Fast Payouts",
        value: "Daily or weekly withdrawals",
      },
      {
        icon: ShieldCheck,
        label: "Rider Insurance",
        value: "Covered on every active delivery",
      },
    ],
    []
  );

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIdFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!idFile) {
      setError("Please upload a valid ID document.");
      setIsLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => submitData.append(key, value));
      submitData.append("idDocument", idFile);
      
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE_URL}/auth/rider/register`, {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      router.push("/rider/login?registered=true");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
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

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { font-family: "DM Sans", sans-serif; background: var(--white); color: var(--text-dark); }
        .bebas { font-family: "Bebas Neue", sans-serif; letter-spacing: 0.04em; }

        .page { min-height: 100vh; display: flex; position: relative; z-index: 1; }
        
        .dot-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.3;
          background-image: radial-gradient(circle, #B8DDC5 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .left-panel {
          flex: 1; min-height: 100vh; position: relative; overflow: hidden; padding: 48px;
          display: flex; flex-direction: column; justify-content: space-between;
          background: linear-gradient(145deg, var(--green-dark) 0%, var(--green) 55%, var(--green-light) 100%);
          position: sticky; top: 0;
        }

        .right-panel {
          width: 550px; flex-shrink: 0; padding: 48px; display: flex; flex-direction: column;
          background: var(--white); overflow-y: auto;
        }

        .orb { position: absolute; border-radius: 999px; filter: blur(80px); pointer-events: none; }
        .logo { text-decoration: none; display: inline-block; }
        .logo-title { font-size: 36px; line-height: 1; }
        .logo-subtitle { margin-top: 2px; font-size: 9px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255, 255, 255, 0.55); }

        .hero-icon {
          width: 96px; height: 96px; border-radius: 24px; display: inline-flex; align-items: center; justify-content: center;
          background: rgba(255, 255, 255, 0.12); border: 1.5px solid rgba(255, 255, 255, 0.25); margin-bottom: 32px;
        }

        .hero-title { font-size: clamp(48px, 5.5vw, 68px); line-height: 0.95; color: #fff; margin-bottom: 20px; }
        .hero-text { max-width: 380px; font-size: 1rem; line-height: 1.7; color: rgba(255, 255, 255, 0.72); }

        .stats { display: flex; flex-direction: column; gap: 12px; margin-top: 40px; }
        .stat-pill {
          display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.18); background: rgba(255, 255, 255, 0.12); backdrop-filter: blur(8px);
        }
        .stat-icon { color: #fff; opacity: 0.92; flex-shrink: 0; }
        .stat-label { font-size: 0.75rem; font-weight: 600; color: rgba(255, 255, 255, 0.65); }
        .stat-value { font-size: 0.95rem; font-weight: 700; color: #fff; }

        .section-head { margin-bottom: 32px; }
        .status-row { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
        .status-dot { width: 8px; height: 8px; border-radius: 999px; background: var(--green); }
        .status-text { font-size: 0.8rem; font-weight: 600; color: var(--green); }
        .section-title { font-size: 2rem; font-weight: 700; color: var(--text-dark); margin-bottom: 8px; }
        .section-subtitle { font-size: 0.9rem; color: var(--text-muted); }
        .section-subtitle a { color: var(--green); font-weight: 600; text-decoration: none; }

        .error-box {
          display: flex; align-items: center; gap: 8px; margin-bottom: 20px; padding: 12px 16px;
          border-radius: 10px; background: var(--danger-bg); border: 1px solid var(--danger-border);
          color: var(--danger-text); font-size: 0.875rem;
        }

        .form { display: flex; flex-direction: column; gap: 16px; }
        
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .field label { display: block; margin-bottom: 8px; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-mid); }
        .input {
          width: 100%; padding: 14px 16px; font-size: 0.95rem; font-family: "DM Sans", sans-serif;
          color: var(--text-dark); border: 1.5px solid var(--green-border); border-radius: 10px;
          background: var(--white); outline: none; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input::placeholder { color: var(--text-muted); }
        .input:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(26, 107, 60, 0.10); }

        select.input { appearance: none; background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231A6B3C%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E"); background-repeat: no-repeat; background-position: right 16px center; background-size: 16px; padding-right: 40px; }

        .file-upload {
          position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 24px; border: 1.5px dashed var(--green-border); border-radius: 10px; background: var(--green-pale);
          cursor: pointer; transition: all 0.2s; text-align: center;
        }
        .file-upload:hover { border-color: var(--green); background: #e0f2e9; }
        .file-upload input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
        .file-icon { color: var(--green); margin-bottom: 8px; }
        .file-text { font-size: 0.875rem; color: var(--text-mid); font-weight: 500; }
        .file-hint { font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; }

        .password-wrap { position: relative; }
        .password-input { padding-right: 48px; }
        .password-toggle {
          position: absolute; top: 50%; right: 14px; transform: translateY(-50%); display: inline-flex;
          align-items: center; justify-content: center; padding: 0; border: none; background: transparent;
          color: var(--text-muted); cursor: pointer;
        }
        .password-toggle:hover { color: var(--green); }

        .primary-button {
          width: 100%; padding: 15px 32px; border: none; border-radius: 10px; display: inline-flex;
          align-items: center; justify-content: center; gap: 8px; font-size: 1rem; font-weight: 700;
          font-family: "DM Sans", sans-serif; background: var(--green); color: #fff; cursor: pointer;
          box-shadow: 0 4px 20px var(--shadow-green); transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          margin-top: 8px;
        }
        .primary-button:hover { background: var(--green-light); transform: translateY(-2px); box-shadow: 0 8px 28px var(--shadow-green); }
        .primary-button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .action-row { display: flex; gap: 12px; margin-top: 32px; padding-top: 32px; border-top: 1.5px solid var(--green-border); }
        .ghost-link {
          flex: 1; display: block; text-align: center; text-decoration: none; padding: 13px; border-radius: 10px;
          font-size: 0.875rem; color: var(--text-muted); font-weight: 600; border: 1.5px solid var(--green-border); transition: all 0.2s ease;
        }
        .ghost-link:hover { color: var(--green); background: #fafdfa; }

        @media (max-width: 1024px) {
          .page { flex-direction: column; }
          .left-panel { min-height: auto; padding: 32px 24px; position: static; }
          .right-panel { width: 100%; padding: 32px 24px 40px; }
          .form-row { grid-template-columns: 1fr; gap: 16px; }
        }
      `}</style>

      <div className="dot-grid" />

      <div className="page">
        <aside className="left-panel">
          <div className="orb" style={{ width: 400, height: 400, background: "rgba(255,255,255,0.08)", top: -100, right: -100 }} />
          <div className="orb" style={{ width: 300, height: 300, background: "rgba(0,0,0,0.12)", bottom: -80, left: -80 }} />

          <Link href="/" className="logo">
            <div className="bebas logo-title">
              <span style={{ color: "#fff" }}>Oya</span>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>Eat</span>
            </div>
            <div className="logo-subtitle">Rider Registration</div>
          </Link>

          <div>
            <div className="hero-icon">
              <Bike size={42} color="#ffffff" strokeWidth={2} />
            </div>

            <h1 className="bebas hero-title">
              JOIN THE
              <br />
              <span style={{ color: "var(--green-pale)" }}>FASTEST GROWING</span>
              <br />
              FLEET.
            </h1>

            <p className="hero-text">
              Sign up today, get approved within 24 hours, and start earning on your own schedule.
            </p>

            <div className="stats">
              {perks.map((stat) => {
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
        </aside>

        <section className="right-panel">
          <div className="section-head">
            <div className="status-row">
              <span className="status-dot" />
              <span className="status-text">Registration Open</span>
            </div>
            <h2 className="section-title">Create your account</h2>
            <p className="section-subtitle">
              Already have an account? <Link href="/rider/login">Sign in here</Link>
            </p>
          </div>

          {error && (
            <div className="error-box">
              <CircleAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="field">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName" className="input" type="text" placeholder="John"
                  value={formData.firstName} onChange={(e) => updateFormData("firstName", e.target.value)}
                  required disabled={isLoading}
                />
              </div>
              <div className="field">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName" className="input" type="text" placeholder="Doe"
                  value={formData.lastName} onChange={(e) => updateFormData("lastName", e.target.value)}
                  required disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email" className="input" type="email" placeholder="you@example.com"
                  value={formData.email} onChange={(e) => updateFormData("email", e.target.value)}
                  required disabled={isLoading}
                />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone" className="input" type="tel" placeholder="+234 800 000 0000"
                  value={formData.phone} onChange={(e) => updateFormData("phone", e.target.value)}
                  required disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="vehicleType">Vehicle Type</label>
                <select 
                  id="vehicleType" className="input" 
                  value={formData.vehicleType} onChange={(e) => updateFormData("vehicleType", e.target.value)}
                  required disabled={isLoading}
                >
                  <option value="" disabled>Select vehicle</option>
                  <option value="motorcycle">Motorcycle / Okada</option>
                  <option value="bicycle">Bicycle</option>
                  <option value="car">Car</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="plateNumber">Plate Number</label>
                <input
                  id="plateNumber" className="input" type="text" placeholder="Optional for bicycles"
                  value={formData.plateNumber} onChange={(e) => updateFormData("plateNumber", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="field">
              <label>Valid ID Document (NIN, Passport, Driver's License)</label>
              <div className="file-upload">
                <input 
                  type="file" accept=".jpg,.jpeg,.png,.pdf" 
                  onChange={handleFileChange} required disabled={isLoading}
                />
                {idFile ? (
                  <>
                    <FileCheck2 size={28} className="file-icon" />
                    <span className="file-text">{idFile.name}</span>
                    <span className="file-hint">Click to replace</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={28} className="file-icon" />
                    <span className="file-text">Click to upload your ID</span>
                    <span className="file-hint">PNG, JPG or PDF (Max 5MB)</span>
                  </>
                )}
              </div>
            </div>

            <div className="field">
              <label htmlFor="password">Create Password</label>
              <div className="password-wrap">
                <input
                  id="password" className="input password-input"
                  type={showPassword ? "text" : "password"} placeholder="Min. 8 characters"
                  value={formData.password} onChange={(e) => updateFormData("password", e.target.value)}
                  required minLength={8} disabled={isLoading}
                />
                <button
                  type="button" className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="primary-button" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 size={18} className="animate-spin" /> Submitting...</>
              ) : (
                <>Submit Application <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="action-row">
            <Link href="/" className="ghost-link">Back to Home</Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default RiderRegister;
