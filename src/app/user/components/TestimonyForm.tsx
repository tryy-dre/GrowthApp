'use client'

import { useState, useEffect } from 'react'
import { addTestimony } from '../userActions'
import { Send, Loader2, AlertCircle, CheckCircle2, Star } from 'lucide-react'

export default function TestimonyForm() {
  const [content, setContent] = useState('')
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
    if (content.trim().length < 10) {
      setError('Isi kesaksian minimal 10 karakter.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await addTestimony(content)
      if (res.error) {
        setError(res.error)
      } else {
        setSuccess(res.message || 'Kesaksian berhasil dikirim!')
        setContent('')
      }
    } catch {
      setError('Gagal mengirim kesaksian. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
        <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
          <Star className="w-5 h-5 fill-amber-500" />
        </div>
        <h3 className="font-bold text-slate-800">Bagikan Kebaikan Tuhan</h3>
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
          <label htmlFor="testimony_content" className="text-xs font-semibold text-slate-500 block mb-1.5">
            Cerita Kesaksianmu
          </label>
          <textarea
            id="testimony_content"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ceritakan kebaikan Tuhan yang kamu alami... Setiap kesaksian adalah semangat bagi sesama! ✨"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || content.trim().length < 10}
          className="bg-amber-500 hover:bg-amber-400 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-500/10"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Bagikan Sekarang</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
