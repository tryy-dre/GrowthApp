'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signout } from '@/app/auth/actions'
import { 
  ChartPie, 
  Users, 
  Scroll, 
  Star, 
  HelpCircle, 
  Heart, 
  LogOut, 
  Shield,
  X,
  Key
} from 'lucide-react'
import { Righteous } from 'next/font/google'

const righteous = Righteous({
  subsets: ['latin'],
  weight: '400',
})

interface AdminLayoutShellProps {
  nickname: string
  email: string
  activePage: string
  children: React.ReactNode
}

export default function AdminLayoutShell({ 
  nickname, 
  email, 
  activePage, 
  children 
}: AdminLayoutShellProps) {
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false)

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', shortLabel: 'Dashboard', icon: ChartPie },
    { key: 'users', label: 'Manajemen User', shortLabel: 'User', icon: Users },
    { key: 'logs', label: 'Aktivitas Login', shortLabel: 'Log', icon: Scroll },
    { key: 'testimonies', label: 'Semua Testimoni', shortLabel: 'Testimoni', icon: Star },
    { key: 'questions', label: 'Semua Pertanyaan', shortLabel: 'Pertanyaan', icon: HelpCircle },
    { key: 'prayers', label: 'Permohonan Doa', shortLabel: 'Doa', icon: Heart },
    { key: 'password', label: 'Ubah Password', shortLabel: 'Password', icon: Key },
  ]

  // Sourced mobile tab bar: Max 4 items (testimoni, doa, pertanyaan, dashboard)
  const mobileTabs = [
    navItems.find(n => n.key === 'dashboard')!,
    navItems.find(n => n.key === 'testimonies')!,
    navItems.find(n => n.key === 'questions')!,
    navItems.find(n => n.key === 'prayers')!,
  ]

  const activeTitle = navItems.find(item => item.key === activePage)?.label || 'Admin Panel'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row relative">
      
      {/* SIDEBAR SIDE ELEMENT (DESKTOP ONLY) */}
      <aside className="hidden md:flex md:flex-col md:justify-between md:w-64 md:bg-gradient-to-b md:from-indigo-950 md:to-slate-950 md:text-white md:p-5 md:sticky md:top-0 md:h-screen md:shrink-0">
        <div className="space-y-8">
          {/* Brand logo */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`${righteous.className} text-xl tracking-wider text-white leading-none`}>Growth</h2>
              <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mt-1 block">Admin Panel</span>
            </div>
          </div>

          {/* User profile brief */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white text-sm">
              {nickname.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">{nickname}</p>
              <p className="text-[10px] text-indigo-300 truncate" title={email}>{email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-widest px-3 mb-2">Menu</div>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activePage === item.key
              return (
                <Link
                  key={item.key}
                  href={`?page=${item.key}`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                      : 'text-indigo-200/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-300'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer signout button */}
        <form action={signout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-950/20 hover:text-red-200 transition-all border border-transparent hover:border-red-950/40"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Logout</span>
          </button>
        </form>
      </aside>

      {/* MOBILE STICKY BOTTOM TAB BAR (MAX 4 ITEMS) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-indigo-950 border-t border-indigo-900/40 shadow-lg flex justify-around py-2 px-1">
        {mobileTabs.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.key
          return (
            <Link
              key={item.key}
              href={`?page=${item.key}`}
              className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all duration-200 ${
                isActive 
                  ? 'text-white scale-105' 
                  : 'text-indigo-300/50 hover:text-indigo-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-bold tracking-tight">{item.shortLabel}</span>
            </Link>
          )
        })}
      </nav>

      {/* MOBILE RIGHT SIDEBAR DRAWER OVERLAY */}
      {rightDrawerOpen && (
        <div 
          onClick={() => setRightDrawerOpen(false)}
          className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      {/* MOBILE RIGHT SIDEBAR DRAWER PANEL */}
      <aside className={`
        fixed inset-y-0 right-0 z-[70] w-64 bg-gradient-to-b from-indigo-950 to-slate-950 text-white p-5 flex flex-col justify-between transition-transform duration-300 md:hidden
        ${rightDrawerOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="space-y-8">
          {/* Header Drawer */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-xs tracking-wider uppercase">Menu Admin</span>
            </div>
            <button 
              onClick={() => setRightDrawerOpen(false)}
              className="p-1.5 text-indigo-300 hover:text-white rounded-lg hover:bg-white/10 transition"
              title="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User profile brief */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white text-sm">
              {nickname.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">{nickname}</p>
              <p className="text-[10px] text-indigo-300 truncate" title={email}>{email}</p>
            </div>
          </div>

          {/* Navigation Links (All 6 tabs) */}
          <nav className="space-y-1">
            <div className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-widest px-3 mb-2">Semua Fitur</div>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activePage === item.key
              return (
                <Link
                  key={item.key}
                  href={`?page=${item.key}`}
                  onClick={() => setRightDrawerOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                      : 'text-indigo-200/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-300'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Signout button */}
        <form action={signout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-950/20 hover:text-red-200 transition-all border border-transparent hover:border-red-950/40"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Logout</span>
          </button>
        </form>
      </aside>

      {/* MAIN VIEW AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white/70 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">{activeTitle}</h1>
              <p className="text-[10px] text-slate-400 font-medium">Growth Community · Admin Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wide">
              ADMIN
            </span>
            {/* Clickable Avatar to trigger right drawer menu */}
            <button 
              onClick={() => setRightDrawerOpen(true)}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white text-xs cursor-pointer hover:opacity-90 active:scale-95 transition focus:outline-none" 
              title="Buka Menu Admin"
            >
              {nickname.slice(0, 2).toUpperCase()}
            </button>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8">
          {children}
        </main>
      </div>

    </div>
  )
}
