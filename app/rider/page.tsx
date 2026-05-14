"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Zap, CircleDollarSign, User, Bike } from "lucide-react";

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
        /* ── FONTS ─────────────────────────────────────────────
           Display: Playfair Display — elegant serif, graceful contrast,
                    warm authority without shouting
           Body:    Lato — clean humanist sans, calm & highly readable
        ────────────────────────────────────────────────────── */
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400&display=swap');

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

          --font-display: 'Playfair Display', Georgia, serif;
          --font-body: 'Lato', sans-serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: var(--font-body);
          background: var(--white);
          color: var(--text-dark);
          -webkit-font-smoothing: antialiased;
        }

        .dot-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.35;
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
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        .fade-up { animation: fadeUp 0.75s cubic-bezier(0.22,1,0.36,1) both; }
        .delay-1 { animation-delay: 0.12s; }
        .delay-2 { animation-delay: 0.24s; }
        .delay-3 { animation-delay: 0.36s; }
        .delay-4 { animation-delay: 0.48s; }

        .nav-link {
          position: relative;
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
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
          height: 1.5px;
          width: 0;
          background: var(--green);
          transition: width 0.25s ease;
        }
        .nav-link:hover::after { width: 100%; }

        .btn-primary {
          background: var(--green);
          color: #fff;
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.875rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 14px 32px;
          border: none;
          border-radius: 6px;
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
          border: 1px solid var(--green-border);
          border-radius: 12px;
          padding: 36px 32px;
          transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
          position: relative;
          overflow: hidden;
        }
        .perk-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--green);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .perk-card:hover {
          border-color: var(--green);
          transform: translateY(-4px);
          box-shadow: 0 16px 40px var(--shadow-green);
        }
        .perk-card:hover::before { opacity: 1; }

        .faq-item {
          border-bottom: 1px solid var(--green-border);
        }
        .faq-btn {
          width: 100%;
          padding: 22px 0;
          text-align: left;
          background: transparent;
          border: none;
          color: var(--text-dark);
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 0.01em;
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
          border: 1px solid var(--green-border);
          border-radius: 12px;
          padding: 32px;
          transition: box-shadow 0.3s, transform 0.3s;
        }
        .testi-card:hover {
          box-shadow: 0 12px 36px var(--shadow-green);
          transform: translateY(-2px);
        }

        .earnings-badge {
          background: var(--green-pale);
          border: 1px solid var(--green-border);
          color: var(--green);
          font-family: var(--font-body);
          font-weight: 900;
          font-size: 0.78rem;
          letter-spacing: 0.04em;
          padding: 4px 12px;
          border-radius: 20px;
          display: inline-block;
          white-space: nowrap;
        }

        .ticker-wrap {
          overflow: hidden;
          background: var(--green);
          padding: 11px 0;
          white-space: nowrap;
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .ticker-inner {
          display: inline-flex;
          animation: ticker 22s linear infinite;
        }
        .ticker-text {
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.9);
        }
      `}</style>

      <div className="dot-grid" />

      <div style={{ position: 'relative', zIndex: 1, background: 'transparent', minHeight: '100vh' }}>

        {/* ── NAVBAR ─────────────────────────────────────────── */}
        <nav style={{
          position: 'fixed', top: 0, width: '100%', zIndex: 50,
          borderBottom: '1px solid var(--green-border)',
          backdropFilter: 'blur(14px)',
          background: 'rgba(255,255,255,0.92)',
        }}>
          <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
            {/* Logo with Text - BIGGER */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-26 h-26 transition-transform duration-300 group-hover:scale-110">
            {/* <Image
              src={logo}
              alt="OyaEat Logo"
              fill
              className="object-contain"
              priority
            /> */}
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black leading-none tracking-tight">
              <span className="text-[#2d5f4f]">Oya</span>
              <span className={`transition-colors duration-300 scrolled ? "text-gray-800" : "text-gray-900"`}>Eat</span>
            </span>
            <span className={`text-[10px] font-medium tracking-wider uppercase transition-colors duration-300 scrolled ? "text-gray-500" : "text-gray-600"`}>
              Fast Delivery
            </span>
          </div>
        </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
              {navLinks.map(l => (
                <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Link href="/rider/login" style={{
                padding: '9px 20px',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.8rem',
                letterSpacing: '0.05em', textTransform: 'uppercase',
                color: 'var(--green)', border: '1px solid var(--green-border)', borderRadius: 6,
                textDecoration: 'none', transition: 'all 0.2s', background: 'transparent',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--green-pale)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                Login
              </Link>
              <Link href="/rider/register" className="btn-primary" style={{ padding: '9px 22px', fontSize: '0.8rem' }}>
                Start Riding →
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ───────────────────────────────────────────── */}
        <section style={{
          paddingTop: 70, minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, #fff 0%, var(--green-pale) 60%, var(--green-pale2) 100%)',
        }}>
          <div className="orb" style={{ width: 560, height: 560, background: 'rgba(26,107,60,0.07)', top: -80, right: -160 }} />
          <div className="orb" style={{ width: 360, height: 360, background: 'rgba(34,136,63,0.05)', bottom: 0, left: -80 }} />

          <div style={{ maxWidth: 1300, margin: '0 auto', padding: '80px 32px', display: 'flex', gap: 72, alignItems: 'center', width: '100%' }}>

            {/* Left */}
            <div style={{ flex: 1 }}>
              <div className="fade-up" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(26,107,60,0.07)', border: '1px solid rgba(26,107,60,0.2)',
                borderRadius: 20, padding: '6px 16px', marginBottom: 28,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulse-ring 1.5s ease infinite' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--green)' }}>
                  Now hiring riders in Lagos, Abuja & PH
                </span>
              </div>

              {/* Playfair Display headline — mix upright + italic for calm elegance */}
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(52px, 7.5vw, 88px)',
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                marginBottom: 28,
                color: 'var(--text-dark)',
              }} className="fade-up delay-1">
                Ride.<br />
                <em style={{ color: 'var(--green)', fontStyle: 'italic', fontWeight: 700 }}>Earn.</em><br />
                Repeat.
              </h1>

              <p className="fade-up delay-2" style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.05rem',
                fontWeight: 300,
                color: 'var(--text-mid)',
                lineHeight: 1.8,
                maxWidth: 460,
                marginBottom: 40,
              }}>
                Turn your motorcycle, bicycle, or car into a money machine. Deliver with OyaEat and earn on your own terms — no boss, no fixed hours, no cap on income.
              </p>

              <div className="fade-up delay-3" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <Link href="/rider/register" className="btn-primary" style={{ fontSize: '0.875rem', padding: '15px 36px' }}>
                  Join as a Rider
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
                <Link href="/rider/login" style={{
                  background: 'transparent', border: '1px solid var(--green-border)',
                  color: 'var(--text-mid)', padding: '15px 24px', borderRadius: 6,
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.8rem',
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                  transition: 'all 0.2s', textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--green)'; (e.currentTarget as HTMLElement).style.color = 'var(--green)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--green-border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-mid)'; }}>
                  Already a rider? Login
                </Link>
              </div>

              {/* Mini stats */}
              <div className="fade-up delay-4" style={{ display: 'flex', gap: 48, marginTop: 60, paddingTop: 40, borderTop: '1px solid var(--green-border)' }}>
                {[['10,000+', 'Active Riders'], ['₦50K+', 'Top Monthly Earning'], ['24hrs', 'Avg. Approval Time']].map(([val, label]) => (
                  <div key={label}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--green)', lineHeight: 1.1 }}>{val}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 5 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: CTA card */}
            <div style={{ width: 400, flexShrink: 0 }}>
              <div style={{
                background: '#fff',
                border: '1px solid var(--green-border)',
                borderRadius: 16,
                padding: 36,
                position: 'relative',
                boxShadow: '0 20px 56px rgba(26,107,60,0.10)',
                textAlign: 'center',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--green)', borderRadius: '16px 16px 0 0', opacity: 0.7 }} />

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}><Bike size={56} className="text-[#1A6B3C]" /></div>

                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: 10, lineHeight: 1.25 }}>
                  Ready to earn?
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 28, lineHeight: 1.75 }}>
                  Join thousands of riders making real money on their own schedule. Free to join, approved in 24 hours.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Link href="/rider/register" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '14px' }}>
                    Apply to Ride →
                  </Link>
                  <Link href="/rider/login" style={{
                    display: 'block', padding: '13px', border: '1px solid var(--green-border)', borderRadius: 6,
                    textAlign: 'center', color: 'var(--text-mid)',
                    fontFamily: 'var(--font-body)', fontWeight: 700,
                    fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase',
                    textDecoration: 'none', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--green)'; (e.currentTarget as HTMLElement).style.color = 'var(--green)'; (e.currentTarget as HTMLElement).style.background = 'var(--green-pale)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--green-border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-mid)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                    Already a rider? Sign in
                  </Link>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--green-border)' }}>
                  {[
                    { icon: <CheckCircle2 size={18} className="mx-auto text-[#1A6B3C]" />, text: 'Free signup' },
                    { icon: <Zap size={18} className="mx-auto text-[#1A6B3C]" />, text: '24hr approval' },
                    { icon: <CircleDollarSign size={18} className="mx-auto text-[#1A6B3C]" />, text: 'Daily pay' }
                  ].map((item, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ marginBottom: 5 }}>{item.icon}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{item.text}</div>
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
              <span key={i} className="ticker-text">
                {['Ride Your Way', 'Earn Daily', 'No Fixed Hours', 'Free to Join', 'Insured Riders', 'Fast Payout', '10,000+ Riders'].map(t => (
                  <span key={t} style={{ marginRight: 52 }}>
                    {t} <span style={{ color: 'rgba(255,255,255,0.3)', marginRight: 52 }}>◆</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ── PERKS ──────────────────────────────────────────── */}
        <section style={{ padding: '100px 32px', maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 14 }}>Why OyaEat</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(36px, 4.5vw, 56px)', lineHeight: 1.1, color: 'var(--text-dark)' }}>
              Perks that actually <em style={{ color: 'var(--green)', fontStyle: 'italic', fontWeight: 700 }}>make sense</em>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {perks.map((p, i) => (
              <div key={i} className="perk-card">
                <div style={{ color: 'var(--green)', marginBottom: 20 }}>{p.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 38, color: 'var(--green)', lineHeight: 1, marginBottom: 10 }}>{p.stat}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', marginBottom: 10, color: 'var(--text-dark)' }}>{p.title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.75 }}>{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ───────────────────────────────────── */}
        <section style={{ background: 'var(--green-pale)', padding: '100px 32px', borderTop: '1px solid var(--green-border)', borderBottom: '1px solid var(--green-border)' }}>
          <div style={{ maxWidth: 1300, margin: '0 auto' }}>
            <div style={{ marginBottom: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 14 }}>The Process</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(36px, 4.5vw, 56px)', lineHeight: 1.1, color: 'var(--text-dark)' }}>
                  Go from zero to <em style={{ color: 'var(--green)', fontStyle: 'italic', fontWeight: 700 }}>earning</em><br />in 4 simple steps
                </h2>
              </div>
              <Link href="/rider/register" className="btn-primary">Apply Now →</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
              {steps.map((s, i) => (
                <div key={i} style={{
                  padding: '32px 28px',
                  borderLeft: i === 0 ? '1px solid var(--green-border)' : 'none',
                  borderRight: '1px solid var(--green-border)',
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 72, lineHeight: 1, color: 'var(--green-border)', marginBottom: -12, userSelect: 'none' }}>{s.num}</div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: 'rgba(26,107,60,0.1)', border: '1px solid rgba(26,107,60,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                    }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 900, color: 'var(--green)', fontSize: '0.75rem' }}>{i + 1}</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 10, color: 'var(--text-dark)' }}>{s.title}</h3>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'var(--text-mid)', fontSize: '0.875rem', lineHeight: 1.8 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ───────────────────────────────────── */}
        <section style={{ padding: '100px 32px', maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 14 }}>Real Riders</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(36px, 4.5vw, 56px)', lineHeight: 1.1, color: 'var(--text-dark)' }}>
              Straight from <em style={{ color: 'var(--green)', fontStyle: 'italic', fontWeight: 700 }}>the road</em>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="testi-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--green-pale)', border: '1px solid var(--green-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={18} className="text-[#1A6B3C]" />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-dark)' }}>{t.name}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{t.city} · {t.years}</div>
                    </div>
                  </div>
                  <span className="earnings-badge">{t.earnings}</span>
                </div>
                {/* Playfair italic is stunning for testimonial quotes */}
                <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, color: 'var(--text-mid)', lineHeight: 1.75, fontSize: '0.975rem', position: 'relative', paddingLeft: 20 }}>
                  <span style={{ position: 'absolute', left: 0, top: -8, fontSize: '2.5rem', color: 'var(--green)', lineHeight: 1, opacity: 0.2, fontFamily: 'var(--font-display)' }}>"</span>
                  {t.text}
                </div>
                <div style={{ display: 'flex', gap: 3, marginTop: 20 }}>
                  {[...Array(5)].map((_, si) => (
                    <svg key={si} width="13" height="13" viewBox="0 0 20 20" fill="var(--green)"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ─────────────────────────────────────── */}
        <section style={{
          margin: '0 32px 80px', borderRadius: 20,
          background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--green) 60%, var(--green-light) 100%)',
          padding: '64px 56px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 32, position: 'relative', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(26,107,60,0.25)',
        }}>
          <div style={{ position: 'absolute', right: -40, top: -40, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', right: 100, bottom: -80, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ position: 'relative' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(30px, 3.5vw, 48px)', color: '#fff', lineHeight: 1.15, marginBottom: 10 }}>
              Ready to hit the road?
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.75)', fontSize: '1rem' }}>Join 10,000+ riders already earning with OyaEat today.</p>
          </div>
          <Link href="/rider/register" style={{
            background: '#fff', color: 'var(--green)',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.85rem',
            letterSpacing: '0.06em', textTransform: 'uppercase',
            padding: '15px 36px', border: 'none', borderRadius: 6, cursor: 'pointer',
            transition: 'all 0.2s', whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            textDecoration: 'none', display: 'inline-block',
          }}>
            Start Earning Now →
          </Link>
        </section>

        {/* ── FAQ ────────────────────────────────────────────── */}
        <section style={{ padding: '0 32px 100px', maxWidth: 760, margin: '0 auto' }}>
          <div style={{ marginBottom: 52, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 14 }}>FAQ</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(34px, 4vw, 50px)', color: 'var(--text-dark)', lineHeight: 1.1 }}>
              Got <em style={{ color: 'var(--green)', fontStyle: 'italic' }}>questions?</em>
            </h2>
          </div>

          <div>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-btn" onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>
                  <span>{faq.question}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                    style={{ transform: openFAQ === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', flexShrink: 0, color: 'var(--green)' }}>
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {openFAQ === i && (
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 300, paddingBottom: 24, color: 'var(--text-mid)', fontSize: '0.95rem', lineHeight: 1.85 }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────── */}
        <footer style={{ borderTop: '1px solid var(--green-border)', padding: '64px 32px 40px', background: 'var(--green-pale)' }}>
          <div style={{ maxWidth: 1300, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 48 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, marginBottom: 14, color: 'var(--text-dark)', lineHeight: 1 }}>
                  <span style={{ color: 'var(--green)' }}>Oya</span>-Eat
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.8, maxWidth: 240 }}>
                  Nigeria's fastest growing food delivery platform. Connecting riders to opportunity.
                </p>
              </div>

              {[
                { title: 'Quick Links', items: ['Home', 'About Us', 'How it Works', 'Contact'] },
                { title: 'For Riders', items: ['Rider Signup', 'Rider Login', 'Payout Info', 'Insurance', 'Support'] },
                { title: 'For Vendors', items: ['Partner Signup', 'Vendor Dashboard', 'Marketing Tools', 'Partner Stories'] },
              ].map(col => (
                <div key={col.title}>
                  <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: 20, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-mid)' }}>{col.title}</h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {col.items.map(item => (
                      <li key={item}>
                        <a href="#" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
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

            <div style={{ borderTop: '1px solid var(--green-border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'var(--text-muted)', fontSize: '0.8rem' }}>© 2026 OyaEat. All rights reserved.</p>
              <div style={{ display: 'flex', gap: 24 }}>
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                  <a key={item} href="#" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' }}
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