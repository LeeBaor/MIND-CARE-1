'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Bell, Calendar, Check, Clock, MoreVertical, Pill, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getBookings, getCarePlans } from '@/lib/mind-care-store'

type Category = 'Tất cả' | 'Lịch khám' | 'Y tế' | 'Hệ thống'

interface NotificationItem {
  id: string
  category: Exclude<Category, 'Tất cả'>
  title: string
  body: string
  time: string
  icon: typeof Calendar
  iconBg: string
}

function getCookie(name: string) {
  return document.cookie.split('; ').find((item) => item.startsWith(`${name}=`))?.split('=')[1] ?? ''
}

export function NotificationCenter() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<Category>('Tất cả')
  const [items, setItems] = useState<NotificationItem[]>([])

  useEffect(() => {
    const name = decodeURIComponent(getCookie('user_name'))
    const role = getCookie('user_role')
    const bookings = getBookings()
    const plans = getCarePlans()
    const ownBookings = role === 'counselor'
      ? bookings.filter((item) => item.counselor === name)
      : bookings.filter((item) => item.patientName === name)
    const ownPlans = role === 'counselor'
      ? plans.filter((item) => item.counselor === name)
      : plans.filter((item) => item.patientName === name)

    const bookingItems: NotificationItem[] = ownBookings.map((item) => ({
      id: `booking-${item.id}`,
      category: 'Lịch khám',
      title: role === 'counselor' ? `Lịch hẹn của ${item.patientName}` : 'Nhắc nhở lịch tư vấn',
      body: role === 'counselor'
        ? `${item.patientName} đặt lịch ${item.specialty} vào ${item.date} lúc ${item.time}.`
        : `Bạn có lịch ${item.specialty} với ${item.counselor} vào ${item.date} lúc ${item.time}.`,
      time: item.status === 'completed' ? 'Đã hoàn tất' : 'Đang chờ khám',
      icon: Calendar,
      iconBg: 'bg-emerald-100 text-emerald-700',
    }))

    const carePlanItems: NotificationItem[] = ownPlans.map((item) => ({
      id: `plan-${item.id}`,
      category: 'Y tế',
      title: item.kind === 'medicine' ? 'Đơn thuốc mới đã được phát hành' : 'Bài tập chăm sóc mới đã được phát hành',
      body: role === 'counselor'
        ? `Bạn đã gửi “${item.title}” cho bệnh nhân ${item.patientName}.`
        : `${item.counselor} đã phát hành “${item.title}” cho bạn sau buổi tham vấn.`,
      time: item.releasedAt,
      icon: Pill,
      iconBg: 'bg-teal-100 text-teal-700',
    }))

    setItems([
      ...carePlanItems,
      ...bookingItems,
      {
        id: 'system-privacy',
        category: 'Hệ thống',
        title: 'Dữ liệu hồ sơ được bảo vệ',
        body: 'Chỉ những thông tin thuộc tài khoản và ca chăm sóc của bạn mới được hiển thị tại đây.',
        time: 'Hệ thống',
        icon: AlertCircle,
        iconBg: 'bg-amber-100 text-amber-700',
      },
    ])
  }, [])

  const filteredItems = useMemo(() => items.filter((item) => {
    const matchTab = activeTab === 'Tất cả' || item.category === activeTab
    const query = search.trim().toLowerCase()
    return matchTab && (!query || `${item.title} ${item.body}`.toLowerCase().includes(query))
  }), [activeTab, items, search])

  return (
    <div className="mx-auto max-w-xl px-2 py-4 sm:px-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-6">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs"><Bell className="h-5 w-5" /></span>
            <h2 className="font-heading text-lg font-extrabold text-teal-900">Thông báo & Nhắc nhở</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">{filteredItems.length} thông báo</span>
        </div>

        <div className="relative mb-4">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm kiếm thông báo..." className="w-full rounded-2xl border border-slate-300 bg-slate-50/60 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 focus:border-teal-600 focus:bg-white focus:outline-none sm:text-sm" />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(['Tất cả', 'Lịch khám', 'Y tế', 'Hệ thống'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cn('flex shrink-0 items-center gap-1 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all', activeTab === tab ? 'border-teal-600 bg-teal-600 text-white shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:bg-teal-50/50')}>
              {activeTab === tab && <Check className="h-3.5 w-3.5" />} {tab}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredItems.map((item) => {
            const Icon = item.icon
            return <div key={item.id} className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all hover:border-teal-300 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-xs', item.iconBg)}><Icon className="h-5 w-5" /></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 sm:text-sm">{item.title}</h4>
                    <span className="mt-0.5 inline-block rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-700">{item.category}</span>
                    <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-600">{item.body}</p>
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-slate-400"><Clock className="h-3 w-3" />{item.time}</div>
                  </div>
                </div>
                <button aria-label="Tùy chọn thông báo" className="p-1 text-slate-400 hover:text-slate-600"><MoreVertical className="h-4 w-4" /></button>
              </div>
            </div>
          })}
          {!filteredItems.length && <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-10 text-center text-sm text-slate-500">Chưa có thông báo phù hợp với tài khoản này.</div>}
        </div>
      </div>
    </div>
  )
}
