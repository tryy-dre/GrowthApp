'use client'

import { useState, useEffect } from 'react'
import { addPrayerRequest } from '../userActions'
import { Send, Loader2, AlertCircle, CheckCircle2, Heart, Lock } from 'lucide-react'

export default function PrayerForm() {
  const [request, setRequest] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
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
    if (request.trim().length < 10) {
      setError('Isi permohonan doa minimal 10 karakter.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await addPrayerRequest(request, isPrivate)
      if (res.error) {
        setError(res.error)
      } else {
        setSuccess(res.message || 'Permohonan doa berhasil dikirim!')
        setRequest('')
        setIsPrivate(false)
      }
    } catch {
      setError('Gagal mengirim permohonan doa. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
        <div className="p-2 bg-rose-50 rounded-lg text-rose-500">
          <Heart className="w-5 h-5 fill-rose-500" />
        </div>
        <h3 className="font-bold text-slate-800">Tulis Permohonan Doa</h3>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3 text-emerald-700 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="p_request" className="text-xs font-semibold text-slate-500 block mb-1.5">
            Permohonan Doamu
          </label>
          <textarea
            id="p_request"
            rows={5}
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="Tuliskan permohonan doamu... Kami akan mendoakanmu bersama! 🙏"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
            required
            disabled={loading}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              id="p_private"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              disabled={loading}
              className="w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500 focus:ring-1 cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              Jadikan Privat <span className="text-slate-400 font-normal">(hanya admin yang bisa melihat)</span>
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || request.trim().length < 10}
          className="bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-rose-500/10"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Kirim Permohonan Doa</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
