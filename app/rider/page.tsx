"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const RiderSignup = () => {
  const router = useRouter();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/partner-signup", label: "Vendors" },
    { href: "/features", label: "Features" },
    { href: "/downloads", label: "Downloads" },
    { href: "/how-it-works", label: "How it works" },
  ];

  const perks = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      stat: "₦50K+",
      title: "Monthly Earnings",
      description: "Top riders earn over ₦50,000 monthly. The more you ride, the more you make — no cap.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      stat: "100%",
      title: "Flexible Hours",
      description: "Work when you want, rest when you need. You set your own schedule — no boss.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      stat: "24hrs",
      title: "Fast Payout",
      description: "No waiting week-end. Get paid daily or weekly — your money, your timeline.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      stat: "Free",
      title: "Rider Insurance",
      description: "We've got you covered on every delivery. Ride with confidence, ride with OyaEat.",
    },
  ];

  const steps = [
    { num: "01", title: "Sign Up", desc: "Create your free account in under 2 minutes. No complicated paperwork." },
    { num: "02", title: "Get Verified", desc: "Submit your ID and vehicle details. We'll approve you within 24 hours." },
    { num: "03", title: "Start Riding", desc: "Accept orders on the app and start earning immediately. It's that simple." },
    { num: "04", title: "Get Paid", desc: "Withdraw your earnings anytime — straight to your bank account." },
  ];

  const testimonials = [
    {
      name: "Emeka Nwosu",
      city: "Lagos Island",
      earnings: "₦68,000/mo",
      text: "I was driving for ride-hail and earning peanuts. Switched to OyaEat and doubled my income in the first month. No joke.",
      years: "8 months riding",
    },
    {
      name: "Fatima Yusuf",
      city: "Abuja",
      earnings: "₦52,000/mo",
      text: "As a woman rider, I was worried. But OyaEat's support team is always there, the insurance is real, and the money never fails.",
      years: "1 year riding",
    },
    {
      name: "Seun Adeyemi",
      city: "Port Harcourt",
      earnings: "₦44,000/mo",
      text: "I ride part-time after school. The flexible hours mean I never miss lectures. Best side hustle in PH right now.",
      years: "5 months riding",
    },
  ];

  const faqs = [
    {
      question: "What vehicle do I need to become a rider?",
      answer: "You can ride with a motorcycle (okada), bicycle, or car. As long as your vehicle is road-worthy and registered, you're good to go.",
    },
    {
      question: "How much can I realistically earn?",
      answer: "Earnings depend on hours and location. Part-time riders average ₦20,000–₦30,000/month; full-time riders consistently earn ₦45,000–₦70,000+. Peak hours (lunch & dinner) pay significantly more.",
    },
    {
      question: "How soon can I start after signing up?",
      answer: "Most riders are approved within 24 hours. Once approved, you can go online immediately and start accepting orders.",
    },
    {
      question: "When and how do I get paid?",
      answer: "You can request a payout daily or weekly. Funds are transferred directly to your registered bank account, usually within 30 minutes.",
    },
    {
      question: "What if I have an accident on the job?",
      answer: "All active OyaEat riders are covered by our rider insurance policy during deliveries. Report any incident immediately through the app and our team will assist.",
    },
    {
      question: "Is there a fee to join as a rider?",
      answer: "Absolutely not. Signing up is 100% free. We only take a small platform fee per completed delivery — you keep the rest.",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');

        :root {
          --green: #1A6B3C;
          --green-light: #22883F;
          --green-pale: #E8F5EE;
          --green-pale2: #D0EBD9;
          --green-muted: #4A8C63;
          --green-border: #B8DDC5;
          --green-dark: #0F4526;
          --white: #FFFFFF;
          --off-white: #F7FAF8;
          --text-dark: #0D2218;
          --text-mid: #3A5A47;
          --text-muted: #7A9A85;
          --shadow-green: rgba(26, 107, 60, 0.15);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--white);
          color: var(--text-dark);
        }

        .bebas { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.04em; }

        .dot-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
          background-image: radial-gradient(circle, #B8DDC5 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .fade-up { animation: fadeUp 0.7s ease both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }

        .nav-link {
          position: relative;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-mid);
          text-decoration: none;
          transition: color 0.2s;
          padding: 4px 0;
        }
        .nav-link:hover { color: var(--green); }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          height: 2px;
          width: 0;
          background: var(--green);
          border-radius: 2px;
          transition: width 0.25s ease;
        }
        .nav-link:hover::after { width: 100%; }

        .btn-primary {
          background: var(--green);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          padding: 14px 32px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 20px var(--shadow-green);
          text-decoration: none;
        }
        .btn-primary:hover {
          background: var(--green-light);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px var(--shadow-green);
        }

        .perk-card {
          background: var(--white);
          border: 1.5px solid var(--green-border);
          border-radius: 16px;
          padding: 32px;
          transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
          position: relative;
          overflow: hidden;
        }
        .perk-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--green), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .perk-card:hover {
          border-color: var(--green);
          transform: translateY(-4px);
          box-shadow: 0 12px 32px var(--shadow-green);
        }
        .perk-card:hover::before { opacity: 1; }

        .faq-item {
          border-bottom: 1.5px solid var(--green-border);
          overflow: hidden;
        }
        .faq-btn {
          width: 100%;
          padding: 24px 0;
          text-align: left;
          background: transparent;
          border: none;
          color: var(--text-dark);
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          transition: color 0.2s;
        }
        .faq-btn:hover { color: var(--green); }

        .testi-card {
          background: var(--white);
          border: 1.5px solid var(--green-border);
          border-radius: 16px;
          padding: 32px;
          position: relative;
          transition: box-shadow 0.3s;
        }
        .testi-card:hover {
          box-shadow: 0 12px 32px var(--shadow-green);
        }
        .earnings-badge {
          background: var(--green-pale);
          border: 1px solid var(--green-border);
          color: var(--green);
          font-weight: 700;
          font-size: 0.8rem;
          padding: 4px 10px;
          border-radius: 20px;
          display: inline-block;
        }

        .ticker-wrap {
          overflow: hidden;
          background: var(--green);
          padding: 12px 0;
          white-space: nowrap;
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .ticker-inner {
          display: inline-flex;
          animation: ticker 20s linear infinite;
        }
      `}</style>

      <div className="dot-grid" />

      <div style={{ position: 'relative', zIndex: 1, background: 'transparent', minHeight: '100vh' }}>

        {/* ── NAVBAR ─────────────────────────────────────────── */}
        <nav style={{
          position: 'fixed', top: 0, width: '100%', zIndex: 50,
          borderBottom: '1px solid var(--green-border)',
          backdropFilter: 'blur(12px)',
          background: 'rgba(255,255,255,0.90)',
        }}>
          <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div>
                <span className="bebas" style={{ fontSize: 28, lineHeight: 1 }}>
                  <span style={{ color: 'var(--green)' }}>Oya</span>
                  <span style={{ color: 'var(--text-dark)' }}>Eat</span>
                </span>
                <div style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginTop: 1 }}>Rider Program</div>
              </div>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              {navLinks.map(l => (
                <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Link href="/rider/login" style={{
                padding: '10px 20px', fontSize: '0.875rem', fontFamily: 'DM Sans', fontWeight: 600,
                color: 'var(--green)', border: '1.5px solid var(--green-border)', borderRadius: 8,
                textDecoration: 'none', transition: 'all 0.2s', background: 'transparent',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--green-pale)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                Login
              </Link>
              <Link href="/rider/register" className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.875rem' }}>
                Start Riding →
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ───────────────────────────────────────────── */}
        <section style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #fff 0%, var(--green-pale) 60%, var(--green-pale2) 100%)' }}>
          <div className="orb" style={{ width: 600, height: 600, background: 'rgba(26,107,60,0.08)', top: -100, right: -200 }} />
          <div className="orb" style={{ width: 400, height: 400, background: 'rgba(34,136,63,0.06)', bottom: 0, left: -100 }} />

          <div style={{ maxWidth: 1300, margin: '0 auto', padding: '80px 32px', display: 'flex', gap: 64, alignItems: 'center', width: '100%' }}>

            {/* Left: Copy */}
            <div style={{ flex: 1 }}>
              <div className="fade-up" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(26,107,60,0.08)', border: '1px solid rgba(26,107,60,0.25)',
                borderRadius: 20, padding: '6px 16px', marginBottom: 24,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulse-ring 1.5s ease infinite' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--green)' }}>Now hiring riders in Lagos, Abuja & PH</span>
              </div>

              <h1 className="bebas fade-up delay-1" style={{ fontSize: 'clamp(64px, 8vw, 100px)', lineHeight: 0.95, marginBottom: 24, color: 'var(--text-dark)' }}>
                RIDE.<br />
                <span style={{ color: 'var(--green)', WebkitTextStroke: '2px var(--green)', WebkitTextFillColor: 'transparent' }}>EARN.</span><br />
                REPEAT.
              </h1>

              <p className="fade-up delay-2" style={{ fontSize: '1.1rem', color: 'var(--text-mid)', lineHeight: 1.7, maxWidth: 480, marginBottom: 40 }}>
                Turn your motorcycle, bicycle, or car into a money machine. Deliver with OyaEat and earn on your own terms — no boss, no fixed hours, no cap on income.
              </p>

              <div className="fade-up delay-3" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                {/* PRIMARY CTA → goes to register page */}
                <Link href="/rider/register" className="btn-primary" style={{ fontSize: '1.05rem', padding: '16px 36px' }}>
                  Join as a Rider
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
                <Link href="/rider/login" style={{
                  background: 'transparent', border: '1.5px solid var(--green-border)',
                  color: 'var(--text-mid)', padding: '16px 24px', borderRadius: 8,
                  fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--green)'; (e.currentTarget as HTMLElement).style.color = 'var(--green)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--green-border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-mid)'; }}>
                  Already a rider? Login
                </Link>
              </div>

              {/* Mini stats */}
              <div className="fade-up delay-4" style={{ display: 'flex', gap: 40, marginTop: 56, paddingTop: 40, borderTop: '1.5px solid var(--green-border)' }}>
                {[['10,000+', 'Active Riders'], ['₦50K+', 'Top Monthly Earning'], ['24hrs', 'Avg. Approval Time']].map(([val, label]) => (
                  <div key={label}>
                    <div className="bebas" style={{ fontSize: 28, color: 'var(--green)' }}>{val}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual CTA card */}
            <div style={{ width: 420, flexShrink: 0 }}>
              <div style={{
                background: '#fff',
                border: '1.5px solid var(--green-border)',
                borderRadius: 20,
                padding: 36,
                position: 'relative',
                boxShadow: '0 16px 48px rgba(26,107,60,0.10)',
                textAlign: 'center',
              }}>
                <div style={{ position: 'absolute', top: -1, left: 24, right: 24, height: 3, background: 'linear-gradient(90deg, var(--green), transparent)', borderRadius: '0 0 4px 4px' }} />

                <div style={{ fontSize: '4rem', marginBottom: 16 }}>🏍️</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 8 }}>Ready to earn?</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 28, lineHeight: 1.6 }}>
                  Join thousands of riders making real money on their own schedule. Free to join, approved in 24 hours.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Link href="/rider/register" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '15px' }}>
                    Apply to Ride →
                  </Link>
                  <Link href="/rider/login" style={{
                    display: 'block', padding: '14px', border: '1.5px solid var(--green-border)', borderRadius: 8,
                    textAlign: 'center', color: 'var(--text-mid)', fontFamily: 'DM Sans', fontWeight: 600,
                    fontSize: '0.9rem', textDecoration: 'none', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--green)'; (e.currentTarget as HTMLElement).style.color = 'var(--green)'; (e.currentTarget as HTMLElement).style.background = 'var(--green-pale)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--green-border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-mid)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                    Already a rider? Sign in
                  </Link>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--green-border)' }}>
                  {[['✅', 'Free signup'], ['⚡', '24hr approval'], ['💰', 'Daily pay']].map(([icon, text]) => (
                    <div key={text} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.1rem', marginBottom: 4 }}>{icon}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TICKER ─────────────────────────────────────────── */}
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...Array(2)].map((_, i) => (
              <span key={i} style={{ fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: '0.1em', color: '#fff' }}>
                {['RIDE YOUR WAY', 'EARN DAILY', 'NO FIXED HOURS', 'FREE TO JOIN', 'INSURED RIDERS', 'FAST PAYOUT', '10,000+ RIDERS'].map(t => (
                  <span key={t} style={{ marginRight: 48 }}>
                    {t} <span style={{ color: 'rgba(255,255,255,0.35)', marginRight: 48 }}>✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ── WHY RIDE WITH US ───────────────────────────────── */}
        <section style={{ padding: '100px 32px', maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--green)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Why OyaEat</div>
            <h2 className="bebas" style={{ fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 1, color: 'var(--text-dark)' }}>
              PERKS THAT ACTUALLY<br />
              <span style={{ color: 'var(--green)' }}>MAKE SENSE</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {perks.map((p, i) => (
              <div key={i} className="perk-card">
                <div style={{ color: 'var(--green)', marginBottom: 20 }}>{p.icon}</div>
                <div className="bebas" style={{ fontSize: 40, color: 'var(--green)', lineHeight: 1, marginBottom: 8 }}>{p.stat}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 10, color: 'var(--text-dark)' }}>{p.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ───────────────────────────────────── */}
        <section style={{ background: 'var(--green-pale)', padding: '100px 32px', borderTop: '1.5px solid var(--green-border)', borderBottom: '1.5px solid var(--green-border)' }}>
          <div style={{ maxWidth: 1300, margin: '0 auto' }}>
            <div style={{ marginBottom: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--green)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>The Process</div>
                <h2 className="bebas" style={{ fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 1, color: 'var(--text-dark)' }}>
                  GO FROM ZERO TO<br />
                  <span style={{ color: 'var(--green)' }}>EARNING IN 4 STEPS</span>
                </h2>
              </div>
              <Link href="/rider/register" className="btn-primary">Apply Now →</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, position: 'relative' }}>
              {steps.map((s, i) => (
                <div key={i} style={{ padding: '32px 24px', borderLeft: i === 0 ? '1.5px solid var(--green-border)' : 'none', borderRight: '1.5px solid var(--green-border)', position: 'relative' }}>
                  <div className="bebas" style={{ fontSize: 80, lineHeight: 1, color: 'var(--green-border)', marginBottom: -16, userSelect: 'none' }}>{s.num}</div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(26,107,60,0.1)', border: '1px solid rgba(26,107,60,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                      <span style={{ color: 'var(--green)', fontSize: '0.75rem', fontWeight: 700 }}>{i + 1}</span>
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 10, color: 'var(--text-dark)' }}>{s.title}</h3>
                    <p style={{ color: 'var(--text-mid)', fontSize: '0.875rem', lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ───────────────────────────────────── */}
        <section style={{ padding: '100px 32px', maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--green)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Real Riders</div>
            <h2 className="bebas" style={{ fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 1, color: 'var(--text-dark)' }}>
              STRAIGHT FROM THE<br />
              <span style={{ color: 'var(--green)' }}>ROAD</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="testi-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--green-pale)', border: '1.5px solid var(--green-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '1.2rem' }}>🧑</span>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-dark)' }}>{t.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.city} · {t.years}</div>
                    </div>
                  </div>
                  <span className="earnings-badge">{t.earnings}</span>
                </div>
                <div style={{ color: 'var(--text-mid)', lineHeight: 1.7, fontSize: '0.9rem', position: 'relative', paddingLeft: 20 }}>
                  <span style={{ position: 'absolute', left: 0, top: -4, fontSize: '2rem', color: 'var(--green)', lineHeight: 1, opacity: 0.3 }}>"</span>
                  {t.text}
                </div>
                <div style={{ display: 'flex', gap: 2, marginTop: 20 }}>
                  {[...Array(5)].map((_, si) => (
                    <svg key={si} width="14" height="14" viewBox="0 0 20 20" fill="var(--green)"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ─────────────────────────────────────── */}
        <section style={{
          margin: '0 32px 80px', borderRadius: 24,
          background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--green) 60%, var(--green-light) 100%)',
          padding: '64px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 32, position: 'relative', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(26,107,60,0.25)',
        }}>
          <div style={{ position: 'absolute', right: -40, top: -40, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', right: 80, bottom: -80, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ position: 'relative' }}>
            <h2 className="bebas" style={{ fontSize: 'clamp(36px, 4vw, 56px)', color: '#fff', lineHeight: 1, marginBottom: 8 }}>
              READY TO HIT THE ROAD?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem' }}>Join 10,000+ riders already earning with OyaEat today.</p>
          </div>
          <Link href="/rider/register" style={{
            background: '#fff', color: 'var(--green)',
            fontFamily: 'DM Sans', fontWeight: 700, fontSize: '1rem',
            padding: '16px 36px', border: 'none', borderRadius: 10, cursor: 'pointer',
            transition: 'all 0.2s', whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            textDecoration: 'none', display: 'inline-block',
          }}>
            Start Earning Now →
          </Link>
        </section>

        {/* ── FAQ ────────────────────────────────────────────── */}
        <section style={{ padding: '0 32px 100px', maxWidth: 800, margin: '0 auto' }}>
          <div style={{ marginBottom: 48, textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--green)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>FAQ</div>
            <h2 className="bebas" style={{ fontSize: 'clamp(40px, 5vw, 56px)', color: 'var(--text-dark)' }}>GOT QUESTIONS?</h2>
          </div>

          <div>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-btn" onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>
                  <span>{faq.question}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                    style={{ transform: openFAQ === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', flexShrink: 0, color: 'var(--green)' }}>
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {openFAQ === i && (
                  <div style={{ paddingBottom: 24, color: 'var(--text-mid)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────── */}
        <footer style={{ borderTop: '1.5px solid var(--green-border)', padding: '64px 32px 40px', background: 'var(--green-pale)' }}>
          <div style={{ maxWidth: 1300, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 48 }}>
              <div>
                <div className="bebas" style={{ fontSize: 28, marginBottom: 12, color: 'var(--text-dark)' }}>
                  <span style={{ color: 'var(--green)' }}>Oya</span>Eat
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 240 }}>
                  Nigeria's fastest growing food delivery platform. Connecting riders to opportunity.
                </p>
              </div>

              {[
                { title: 'Quick Links', items: ['Home', 'About Us', 'How it Works', 'Contact'] },
                { title: 'For Riders', items: ['Rider Signup', 'Rider Login', 'Payout Info', 'Insurance', 'Support'] },
                { title: 'For Vendors', items: ['Partner Signup', 'Vendor Dashboard', 'Marketing Tools', 'Partner Stories'] },
              ].map(col => (
                <div key={col.title}>
                  <h4 style={{ fontWeight: 700, marginBottom: 20, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-mid)' }}>{col.title}</h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {col.items.map(item => (
                      <li key={item}>
                        <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                          onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--green)'}
                          onMouseLeave={e => (e.target as HTMLElement).style.color = 'var(--text-muted)'}>
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1.5px solid var(--green-border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>© 2026 OyaEat. All rights reserved.</p>
              <div style={{ display: 'flex', gap: 24 }}>
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                  <a key={item} href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--green)'}
                    onMouseLeave={e => (e.target as HTMLElement).style.color = 'var(--text-muted)'}>
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default RiderSignup;