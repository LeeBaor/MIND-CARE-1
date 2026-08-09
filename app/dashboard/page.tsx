import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BachMaiNav } from '@/components/bachmai-nav'
import { StatCards } from '@/components/dashboard/stat-cards'
import { AlertZone } from '@/components/dashboard/alert-zone'
import Link from 'next/link'
import { Calendar, Clock, Folder, MessageSquare, Bell, Bot, Sparkles, ChevronRight, User } from 'lucide-react'

export default function DashboardPage() {
  const mainFunctions = [
    { title: 'Đặt lịch', icon: Calendar, href: '/booking', color: 'text-teal-600 bg-teal-50' },
    { title: 'Lịch hẹn', icon: Clock, href: '/notifications', color: 'text-teal-600 bg-teal-50' },
    { title: 'Hồ sơ', icon: Folder, href: '/results', color: 'text-teal-600 bg-teal-50' },
    { title: 'Hỏi/Đáp', icon: MessageSquare, href: '/ai-assistant', color: 'text-teal-600 bg-teal-50' },
    { title: 'Thông báo', icon: Bell, href: '/notifications', color: 'text-teal-600 bg-teal-50' },
    { title: 'Trợ lý AI', icon: Bot, href: '/ai-assistant', color: 'text-teal-600 bg-teal-50' },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader active="dashboard" />

      <main className="flex-1 pb-16 md:pb-12">
        <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">

          {/* User Greeting Header (Screen 3 Bach Mai App Style) */}
          <section className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 font-extrabold text-lg">
                NT
              </div>
              <div>
                <h1 className="font-heading text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <span>👋 Xin chào</span>
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  🗓️ Hôm nay: Thứ 5, 26/06/2025
                </p>
              </div>
            </div>
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-teal-700 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>Test tâm lý ngay</span>
            </Link>
          </section>

          {/* Important Alert Zone */}
          <AlertZone />

          {/* Daily Mind Indicators */}
          <StatCards />

          {/* Main Functions Grid (Screen 3 Bach Mai App Style) */}
          <section className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-700 font-bold">
                  🏣
                </span>
                <h3 className="text-base font-bold text-slate-800">Chức năng chính</h3>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {mainFunctions.map((fn, idx) => {
                const Icon = fn.icon
                return (
                  <Link
                    key={idx}
                    href={fn.href}
                    className="flex flex-col items-center justify-center rounded-2xl p-3 text-center border border-slate-100 bg-white hover:border-teal-300 hover:bg-teal-50/50 hover:scale-105 transition-all shadow-xs"
                  >
                    <div className={`mb-2 flex h-11 w-11 items-center justify-center rounded-2xl ${fn.color} shadow-xs`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">{fn.title}</span>
                  </Link>
                )
              })}
            </div>
          </section>

        </div>
      </main>

      <SiteFooter />
      <BachMaiNav />
    </div>
  )
}
