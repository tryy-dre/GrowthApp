'use client'

import { useState, useEffect } from 'react'
import { addQuestion } from '../userActions'
import { Send, Loader2, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react'

export default function QuestionForm() {
  const [category, setCategory] = useState('')
  const [question, setQuestion] = useState('')
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
    if (!category) {
      setError('Pilih kategori terlebih dahulu.')
      return
    }
    if (question.trim().length < 10) {
      setError('Isi pertanyaan minimal 10 karakter.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await addQuestion(category, question)
      if (res.error) {
        setError(res.error)
      } else {
        setSuccess(res.message || 'Pertanyaan berhasil dikirim!')
        setQuestion('')
        setCategory('')
      }
    } catch {
      setError('Gagal mengirim pertanyaan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500">
          <HelpCircle className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-800">Ajukan Pertanyaan</h3>
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
          <label htmlFor="q_category" className="text-xs font-semibold text-slate-500 block mb-1.5">
            Kategori Pertanyaan
          </label>
          <select
            id="q_category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            required
            disabled={loading}
          >
            <option value="" disabled>Pilih kategori...</option>
            <option value="hubungan">💕 Hubungan</option>
            <option value="pertemanan">🤝 Pertemanan</option>
            <option value="masalah_lain">🌊 Masalah Lain</option>
          </select>
        </div>

        <div>
          <label htmlFor="q_question" className="text-xs font-semibold text-slate-500 block mb-1.5">
            Pertanyaanmu
          </label>
          <textarea
            id="q_question"
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Tuliskan pertanyaanmu di sini... Komunitas siap membantu! 💬"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !category || question.trim().length < 10}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-600/10"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Kirim Pertanyaan</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
