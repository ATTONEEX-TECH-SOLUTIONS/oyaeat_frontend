'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react'

// ── Brand tokens ──────────────────────────────────────────────────────────────
const C = {
  green:      '#1B4332',
  greenMid:   '#2D6A4F',
  greenLight: '#52B788',
  bg:         '#F5F1EB',
  white:      '#FFFFFF',
  textDark:   '#111C14',
  textMuted:  '#6B7C6E',
  border:     '#D8E4DC',
  error:      '#C0392B',
}

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// ── Admin illustration ────────────────────────────────────────────────────────
function IllustrationPanel() {
  return (
    <div
      className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden"
      style={{ backgroundColor: C.green, minHeight: '100%' }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20"
           style={{ backgroundColor: C.greenMid }} />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-15"
           style={{ backgroundColor: C.greenLight }} />
      <div className="absolute top-1/3 right-12 w-20 h-20 rounded-full opacity-10"
           style={{ backgroundColor: C.greenLight }} />

      {/* Brand */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          {/* <div className="w-9 h-9 rounded-xl flex items-center justify-center"
               style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <svg width="14" height="18" viewBox="0 0 16 20" fill="none">
              <path d="M9 1L1 11h7l-1 8 8-10H8l1-8z" fill="white" />
            </svg>
          </div> */}
          <div>
            <p className="text-white text-lg font-black tracking-tight">OyaEat</p>
            <p className="text-xs font-semibold tracking-[0.2em]" style={{ color: C.greenLight }}>
              SUPER ADMIN
            </p>
          </div>
        </div>
      </div>

      {/* Illustration — dashboard/control panel concept */}
      <div className="relative z-10 flex items-center justify-center flex-1 py-8">
        <svg viewBox="0 0 300 300" className="w-64 h-64" fill="none" xmlns="http://www.w3.org/2000/svg">

          {/* Main dashboard card */}
          <rect x="30" y="60" width="240" height="180" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

          {/* Top bar of card */}
          <rect x="30" y="60" width="240" height="36" rx="14" fill="rgba(255,255,255,0.12)" />
          <rect x="30" y="82" width="240" height="14" fill="rgba(255,255,255,0.06)" />
          {/* Traffic light dots */}
          <circle cx="52" cy="78" r="5" fill="rgba(255,255,255,0.25)" />
          <circle cx="67" cy="78" r="5" fill="rgba(255,255,255,0.15)" />
          <circle cx="82" cy="78" r="5" fill="rgba(255,255,255,0.1)" />
          {/* Title bar text stub */}
          <rect x="100" y="74" width="60" height="6" rx="3" fill="rgba(255,255,255,0.2)" />

          {/* Stat row */}
          <rect x="46" y="112" width="58" height="38" rx="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <rect x="121" y="112" width="58" height="38" rx="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <rect x="196" y="112" width="58" height="38" rx="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          {/* Stat numbers */}
          <rect x="54" y="118" width="24" height="10" rx="3" fill="rgba(255,255,255,0.35)" />
          <rect x="54" y="132" width="36" height="6" rx="3" fill="rgba(255,255,255,0.15)" />
          <rect x="129" y="118" width="20" height="10" rx="3" fill={C.greenLight} opacity="0.6" />
          <rect x="129" y="132" width="36" height="6" rx="3" fill="rgba(255,255,255,0.15)" />
          <rect x="204" y="118" width="28" height="10" rx="3" fill="rgba(255,255,255,0.35)" />
          <rect x="204" y="132" width="30" height="6" rx="3" fill="rgba(255,255,255,0.15)" />

          {/* Chart area */}
          <rect x="46" y="164" width="124" height="56" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          {/* Bar chart bars */}
          <rect x="58" y="196" width="10" height="16" rx="3" fill="rgba(255,255,255,0.2)" />
          <rect x="74" y="186" width="10" height="26" rx="3" fill={C.greenLight} opacity="0.5" />
          <rect x="90" y="191" width="10" height="21" rx="3" fill="rgba(255,255,255,0.2)" />
          <rect x="106" y="180" width="10" height="32" rx="3" fill={C.greenLight} opacity="0.7" />
          <rect x="122" y="188" width="10" height="24" rx="3" fill="rgba(255,255,255,0.2)" />
          <rect x="138" y="183" width="10" height="29" rx="3" fill={C.greenLight} opacity="0.5" />

          {/* Mini list on the right */}
          <rect x="184" y="164" width="70" height="56" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <rect x="192" y="175" width="40" height="5" rx="2.5" fill="rgba(255,255,255,0.3)" />
          <rect x="192" y="185" width="50" height="5" rx="2.5" fill="rgba(255,255,255,0.15)" />
          <rect x="192" y="195" width="34" height="5" rx="2.5" fill="rgba(255,255,255,0.2)" />
          <rect x="192" y="205" width="44" height="5" rx="2.5" fill="rgba(255,255,255,0.15)" />

          {/* Shield icon overlay — admin security */}
          <g transform="translate(128, 20)">
            <circle cx="22" cy="22" r="22" fill={C.greenMid} opacity="0.6" />
            <circle cx="22" cy="22" r="22" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
            {/* Shield path */}
            <path d="M22 11 L32 15.5 L32 22 C32 27.5 27.5 32.5 22 34.5 C16.5 32.5 12 27.5 12 22 L12 15.5 Z"
                  fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinejoin="round" />
            {/* Check in shield */}
            <path d="M17 22 L20.5 25.5 L27 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>

          {/* Grid dots decoration */}
          {[0,1,2,3,4].map(col => [0,1,2].map(row => (
            <circle
              key={`${col}-${row}`}
              cx={20 + col * 12}
              cy={250 + row * 12}
              r="1.5"
              fill="rgba(255,255,255,0.15)"
            />
          )))}
          {[0,1,2,3,4].map(col => [0,1,2].map(row => (
            <circle
              key={`r-${col}-${row}`}
              cx={228 + col * 12}
              cy={250 + row * 12}
              r="1.5"
              fill="rgba(255,255,255,0.15)"
            />
          )))}
        </svg>
      </div>

      {/* Quote */}
      <div className="relative z-10">
        <p className="text-white text-xl font-black leading-snug tracking-tight mb-2">
          Full control,<br />total visibility.
        </p>
        <p className="text-sm" style={{ color: C.greenLight }}>
          Manage every restaurant, rider, and order on the platform.
        </p>
      </div>
    </div>
  )
}

// ── Animated field ────────────────────────────────────────────────────────────
function Field({
  label, type, placeholder, icon: Icon, error,
  value, onChange, onBlur,
}: {
  label: string; type: string; placeholder: string
  icon: React.ElementType; error?: string
  value: string; onChange: (v: string) => void; onBlur: () => void
}) {
  const [focused, setFocused] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  return (
    <div className="mb-4">
      <label className="block text-xs font-bold uppercase tracking-widest mb-2"
             style={{ color: C.textDark }}>
        {label}
      </label>
      <div
        className="flex items-center gap-3 rounded-xl border transition-all duration-200 overflow-hidden cursor-text"
        style={{
          borderColor:     error ? C.error : focused ? C.greenMid : C.border,
          backgroundColor: C.white,
          boxShadow:       focused ? `0 0 0 3px ${error ? C.error : C.greenMid}18` : undefined,
        }}
        onClick={() => ref.current?.focus()}
      >
        <div className="pl-4">
          <Icon className="h-4 w-4 flex-shrink-0"
                style={{ color: error ? C.error : focused ? C.greenMid : C.textMuted }} />
        </div>
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={() => { onBlur(); setFocused(false) }}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          className="flex-1 py-3 pr-4 text-sm bg-transparent outline-none"
          style={{ color: C.textDark }}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium" style={{ color: C.error }}>{error}</p>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminLoginPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState<string | null>(null)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setError(null)
    setSubmitting(true)
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000'
    try {
      const res = await fetch(`${base}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) { setError('Invalid credentials. Please try again.'); return }
      const data = await res.json()
      if (data?.token) localStorage.setItem('admin_token', data.token)
      if (data?.admin)  localStorage.setItem('admin_user',  JSON.stringify(data.admin))
      router.replace('/superadmin/dashboard')
    } catch {
      setError('Network error. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const { register, handleSubmit, formState: { errors }, watch } = form
  const emailVal = watch('email')
  const passVal  = watch('password')

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
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                 style={{ backgroundColor: C.green }}>
              <svg width="14" height="18" viewBox="0 0 16 20" fill="none">
                <path d="M9 1L1 11h7l-1 8 8-10H8l1-8z" fill="white" />
              </svg>
            </div>
            <div>
              <p className="font-black text-base tracking-tight" style={{ color: C.textDark }}>OyaEats</p>
              <p className="text-xs font-semibold tracking-widest" style={{ color: C.textMuted }}>SUPER ADMIN</p>
            </div>
          </div>

          {/* Shield badge */}
          <div className="flex items-center gap-2 mb-6 rounded-xl border px-4 py-3 w-fit"
               style={{ borderColor: C.border, backgroundColor: C.white }}>
            <ShieldCheck className="h-4 w-4" style={{ color: C.greenMid }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: C.textMuted }}>
              Admin Access Only
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-black tracking-tight mb-1" style={{ color: C.textDark }}>
              Admin Sign In
            </h1>
            <p className="text-sm" style={{ color: C.textMuted }}>
              Sign in to access the super admin dashboard.
            </p>
          </div>

          {/* Global error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border px-4 py-3"
                 style={{ borderColor: '#FECACA', backgroundColor: '#FEF2F2' }}>
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: C.error }} />
              <p className="text-sm font-medium" style={{ color: C.error }}>{error}</p>
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
              onChange={v => form.setValue('email', v)}
              onBlur={() => form.trigger('email')}
            />
            <Field
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              error={errors.password?.message}
              value={passVal}
              onChange={v => form.setValue('password', v)}
              onBlur={() => form.trigger('password')}
            />

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-opacity"
              style={{ backgroundColor: C.green, opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
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
  )
}