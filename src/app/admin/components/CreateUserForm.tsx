'use client'

import { useState, useEffect } from 'react'
import { createNewUserAction } from '../adminActions'
import { UserPlus, ChevronDown, ChevronUp, Mail, User, Lock, Shield, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function CreateUserForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [success])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !nickname || !password || !role) {
      setError('Semua kolom wajib diisi.')
      return
    }

    if (password.length < 6) {
      setError('Password minimal harus 6 karakter.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('nickname', nickname)
      formData.append('password', password)
      formData.append('role', role)

      const res = await createNewUserAction(formData)
      if (res?.error) {
        setError(res.error)
      } else {
        setSuccess(res?.message || 'User baru berhasil dibuat!')
        setEmail('')
        setNickname('')
        setPassword('')
        setRole('user')
      }
    } catch {
      setError('Gagal membuat user baru. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 transition-all duration-300">
      {/* Header / Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 group-hover:bg-indigo-100 rounded-xl text-indigo-600 transition-colors">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">Tambah Pengguna Baru</h3>
            <p className="text-xs text-slate-400 font-medium">Buat akun baru untuk admin atau user komunitas</p>
          </div>
        </div>
        <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Collapsible Form */}
      <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[500px] mt-6 pt-6 border-t border-slate-100 opacity-100' : 'max-h-0 opacity-0'}`}>
        {error && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3 text-emerald-700 text-sm animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="newUserEmail" className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wide">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                id="newUserEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh: budi@growth.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="newUserNickname" className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wide">
              Nickname (Username)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                id="newUserNickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="contoh: budisetiadi"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="newUserPassword" className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                id="newUserPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="newUserRole" className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wide">
              Pilih Role
            </label>
            <div className="relative">
              <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                id="newUserRole"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition cursor-pointer font-medium"
                required
                disabled={loading}
              >
                <option value="user">User (Member)</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={loading || !email || !nickname || !password}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-500/15"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses Pembuatan...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Buat Akun Pengguna</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
