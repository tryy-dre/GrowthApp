import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SupabaseClient } from '@supabase/supabase-js'
import Link from 'next/link'
import AdminLayoutShell from './components/AdminLayoutShell'
import CreateUserForm from './components/CreateUserForm'
import DeleteButton from './components/DeleteButton'
import ChangePasswordForm from '@/app/auth/components/ChangePasswordForm'
import { 
  deleteUser, 
  deleteTestimony, 
  deleteQuestion, 
  deletePrayerRequest,
  deleteAllTestimonies,
  deleteAllQuestions,
  deleteAllPrayerRequests,
  deleteActivityLog,
  deleteAllActivityLogs
} from './adminActions'
import { 
  Users as UsersIcon, 
  Star, 
  HelpCircle, 
  Heart, 
  Lock, 
  Globe, 
  Calendar,
  Eye,
  Scroll
} from 'lucide-react'

interface PageProps {
  searchParams: {
    page?: string
    p?: string
    id?: string
  }
}

// Define Type-safe interfaces
interface Profile {
  id: string
  nickname: string
  role: string
  created_at: string
}

interface ActivityLog {
  id: number
  user_id: string
  action: string
  ip_address: string | null
  created_at: string
  profiles: {
    nickname: string
  } | null
}

interface Testimony {
  id: number
  user_id: string
  content: string
  created_at: string
  profiles: {
    nickname: string
  } | null
}

interface Question {
  id: number
  user_id: string
  category: string
  question: string
  created_at: string
  profiles: {
    nickname: string
  } | null
}

interface PrayerRequest {
  id: number
  user_id: string
  request: string
  is_private: boolean
  created_at: string
  profiles: {
    nickname: string
  } | null
}

