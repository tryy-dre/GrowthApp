'use client'

import Link from 'next/link'
import { signout } from '@/app/auth/actions'
import { 
  Home, 
  Star, 
  HelpCircle, 
  Heart, 
  LogOut 
} from 'lucide-react'
import { Righteous } from 'next/font/google'

const righteous = Righteous({
  subsets: ['latin'],
  weight: '400',
})

interface UserLayoutShellProps {
  nickname: string
  email: string
  activePage: string
  children: React.ReactNode
}

export default function UserLayoutShell({ 
  nickname, 
  email, 
  activePage, 
  children 
}: UserLayoutShellProps) {
  const navItems = [
    { key: 'home', label: 'Beranda', icon: Home },
    { key: 'testimony', label: 'Kebaikan Tuhan', icon: Star },
    { key: 'questions', label: 'Pertanyaan', icon: HelpCircle },
    { key: 'prayer', label: 'Permohonan Doa', icon: Heart },
  ]

  const activeTitle = navItems.find(item => item.key === activePage)?.label || 'Dashboard'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row relative">
      
      {/* SIDEBAR SIDE ELEMENT (DESKTOP ONLY) */}
      <aside className="hidden md:flex md:flex-col md:justify-between md:w-64 md:bg-white md:border-r md:border-slate-200 md:p-5 md:sticky md:top-0 md:h-screen md:shrink-0">
        <div className="space-y-8">
          {/* Brand logo */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <img 
              src="/logo/NO BG.png" 
              alt="Growth Logo" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <h2 className={`${righteous.className} text-xl tracking-wider text-slate-800 leading-none`}>Growth</h2>
              <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1 block">Community</span>
            </div>
          </div>

          {/* User profile brief */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white text-sm">
              {nickname.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800 truncate">{nickname}</p>
              <p className="text-[10px] text-slate-400 truncate" title={email}>{email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Menu</div>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activePage === item.key
              return (
                <Link
                  key={item.key}
                  href={`?page=${item.key}`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
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
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all border border-transparent hover:border-red-100"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Logout</span>
          </button>
        </form>
      </aside>

      {/* MOBILE STICKY BOTTOM TAB BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg flex justify-around py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.key
          return (
            <Link
              key={item.key}
              href={`?page=${item.key}`}
              className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all duration-200 ${
                isActive 
                  ? 'text-indigo-600 scale-105' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-bold tracking-tight">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* MAIN VIEW AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white/70 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">{activeTitle}</h1>
              <p className="text-[10px] text-slate-400 font-medium">Growth Community · Member Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wide">
              MEMBER
            </span>
            <div 
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white text-xs" 
              title={nickname}
            >
              {nickname.slice(0, 2).toUpperCase()}
            </div>
            {/* Mobile Logout Button */}
            <form action={signout} className="md:hidden flex items-center">
              <button 
                type="submit" 
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition"
                title="Logout"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </form>
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
