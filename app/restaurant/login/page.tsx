'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, Mail, Lock, ArrowRight } from 'lucide-react'
import Image from 'next/image'

// ── Brand tokens ──────────────────────────────────────────────────────────────
const C = {
  green: '#1B4332',
  greenMid: '#2D6A4F',
  greenLight: '#52B788',
  amber: '#D4860B',
  bg: '#F5F1EB',
  white: '#FFFFFF',
  textDark: 'inherit',
  textMuted: '#6B7C6E',
  border: '#D8E4DC',
  error: '#C0392B',
}

// ── Left panel (FULL-BLEED IMAGE) ─────────────────────────────────────────────
function IllustrationPanel() {
  return (
    <div
      className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden"
      style={{ minHeight: '100%', backgroundColor: C.green }}
    >
      {/* Full background image */}
      <div className="absolute inset-0">
        <Image
          src="/landing/vendor.png"
          alt="OyaEat vendor managing orders"
          fill
          className="object-cover"
          priority
        />

        {/* Brand overlay for readability */}
      
      </div>

      {/* Decorative circles (subtle) */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-15"
        style={{ backgroundColor: C.greenMid }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full opacity-10"
        style={{ backgroundColor: C.greenLight }}
      />
      <div
        className="absolute top-1/2 right-8 w-24 h-24 rounded-full opacity-10"
        style={{ backgroundColor: C.greenLight }}
      />

      {/* Brand mark */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div>
            <p className="text-white text-lg font-black tracking-tight">Oya-Eat</p>
            <p
              className="text-xs font-semibold tracking-[0.2em]"
              style={{ color: C.greenLight }}
            >
              VENDOR PORTAL
            </p>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="relative z-10 max-w-md">
        <p className="text-white text-2xl font-black leading-snug tracking-tight mb-2">
          Manage your restaurant,<br />
          grow your business.
        </p>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
          Orders, menu, analytics — all in one place.
        </p>
      </div>
    </div>
  )
}

// ── Field ─────────────────────────────────────────────────────────────────────
function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  disabled,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  icon: React.ElementType
  disabled?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="mb-4">
      <label
        className="block text-xs font-bold uppercase tracking-widest mb-2"
        style={{ color: C.textDark }}
      >
        {label}
      </label>

      <div
        className="flex items-center gap-3 rounded-xl border transition-all duration-200 overflow-hidden"
        style={{
          borderColor: focused ? C.greenMid : C.border,
          backgroundColor: C.white,
          boxShadow: focused ? `0 0 0 3px ${C.greenMid}18` : undefined,
        }}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="pl-4">
          <Icon
            className="h-4 w-4 flex-shrink-0"
            style={{ color: focused ? C.greenMid : C.textMuted }}
          />
        </div>

        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 py-3 pr-4 text-sm bg-transparent outline-none"
          style={{ color: C.textDark }}
        />
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Invalid email or password')

      if (data?.token) {
        try {
          localStorage.setItem('authToken', data.token)
        } catch {}
      }

      if (data?.dashboard) {
        try {
          localStorage.setItem('dashboard', JSON.stringify(data.dashboard))
        } catch {}
      }

      router.push('/restaurant/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: C.bg }}>
      {/* Left: full-bleed image panel */}
      <div className="lg:w-1/2">
        <IllustrationPanel />
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile brand (hidden on lg) */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: C.green }}
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
                OyaEat
              </p>
              <p
                className="text-xs font-semibold tracking-widest"
                style={{ color: C.textMuted }}
              >
                VENDOR PORTAL
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1
              className="text-2xl font-black tracking-tight mb-1"
              style={{ color: C.textDark }}
            >
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: C.textMuted }}>
              Sign in to your vendor account to continue.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-5 flex items-start gap-3 rounded-xl border px-4 py-3"
              style={{ borderColor: '#FECACA', backgroundColor: '#FEF2F2' }}
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
          <form onSubmit={handleLogin}>
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@restaurant.com"
              icon={Mail}
              disabled={loading}
            />

            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              icon={Lock}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-opacity"
              style={{
                backgroundColor: C.green,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
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

          {/* Footer */}
          <p className="mt-6 text-center text-sm" style={{ color: C.textMuted }}>
            Don&apos;t have an account?{' '}
            <Link href="/" className="font-bold hover:underline" style={{ color: C.green }}>
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}