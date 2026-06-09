import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import React from 'react'
import Link from 'next/link'
import UserLayoutShell from './components/UserLayoutShell'
import TestimonyForm from './components/TestimonyForm'
import QuestionForm from './components/QuestionForm'
import PrayerForm from './components/PrayerForm'
import DeleteButton from './components/DeleteButton'
import { deleteTestimony, deleteQuestion, deletePrayerRequest } from './userActions'
import { 
  Sun, 
  Sparkles, 
  Heart, 
  Clock, 
  Lock, 
  Globe, 
  Compass, 
  ArrowRight,
  HelpCircle
} from 'lucide-react'

// Types for Supabase entities
interface Testimony {
  id: number
  user_id: string
  content: string
  created_at: string
}

interface Question {
  id: number
  user_id: string
  category: string
  question: string
  created_at: string
}

interface PrayerRequest {
  id: number
  user_id: string
  request: string
  is_private: boolean
  created_at: string
}

function formatDate(dateString: string) {
  const d = new Date(dateString)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getCategoryLabel(category: string) {
  switch (category) {
    case 'hubungan': return '💕 Hubungan'
    case 'pertemanan': return '🤝 Pertemanan'
    case 'masalah_lain': return '🌊 Masalah Lain'
    default: return category
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'hubungan': return 'bg-pink-50 text-pink-600 border-pink-100'
    case 'pertemanan': return 'bg-indigo-50 text-indigo-600 border-indigo-100'
    case 'masalah_lain': return 'bg-blue-50 text-blue-600 border-blue-100'
    default: return 'bg-slate-50 text-slate-600 border-slate-100'
  }
}

export default async function UserPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const supabase = createClient()

  // Get current authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get profile information
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const activePage = searchParams.page || 'home'

  // Fetch counts specific to the logged-in user
  const { count: testimoniesCount } = await supabase
    .from('testimonies')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: questionsCount } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: prayersCount } = await supabase
    .from('prayer_requests')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Fetch actual data lists based on the active tab
  let testimonies: Testimony[] = []
  let questions: Question[] = []
  let prayers: PrayerRequest[] = []

  if (activePage === 'testimony') {
    const { data } = await supabase
      .from('testimonies')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    testimonies = data || []
  } else if (activePage === 'questions') {
    const { data } = await supabase
      .from('questions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    questions = data || []
  } else if (activePage === 'prayer') {
    const { data } = await supabase
      .from('prayer_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    prayers = data || []
  }

  // Calculate WIB (Asia/Jakarta) time greeting
  const utcHour = new Date().getUTCHours()
  const wibHour = (utcHour + 7) % 24
  let greeting = 'Selamat Malam'
  if (wibHour >= 5 && wibHour < 12) {
    greeting = 'Selamat Pagi'
  } else if (wibHour >= 12 && wibHour < 17) {
    greeting = 'Selamat Siang'
  }

  const initials = profile?.nickname
    ? profile.nickname.slice(0, 2).toUpperCase()
    : 'US'

  return (
    <UserLayoutShell
      nickname={profile?.nickname || 'User'}
      email={user.email || ''}
      activePage={activePage}
    >
      {/* HOME PAGE */}
      {activePage === 'home' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Welcome Greeting Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50/50 border border-indigo-100/80 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-2xl font-bold text-white shadow-md shrink-0">
              {initials}
            </div>
            <div className="text-center md:text-left flex-1 space-y-3">
              <div className="flex justify-center md:justify-start items-center gap-1.5 text-xs text-indigo-600 font-bold tracking-wide uppercase">
                <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{greeting}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Halo, <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{profile?.nickname || 'User'}</span>! 👋
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed italic max-w-3xl">
                &ldquo;Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, demikianlah firman Tuhan, yaitu rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan.&rdquo;
              </p>
              <span className="block text-amber-600 text-xs font-semibold tracking-wider">
                — Yeremia 29:11
              </span>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link 
              href="?page=testimony"
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-200 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                ✨
              </div>
              <div>
                <span className="block text-2xl font-black text-slate-800 leading-tight">
                  {testimoniesCount || 0}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Kesaksian dibagikan
                </span>
              </div>
            </Link>

            <Link 
              href="?page=questions"
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                💬
              </div>
              <div>
                <span className="block text-2xl font-black text-slate-800 leading-tight">
                  {questionsCount || 0}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Pertanyaan diajukan
                </span>
              </div>
            </Link>

            <Link 
              href="?page=prayer"
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-rose-200 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                🙏
              </div>
              <div>
                <span className="block text-2xl font-black text-slate-800 leading-tight">
                  {prayersCount || 0}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Permohonan doa
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
              <Compass className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-lg">Aksi Cepat</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="?page=testimony"
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-amber-200 text-left transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">✨</div>
                  <div>
                    <strong className="block text-sm text-slate-800">Bagikan Kesaksian</strong>
                    <small className="text-xs text-slate-400 font-normal">Ceritakan kebaikan Tuhan</small>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                href="?page=questions"
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-200 text-left transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">💬</div>
                  <div>
                    <strong className="block text-sm text-slate-800">Ajukan Pertanyaan</strong>
                    <small className="text-xs text-slate-400 font-normal">Diskusikan bersama komunitas</small>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                href="?page=prayer"
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-rose-200 text-left transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🙏</div>
                  <div>
                    <strong className="block text-sm text-slate-800">Minta Doa</strong>
                    <small className="text-xs text-slate-400 font-normal">Bagikan permohonan doamu</small>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-500 group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TESTIMONY PAGE */}
      {activePage === 'testimony' && (
        <div className="space-y-8 animate-fadeIn max-w-4xl">
          {/* Add form */}
          <TestimonyForm />

          {/* List Title */}
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Kesaksianku ({testimonies.length})</span>
            </h4>
          </div>

          {testimonies.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
              <div className="text-4xl mb-3">✨</div>
              <h5 className="font-bold text-slate-800 text-lg mb-1">Belum ada kesaksian</h5>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Bagikan kebaikan Tuhan yang kamu alami kepada komunitas! Setiap kesaksian adalah kekuatan bagi sesama.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {testimonies.map((t) => (
                <div key={t.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center font-bold text-white text-xs">
                        {initials}
                      </div>
                      <div>
                        <strong className="block text-sm text-slate-800 leading-tight">{profile?.nickname}</strong>
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatDate(t.created_at)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <DeleteButton 
                        itemName="kesaksian ini"
                        onConfirm={async () => {
                          'use server'
                          return await deleteTestimony(t.id)
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {t.content}
                  </p>
                  <div className="flex">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                      ✨ Kebaikan Tuhan
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* QUESTIONS PAGE */}
      {activePage === 'questions' && (
        <div className="space-y-8 animate-fadeIn max-w-4xl">
          {/* Add form */}
          <QuestionForm />

          {/* List Title */}
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              <span>Pertanyaanku ({questions.length})</span>
            </h4>
          </div>

          {questions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
              <div className="text-4xl mb-3">💬</div>
              <h5 className="font-bold text-slate-800 text-lg mb-1">Belum ada pertanyaan</h5>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Jangan ragu untuk bertanya! Tanyakan seputar hubungan, pertemanan, atau pergumulan hidup lainnya di sini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {questions.map((q) => (
                <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-400 to-violet-400 flex items-center justify-center font-bold text-white text-xs">
                        {initials}
                      </div>
                      <div>
                        <strong className="block text-sm text-slate-800 leading-tight">{profile?.nickname}</strong>
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatDate(q.created_at)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <DeleteButton 
                        itemName="pertanyaan ini"
                        onConfirm={async () => {
                          'use server'
                          return await deleteQuestion(q.id)
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {q.question}
                  </p>
                  <div className="flex">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryColor(q.category)}`}>
                      {getCategoryLabel(q.category)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PRAYER PAGE */}
      {activePage === 'prayer' && (
        <div className="space-y-8 animate-fadeIn max-w-4xl">
          {/* Add form */}
          <PrayerForm />

          {/* List Title */}
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Permohonan Doaku ({prayers.length})</span>
            </h4>
          </div>

          {prayers.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
              <div className="text-4xl mb-3">🙏</div>
              <h5 className="font-bold text-slate-800 text-lg mb-1">Belum ada permohonan doa</h5>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Bagikan permohonan doamu. Kami dan tim admin rindu untuk mendoakan serta mendukung pergumulan hidupmu.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {prayers.map((p) => (
                <div key={p.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-400 to-pink-400 flex items-center justify-center font-bold text-white text-xs">
                        {initials}
                      </div>
                      <div>
                        <strong className="block text-sm text-slate-800 leading-tight">{profile?.nickname}</strong>
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatDate(p.created_at)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <DeleteButton 
                        itemName="permohonan doa ini"
                        onConfirm={async () => {
                          'use server'
                          return await deletePrayerRequest(p.id)
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {p.request}
                  </p>
                  <div className="flex">
                    {p.is_private ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
                        <Lock className="w-3 h-3" />
                        Privat (Hanya Admin)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <Globe className="w-3 h-3" />
                        Publik
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </UserLayoutShell>
  )
}
