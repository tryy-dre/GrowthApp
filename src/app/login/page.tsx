'use client'

import { useState } from 'react'
import { login, signup } from '@/app/auth/actions'
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Righteous } from 'next/font/google'

const righteous = Righteous({
  subsets: ['latin'],
  weight: '400',
})

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)

    try {
      if (isSignUp) {
        const res = await signup(formData)
        if (res?.error) {
          setError(res.error)
        } else if (res?.success) {
          setSuccess(res.message || 'Registration successful!')
          ;(e.target as HTMLFormElement).reset()
        }
      } else {
        const res = await login(formData)
        if (res?.error) {
          setError(res.error)
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row">
      
      {/* LEFT COLUMN: DESKTOP ONLY BRAND GRADIENT */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-600 relative items-center justify-center p-12 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[80px]" />

        {/* Content Box */}
        <div className="relative z-10 max-w-lg text-white space-y-8">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-indigo-100 text-xs tracking-wider uppercase">
            <span className={`${righteous.className} text-sm font-normal text-white`}>Growth Community</span>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img 
              src="/logo/NO BG.png" 
              alt="Growth Logo" 
              className="w-24 h-24 object-contain"
            />
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-none">
                Connect. Grow. Inspire.
              </h1>
              <p className="text-indigo-100 text-base lg:text-lg leading-relaxed">
                Join a warm, active community focused on sharing testimonies, praying for one another, and growing together in faith.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/20 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-xl bg-white/10 border border-white/10">
              <span className="block text-2xl font-bold text-white">100%</span>
              <span className="text-xs text-indigo-100">Supportive</span>
            </div>
            <div className="p-3 rounded-xl bg-white/10 border border-white/10">
              <span className="block text-2xl font-bold text-white">Real</span>
              <span className="text-xs text-indigo-100">Testimonies</span>
            </div>
            <div className="p-3 rounded-xl bg-white/10 border border-white/10">
              <span className="block text-2xl font-bold text-white">Active</span>
              <span className="text-xs text-indigo-100">Community</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: LOGIN/REGISTRATION FORM */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 md:w-1/2 lg:w-2/5 relative">
        {/* Mobile-Only Logo */}
        <div className="md:hidden flex flex-col items-center mb-8 text-center">
          <img 
            src="/logo/NO BG.png" 
            alt="Growth Logo" 
            className="w-20 h-20 object-contain mb-3"
          />
          <h2 className={`${righteous.className} text-3xl text-slate-800 tracking-wide`}>
            Growth Community
          </h2>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xl shadow-slate-100 relative">
          
          {/* Header */}
          <div className="mb-8 text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900">
              {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </h3>
            <p className="text-slate-500 text-sm mt-1.5">
              {isSignUp ? 'Sign up to connect with the community' : 'Please sign in to access your portal'}
            </p>
          </div>

          {/* Form State Tabs */}
          <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl border border-slate-200/50 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false)
                setError(null)
                setSuccess(null)
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                !isSignUp 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true)
                setError(null)
                setSuccess(null)
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                isSignUp 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Register
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3 text-emerald-700 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-1.5">
                <label htmlFor="nickname" className="text-xs font-medium text-slate-500">
                  Nickname
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    required
                    placeholder="ex: growth_member"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-slate-500">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium text-slate-500">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-55 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isSignUp ? 'Register Account' : 'Sign In'}</span>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 text-center text-xs text-slate-400 border-t border-slate-100 pt-6">
            <span>By accessing Growth, you agree to our Terms of Service.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