export default async function AdminPage({ searchParams }: PageProps) {
  const supabase = createClient()

  // 1. Get logged-in user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Fetch logged-in admin profile
  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (adminProfile?.role !== 'admin') {
    redirect('/user')
  }

  const activePage = searchParams.page || 'dashboard'
  const perPage = 10
  const currentP = Math.max(1, Number(searchParams.p || 1))
  const offset = (currentP - 1) * perPage

  // 3. Render page content depending on activePage
  return (
    <AdminLayoutShell
      nickname={adminProfile.nickname || 'Admin'}
      email={user.email || ''}
      activePage={activePage}
    >
      {activePage === 'dashboard' && (
        <DashboardView supabase={supabase} />
      )}

      {activePage === 'users' && (
        <UsersView 
          supabase={supabase} 
          currentUserId={user.id} 
          offset={offset} 
          perPage={perPage} 
          currentP={currentP} 
        />
      )}

      {activePage === 'logs' && (
        <LogsView 
          supabase={supabase} 
          offset={offset} 
          perPage={perPage} 
          currentP={currentP} 
        />
      )}

      {activePage === 'testimonies' && (
        <TestimoniesView 
          supabase={supabase} 
          offset={offset} 
          perPage={perPage} 
          currentP={currentP} 
          selectedId={searchParams.id} 
        />
      )}

      {activePage === 'questions' && (
        <QuestionsView 
          supabase={supabase} 
          offset={offset} 
          perPage={perPage} 
          currentP={currentP} 
          selectedId={searchParams.id} 
        />
      )}

      {activePage === 'prayers' && (
        <PrayersView 
          supabase={supabase} 
          offset={offset} 
          perPage={perPage} 
          currentP={currentP} 
          selectedId={searchParams.id} 
        />
      )}

      {activePage === 'password' && (
        <div className="animate-fadeIn max-w-4xl mx-auto py-4">
          <ChangePasswordForm />
        </div>
      )}
    </AdminLayoutShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function Pagination({ totalItems, perPage, currentPage, pageKey }: { totalItems: number, perPage: number, currentPage: number, pageKey: string }) {
  const totalPages = Math.ceil(totalItems / perPage)
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex justify-center items-center gap-1.5 pt-4 border-t border-slate-100 mt-6">
      {pages.map((p) => (
        <a
          key={p}
          href={`?page=${pageKey}&p=${p}`}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            p === currentPage
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {p}
        </a>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. DASHBOARD VIEW
// ─────────────────────────────────────────────────────────────────────────────
async function DashboardView({ supabase }: { supabase: SupabaseClient }) {
  const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: testimoniesCount } = await supabase.from('testimonies').select('*', { count: 'exact', head: true })
  const { count: questionsCount } = await supabase.from('questions').select('*', { count: 'exact', head: true })
  const { count: prayersCount } = await supabase.from('prayer_requests').select('*', { count: 'exact', head: true })

  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: recentLogs } = await supabase
    .from('activity_logs')
    .select('*, profiles(nickname)')
    .order('created_at', { ascending: false })
    .limit(10)

  const usersList = (recentUsers || []) as Profile[]
  const logsList = (recentLogs || []) as unknown as ActivityLog[]

  const statsCards = [
    { title: 'Total Pengguna', value: usersCount || 0, icon: UsersIcon, color: 'bg-indigo-50 text-indigo-600 border-indigo-100', link: 'users' },
    { title: 'Total Testimoni', value: testimoniesCount || 0, icon: Star, color: 'bg-amber-50 text-amber-600 border-amber-100', link: 'testimonies' },
    { title: 'Total Pertanyaan', value: questionsCount || 0, icon: HelpCircle, color: 'bg-sky-50 text-sky-600 border-sky-100', link: 'questions' },
    { title: 'Permohonan Doa', value: prayersCount || 0, icon: Heart, color: 'bg-pink-50 text-pink-600 border-pink-100', link: 'prayers' },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <a 
              key={idx}
              href={`?page=${card.link}`}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5"
            >
              <div className={`p-4 rounded-xl border ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">{card.title}</span>
                <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{card.value}</span>
              </div>
            </a>
          )
        })}
      </div>

      {/* Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <UsersIcon className="w-4.5 h-4.5 text-indigo-600" />
                <span>User Terbaru</span>
              </h3>
              <a href="?page=users" className="text-xs font-semibold text-indigo-650 hover:underline">Lihat Semua</a>
            </div>
            
            <div className="divide-y divide-slate-100">
              {usersList.length > 0 ? (
                usersList.map((ru) => (
                  <div key={ru.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                        {ru.nickname.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{ru.nickname}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{new Date(ru.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ru.role === 'admin' 
                        ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {ru.role}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-xs text-slate-400">Belum ada user terdaftar.</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Logs */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Scroll className="w-4.5 h-4.5 text-amber-600" />
                <span>Aktivitas Terbaru</span>
              </h3>
              <a href="?page=logs" className="text-xs font-semibold text-indigo-650 hover:underline">Lihat Semua</a>
            </div>

            <div className="divide-y divide-slate-100">
              {logsList.length > 0 ? (
                logsList.map((log) => (
                  <div key={log.id} className="py-3 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-700 leading-normal">
                        <strong className="font-semibold text-slate-800">{log.profiles?.nickname || 'Unknown'}</strong>{' '}
                        <span className="inline-flex items-center px-1.5 py-0.5 bg-slate-100 text-slate-655 border border-slate-200/50 rounded text-[9px] font-medium mx-1">
                          {log.action}
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{new Date(log.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-xs text-slate-400">Belum ada log aktivitas.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. USERS MANAGEMENT VIEW
// ─────────────────────────────────────────────────────────────────────────────
async function UsersView({ 
  supabase, 
  currentUserId, 
  offset, 
  perPage, 
  currentP 
}: { 
  supabase: SupabaseClient
  currentUserId: string
  offset: number
  perPage: number
  currentP: number
}) {
  const { data: usersData, count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  const totalItems = count || 0
  const users = (usersData || []) as Profile[]

  return (
    <div className="space-y-6">
      <CreateUserForm />

      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <UsersIcon className="w-4.5 h-4.5 text-indigo-600" />
              <span>Daftar Pengguna</span>
            </h3>
            <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
              {totalItems} total
            </span>
          </div>

          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                  <th className="py-3 px-6 w-16">#</th>
                  <th className="py-3 px-6">Nickname</th>
                  <th className="py-3 px-6 w-44">Role</th>
                  <th className="py-3 px-6 w-44">Bergabung</th>
                  <th className="py-3 px-6 w-24 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length > 0 ? (
                  users.map((u, idx: number) => (
                    <tr key={u.id} className="hover:bg-slate-50/40 transition">
                      <td className="py-3.5 px-6 text-slate-400 font-medium">{offset + idx + 1}</td>
                      <td className="py-3.5 px-6 font-bold text-slate-800">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                            {u.nickname.slice(0, 2).toUpperCase()}
                          </div>
                          <span>{u.nickname}</span>
                          {u.id === currentUserId && (
                            <span className="bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-[9px] px-1.5 py-0.5 rounded">Kamu</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          u.role === 'admin' 
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
                            : 'bg-slate-100 text-slate-750 border-slate-200'
                        }`}>
                          {u.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-slate-500 font-medium">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <DeleteButton
                          itemId={u.id}
                          itemName={`user ${u.nickname}`}
                          disabled={u.id === currentUserId}
                          onConfirm={async () => {
                            'use server'
                            return deleteUser(u.id)
                          }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                      Tidak ada data pengguna.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination totalItems={totalItems} perPage={perPage} currentPage={currentP} pageKey="users" />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. LOGS VIEW
// ─────────────────────────────────────────────────────────────────────────────
async function LogsView({ 
  supabase, 
  offset, 
  perPage, 
  currentP 
}: { 
  supabase: SupabaseClient
  offset: number
  perPage: number
  currentP: number
}) {
  const { data: logsData, count } = await supabase
    .from('activity_logs')
    .select('*, profiles(nickname)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  const totalItems = count || 0
  const logs = (logsData || []) as unknown as ActivityLog[]

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Scroll className="w-4.5 h-4.5 text-amber-600" />
            <span>Log Aktivitas</span>
          </h3>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
              {totalItems} total
            </span>
            {totalItems > 0 && (
              <DeleteButton
                itemName="seluruh data log aktivitas"
                onConfirm={async () => {
                  'use server'
                  return deleteAllActivityLogs()
                }}
              />
            )}
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                <th className="py-3 px-6 w-16">#</th>
                <th className="py-3 px-6">Nickname</th>
                <th className="py-3 px-6">Aksi</th>
                <th className="py-3 px-6 w-44">IP Address</th>
                <th className="py-3 px-6 w-44">Waktu</th>
                <th className="py-3 px-6 w-24 text-right">Hapus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length > 0 ? (
                logs.map((log, idx: number) => (
                  <tr key={log.id} className="hover:bg-slate-50/40 transition">
                    <td className="py-3.5 px-6 text-slate-400 font-medium">{offset + idx + 1}</td>
                    <td className="py-3.5 px-6 font-bold text-slate-800">{log.profiles?.nickname || 'Unknown'}</td>
                    <td className="py-3.5 px-6">
                      <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200/50 rounded-lg text-[10px] font-semibold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <code className="text-xs bg-slate-50 border border-slate-200/50 rounded px-1.5 py-0.5 font-mono text-slate-500">
                        {log.ip_address || '127.0.0.1'}
                      </code>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 font-medium">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <DeleteButton
                        itemId={log.id}
                        itemName="log ini"
                        onConfirm={async () => {
                          'use server'
                          return deleteActivityLog(log.id)
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    Belum ada log aktivitas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination totalItems={totalItems} perPage={perPage} currentPage={currentP} pageKey="logs" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TESTIMONIES VIEW (LIST & DETAIL)
// ─────────────────────────────────────────────────────────────────────────────
async function TestimoniesView({ 
  supabase, 
  offset, 
  perPage, 
  currentP, 
  selectedId 
}: { 
  supabase: SupabaseClient
  offset: number
  perPage: number
  currentP: number
  selectedId?: string
}) {
  if (selectedId) {
    const { data: itemData } = await supabase
      .from('testimonies')
      .select('*, profiles(nickname)')
      .eq('id', Number(selectedId))
      .single()

    const item = itemData as unknown as Testimony

    if (!item) {
      return (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400 font-semibold shadow-sm">
          Item tidak ditemukan.
          <div className="mt-4">
            <a href="?page=testimonies" className="text-xs text-indigo-650 hover:underline">Kembali</a>
          </div>
        </div>
      )
    }

    return (
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Star className="w-4.5 h-4.5 text-amber-600" />
            <span>Detail Kebaikan Tuhan</span>
          </h3>
          <a 
            href="?page=testimonies" 
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 transition"
          >
            Kembali
          </a>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <span className="text-slate-400 text-xs block mb-1">Nama Pengguna</span>
            <span className="font-bold text-slate-800">{item.profiles?.nickname || 'Unknown'}</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs block mb-1">Isi Kesaksian</span>
            <p className="text-slate-700 bg-slate-50 border border-slate-200/50 p-4 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-inner">
              {item.content}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(item.created_at).toLocaleString()}</span>
          </div>
        </div>
      </div>
    )
  }

  // Listing View
  const { data: testimoniesData, count } = await supabase
    .from('testimonies')
    .select('*, profiles(nickname)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  const totalItems = count || 0
  const testimonies = (testimoniesData || []) as unknown as Testimony[]

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Star className="w-4.5 h-4.5 text-amber-600" />
            <span>Semua Testimoni</span>
          </h3>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
              {totalItems} total
            </span>
            {totalItems > 0 && (
              <DeleteButton
                itemName="seluruh data testimoni"
                onConfirm={async () => {
                  'use server'
                  return deleteAllTestimonies()
                }}
              />
            )}
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                <th className="py-3 px-6 w-16">#</th>
                <th className="py-3 px-6">Pengguna</th>
                <th className="py-3 px-6">Isi Kesaksian</th>
                <th className="py-3 px-6 w-44">Waktu</th>
                <th className="py-3 px-6 w-24 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {testimonies.length > 0 ? (
                testimonies.map((t, idx: number) => (
                  <tr 
                    key={t.id} 
                    className="hover:bg-slate-50/40 transition group"
                  >
                    <td className="py-3.5 px-6 text-slate-400 font-medium">{offset + idx + 1}</td>
                    <td className="py-3.5 px-6 font-bold text-slate-800">{t.profiles?.nickname || 'Unknown'}</td>
                    <td className="py-3.5 px-6 text-slate-600 font-medium max-w-[280px] truncate">{t.content}</td>
                    <td className="py-3.5 px-6 text-slate-500 font-medium">{new Date(t.created_at).toLocaleDateString()}</td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`?page=testimonies&id=${t.id}`}
                          className="p-2 bg-white hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 border border-slate-200 hover:border-indigo-100 rounded-lg transition shadow-sm"
                          title="Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <DeleteButton
                          itemId={t.id}
                          itemName="testimoni ini"
                          onConfirm={async () => {
                            'use server'
                            return deleteTestimony(t.id)
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                    Belum ada testimoni.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination totalItems={totalItems} perPage={perPage} currentPage={currentP} pageKey="testimonies" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. QUESTIONS VIEW (LIST & DETAIL)
// ─────────────────────────────────────────────────────────────────────────────
async function QuestionsView({ 
  supabase, 
  offset, 
  perPage, 
  currentP, 
  selectedId 
}: { 
  supabase: SupabaseClient
  offset: number
  perPage: number
  currentP: number
  selectedId?: string
}) {
  const categoryStyles: Record<string, { label: string; style: string }> = {
    hubungan: { label: 'Hubungan', style: 'bg-pink-50 text-pink-700 border-pink-100' },
    pertemanan: { label: 'Pertemanan', style: 'bg-sky-50 text-sky-700 border-sky-100' },
    masalah_lain: { label: 'Masalah Lain', style: 'bg-amber-50 text-amber-700 border-amber-100' },
  }

  if (selectedId) {
    const { data: itemData } = await supabase
      .from('questions')
      .select('*, profiles(nickname)')
      .eq('id', Number(selectedId))
      .single()

    const item = itemData as unknown as Question

    if (!item) {
      return (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400 font-semibold shadow-sm">
          Item tidak ditemukan.
          <div className="mt-4">
            <a href="?page=questions" className="text-xs text-indigo-650 hover:underline">Kembali</a>
          </div>
        </div>
      )
    }

    const category = categoryStyles[item.category] || { label: item.category, style: 'bg-slate-50 text-slate-700 border-slate-100' }

    return (
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <HelpCircle className="w-4.5 h-4.5 text-sky-650" />
            <span>Detail Pertanyaan</span>
          </h3>
          <a 
            href="?page=questions" 
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 transition"
          >
            Kembali
          </a>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex gap-8">
            <div>
              <span className="text-slate-400 text-xs block mb-1">Nama Pengguna</span>
              <span className="font-bold text-slate-800">{item.profiles?.nickname || 'Unknown'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block mb-1">Kategori</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold border mt-0.5 ${category.style}`}>
                {category.label}
              </span>
            </div>
          </div>
          <div>
            <span className="text-slate-400 text-xs block mb-1">Isi Pertanyaan</span>
            <p className="text-slate-700 bg-slate-50 border border-slate-200/50 p-4 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-inner">
              {item.question}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(item.created_at).toLocaleString()}</span>
          </div>
        </div>
      </div>
    )
  }

  // Listing View
  const { data: questionsData, count } = await supabase
    .from('questions')
    .select('*, profiles(nickname)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  const totalItems = count || 0
  const questions = (questionsData || []) as unknown as Question[]

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <HelpCircle className="w-4.5 h-4.5 text-sky-650" />
            <span>Semua Pertanyaan</span>
          </h3>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
              {totalItems} total
            </span>
            {totalItems > 0 && (
              <DeleteButton
                itemName="seluruh data pertanyaan"
                onConfirm={async () => {
                  'use server'
                  return deleteAllQuestions()
                }}
              />
            )}
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                <th className="py-3 px-6 w-16">#</th>
                <th className="py-3 px-6">Pengguna</th>
                <th className="py-3 px-6 w-36">Kategori</th>
                <th className="py-3 px-6">Isi Pertanyaan</th>
                <th className="py-3 px-6 w-44">Waktu</th>
                <th className="py-3 px-6 w-24 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {questions.length > 0 ? (
                questions.map((q, idx: number) => {
                  const category = categoryStyles[q.category] || { label: q.category, style: 'bg-slate-50 text-slate-700 border-slate-100' }
                  return (
                    <tr 
                      key={q.id} 
                      className="hover:bg-slate-50/40 transition group"
                    >
                      <td className="py-3.5 px-6 text-slate-400 font-medium">{offset + idx + 1}</td>
                      <td className="py-3.5 px-6 font-bold text-slate-800">{q.profiles?.nickname || 'Unknown'}</td>
                      <td className="py-3.5 px-6">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold border ${category.style}`}>
                          {category.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-slate-600 font-medium max-w-[220px] truncate">{q.question}</td>
                      <td className="py-3.5 px-6 text-slate-500 font-medium">{new Date(q.created_at).toLocaleDateString()}</td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`?page=questions&id=${q.id}`}
                            className="p-2 bg-white hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 border border-slate-200 hover:border-indigo-100 rounded-lg transition shadow-sm"
                            title="Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <DeleteButton
                            itemId={q.id}
                            itemName="pertanyaan ini"
                            onConfirm={async () => {
                              'use server'
                              return deleteQuestion(q.id)
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    Belum ada pertanyaan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination totalItems={totalItems} perPage={perPage} currentPage={currentP} pageKey="questions" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PRAYERS VIEW (LIST & DETAIL)
// ─────────────────────────────────────────────────────────────────────────────
async function PrayersView({ 
  supabase, 
  offset, 
  perPage, 
  currentP, 
  selectedId 
}: { 
  supabase: SupabaseClient
  offset: number
  perPage: number
  currentP: number
  selectedId?: string
}) {
  if (selectedId) {
    const { data: itemData } = await supabase
      .from('prayer_requests')
      .select('*, profiles(nickname)')
      .eq('id', Number(selectedId))
      .single()

    const item = itemData as unknown as PrayerRequest

    if (!item) {
      return (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400 font-semibold shadow-sm">
          Item tidak ditemukan.
          <div className="mt-4">
            <a href="?page=prayers" className="text-xs text-indigo-650 hover:underline">Kembali</a>
          </div>
        </div>
      )
    }

    return (
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Heart className="w-4.5 h-4.5 text-pink-600" />
            <span>Detail Permohonan Doa</span>
          </h3>
          <a 
            href="?page=prayers" 
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 transition"
          >
            Kembali
          </a>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex gap-8">
            <div>
              <span className="text-slate-400 text-xs block mb-1">Nama Pengguna</span>
              <span className="font-bold text-slate-800">{item.profiles?.nickname || 'Unknown'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block mb-1">Privasi</span>
              {item.is_private ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold border border-red-100 bg-red-50 text-red-700">
                  <Lock className="w-3 h-3" />
                  <span>Privat</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold border border-emerald-100 bg-emerald-50 text-emerald-700">
                  <Globe className="w-3 h-3" />
                  <span>Publik</span>
                </span>
              )}
            </div>
          </div>
          <div>
            <span className="text-slate-400 text-xs block mb-1">Isi Doa</span>
            <p className="text-slate-700 bg-slate-50 border border-slate-200/50 p-4 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-inner">
              {item.request}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(item.created_at).toLocaleString()}</span>
          </div>
        </div>
      </div>
    )
  }

  // Listing View
  const { data: prayersData, count } = await supabase
    .from('prayer_requests')
    .select('*, profiles(nickname)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  const totalItems = count || 0
  const prayers = (prayersData || []) as unknown as PrayerRequest[]

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Heart className="w-4.5 h-4.5 text-pink-600" />
            <span>Semua Permohonan Doa</span>
          </h3>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
              {totalItems} total
            </span>
            {totalItems > 0 && (
              <DeleteButton
                itemName="seluruh data permohonan doa"
                onConfirm={async () => {
                  'use server'
                  return deleteAllPrayerRequests()
                }}
              />
            )}
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                <th className="py-3 px-6 w-16">#</th>
                <th className="py-3 px-6">Pengguna</th>
                <th className="py-3 px-6">Isi Doa</th>
                <th className="py-3 px-6 w-28">Privasi</th>
                <th className="py-3 px-6 w-44">Waktu</th>
                <th className="py-3 px-6 w-24 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prayers.length > 0 ? (
                prayers.map((pr, idx: number) => (
                  <tr 
                    key={pr.id} 
                    className="hover:bg-slate-50/40 transition group"
                  >
                    <td className="py-3.5 px-6 text-slate-400 font-medium">{offset + idx + 1}</td>
                    <td className="py-3.5 px-6 font-bold text-slate-800">{pr.profiles?.nickname || 'Unknown'}</td>
                    <td className="py-3.5 px-6 text-slate-600 font-medium max-w-[260px] truncate">{pr.request}</td>
                    <td className="py-3.5 px-6">
                      {pr.is_private ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border border-red-100 bg-red-50 text-red-700">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Privat</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border border-emerald-100 bg-emerald-50 text-emerald-700">
                          <Globe className="w-2.5 h-2.5" />
                          <span>Publik</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 font-medium">{new Date(pr.created_at).toLocaleDateString()}</td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`?page=prayers&id=${pr.id}`}
                          className="p-2 bg-white hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 border border-slate-200 hover:border-indigo-100 rounded-lg transition shadow-sm"
                          title="Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <DeleteButton
                          itemId={pr.id}
                          itemName="doa ini"
                          onConfirm={async () => {
                            'use server'
                            return deletePrayerRequest(pr.id)
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    Belum ada permohonan doa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination totalItems={totalItems} perPage={perPage} currentPage={currentP} pageKey="prayers" />
    </div>
  )
}
