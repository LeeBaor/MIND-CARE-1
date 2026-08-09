'use client'

import { useState } from 'react'
import { Search, Bell, Calendar, Pill, AlertCircle, Check, MoreVertical, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationItem {
  id: number
  category: 'Lịch khám' | 'Y tế' | 'Hệ thống'
  title: string
  body: string
  time: string
  icon: any
  iconBg: string
}

export function NotificationCenter() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'Tất cả' | 'Lịch khám' | 'Y tế' | 'Hệ thống'>('Tất cả')

  const items: NotificationItem[] = [
    {
      id: 1,
      category: 'Lịch khám',
      title: 'Nhắc nhớ lịch tư vấn tâm lý',
      body: 'Bạn có lịch khám tư vấn với BS. BÙI VĂN CƯỜNG vào 2025-06-27 06:00',
      time: '1 ngày trước',
      icon: Calendar,
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 2,
      category: 'Y tế',
      title: 'Đơn thuốc & Lộ trình thư giãn điện tử',
      body: 'Bạn có đơn thuốc / bài tập thư giãn mới từ ThS. Vũ Hoàng Thảo',
      time: '2 ngày trước',
      icon: Pill,
      iconBg: 'bg-teal-100 text-teal-700',
    },
    {
      id: 3,
      category: 'Lịch khám',
      title: 'Báo cáo trắc nghiệm PHQ-9 & GAD-7 đã có kết quả',
      body: 'Bác sĩ chuyên khoa đã xem và cập nhật nhận xét kết quả kiểm tra tâm lý của bạn.',
      time: '3 ngày trước',
      icon: Calendar,
      iconBg: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 4,
      category: 'Hệ thống',
      title: 'Cập nhật tính năng Trợ lý AI Mind Care v2.5',
      body: 'Trợ lý AI hiện đã hỗ trợ gợi ý các bài tập thiền định & âm nhạc giải tỏa stress.',
      time: '5 ngày trước',
      icon: AlertCircle,
      iconBg: 'bg-amber-100 text-amber-700',
    },
  ]

  const filteredItems = items.filter((item) => {
    const matchTab = activeTab === 'Tất cả' || item.category === activeTab
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.body.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div className="mx-auto max-w-xl px-2 py-4 sm:px-4">
      {/* Mobile/Desktop Notification Frame styled after Screen 2 Bach Mai App */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
              <Bell className="h-5 w-5" />
            </span>
            <h2 className="font-heading text-lg font-extrabold text-teal-900">Thông báo & Nhắc nhở</h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {filteredItems.length} thông báo
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm thông báo..."
            className="w-full rounded-2xl border border-slate-300 bg-slate-50/60 py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium text-slate-800 focus:border-teal-600 focus:bg-white focus:outline-none"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        </div>

        {/* Filter Pills */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(['Tất cả', 'Lịch khám', 'Y tế', 'Hệ thống'] as const).map((tab) => {
            const isSelected = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex items-center gap-1 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all border shrink-0',
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:bg-teal-50/50'
                )}
              >
                {isSelected && <Check className="h-3.5 w-3.5" />}
                <span>{tab}</span>
              </button>
            )
          })}
        </div>

        {/* Notification Cards List */}
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:border-teal-300 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-xs', item.iconBg)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</h4>
                      </div>
                      <span className="inline-block text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md mt-0.5">
                        {item.category}
                      </span>
                      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-medium">
                        {item.body}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                        <Clock className="h-3 w-3" />
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>

                  <button className="text-slate-400 hover:text-slate-600 p-1">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
