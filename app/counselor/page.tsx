'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Bell,
  Calendar,
  CheckCircle2,
  FileText,
  UserRound,
  XCircle,
  ChevronRight,
  Clock,
  LayoutGrid,
  List,
  AlertCircle,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  User,
} from 'lucide-react'
import { DoctorHeader } from '@/components/doctor-header'
import { SiteFooter } from '@/components/site-footer'
import { getBookings, updateBooking, type MindBooking } from '@/lib/mind-care-store'

interface DateOption {
  day: string
  date: string
  full: string
  isoDate: string
}

function getWeekDays(): DateOption[] {
  const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
  const fullDays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  const result: DateOption[] = []
  const today = new Date()

  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const dayOfWeek = daysOfWeek[d.getDay()]
    const fullDayOfWeek = fullDays[d.getDay()]
    const dd = d.getDate().toString().padStart(2, '0')
    const mm = (d.getMonth() + 1).toString().padStart(2, '0')
    const yyyy = d.getFullYear()

    result.push({
      day: dayOfWeek,
      date: `${dd}/${mm}`,
      full: `${fullDayOfWeek}, ${dd}/${mm}/${yyyy}`,
      isoDate: `${yyyy}-${mm}-${dd}`,
    })
  }
  return result
}

const TIME_SLOTS = [
  '06:15', '07:45', '08:00', '09:00',
  '13:00', '13:45', '15:15', '15:45',
  '16:15', '16:45',
]

export default function CounselorPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<MindBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [weekDays, setWeekDays] = useState<DateOption[]>([])

  useEffect(() => {
    setWeekDays(getWeekDays())
    void refresh()
  }, [])

  const refresh = async () => {
    setLoading(true)
    const doctorName = decodeURIComponent(
      document.cookie.split('; ').find((v) => v.startsWith('user_name='))?.split('=')[1] || ''
    )

    try {
      const res = await fetch(`/api/bookings${doctorName ? `?counselor=${encodeURIComponent(doctorName)}` : ''}`)
      if (res.ok) {
        const data: MindBooking[] = await res.json()
        setBookings(data)
        setLoading(false)
        return
      }
    } catch {
      // fallback
    }

    const localBookings = getBookings()
    const filtered = doctorName ? localBookings.filter((item) => item.counselor === doctorName) : localBookings
    setBookings(filtered)
    setLoading(false)
  }

  async function handleQuickStatusChange(booking: MindBooking, status: 'confirmed' | 'cancelled') {
    setUpdatingId(booking.id)

    await fetch('/api/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: booking.id, status }),
    }).catch(() => null)

    setUpdatingId(null)
    updateBooking({ ...booking, status })

    if (status === 'confirmed') {
      setMessage(`Đã duyệt lịch hẹn cho ${booking.patientName}.`)
    } else {
      setMessage(`Đã từ chối lịch hẹn của ${booking.patientName}.`)
    }

    void refresh()
  }

  // Find booking for a date and time slot
  function matchBooking(dateOpt: DateOption, timeSlot: string) {
    return bookings.find((b) => {
      if (b.time !== timeSlot) return false
      if (b.date.includes(dateOpt.date)) return true
      if (b.date === dateOpt.full) return true
      return false
    })
  }

  const pendingCount = bookings.filter((b) => b.status === 'pending' || b.status === 'upcoming').length
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed' || b.status === 'completed').length

  return (
    <div className="flex min-h-screen flex-col bg-[#f4fbf6]">
      <DoctorHeader active="schedule" />
      <main className="flex-1 pb-12">
        <div className="mx-auto max-w-6xl space-y-5 px-3 py-6 sm:px-6">
          {/* Header Banner */}
          <section className="rounded-[28px] bg-gradient-to-r from-emerald-800 via-teal-700 to-teal-800 p-6 text-white shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-100">Bảng điều khiển chuyên gia</p>
                <h1 className="mt-1 font-heading text-2xl sm:text-3xl font-extrabold">Lịch làm việc & Tham vấn</h1>
                <p className="mt-1.5 text-xs text-emerald-50 max-w-xl">
                  Theo dõi trực quan khung giờ bận, duyệt lịch hẹn của bệnh nhân và mở nhanh chi tiết từng buổi khám.
                </p>
              </div>

              {/* Quick Legend Badges & Profile */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white/10 p-2.5 backdrop-blur-md border border-white/20 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-800 text-white font-extrabold shadow-sm">
                    <span className="h-2.5 w-2.5 rounded-full bg-teal-300" /> Lịch bận / Đã duyệt ({confirmedCount})
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-400 text-amber-950 font-extrabold shadow-sm">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-900 animate-ping" /> Chờ duyệt ({pendingCount})
                  </span>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 rounded-2xl bg-white/20 hover:bg-white/30 px-3.5 py-2.5 text-xs font-extrabold text-white border border-white/30 transition-all shadow-sm shrink-0"
                >
                  <UserRound className="h-4 w-4" /> Trang cá nhân
                </Link>
              </div>
            </div>
          </section>

          {message && (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-bold text-emerald-800 shadow-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Schedule Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-teal-700" />
              <h2 className="font-heading text-lg font-extrabold text-slate-900">Lịch bận & Hẹn khám Bác sĩ</h2>
            </div>

            <div className="flex items-center gap-3">
              {/* View Switcher */}
              <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setViewMode('calendar')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                    viewMode === 'calendar' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>Lịch biểu to</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                    viewMode === 'list' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                  <span>Danh sách ({bookings.length})</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => void refresh()}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-50"
              >
                {loading ? 'Đang tải...' : 'Làm mới'}
              </button>
            </div>
          </div>

          {/* VIEW 1: BIG CALENDAR GRID (LỊCH TO HỢP THỜI) */}
          {viewMode === 'calendar' && (
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
              {/* Day Headers (7 Days Column) */}
              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  {/* Column Header Row */}
                  <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50/80 text-center text-xs font-bold text-slate-700">
                    <div className="p-3 border-r border-slate-200 flex items-center justify-center gap-1 text-slate-500 font-semibold">
                      <Clock className="h-4 w-4" /> Khung giờ
                    </div>
                    {weekDays.map((d, index) => (
                      <div
                        key={d.isoDate}
                        className={`p-3 border-r border-slate-200 last:border-r-0 ${
                          index === 0 ? 'bg-teal-50/70 text-teal-900 font-extrabold' : ''
                        }`}
                      >
                        <span className="block text-[11px] text-slate-500 uppercase">{d.day}</span>
                        <span className="text-sm font-extrabold text-slate-800">{d.date}</span>
                      </div>
                    ))}
                  </div>

                  {/* Time Slot Rows */}
                  <div className="divide-y divide-slate-100">
                    {TIME_SLOTS.map((slot) => (
                      <div key={slot} className="grid grid-cols-8 text-xs min-h-[64px]">
                        {/* Time slot column */}
                        <div className="p-2 border-r border-slate-200 bg-slate-50/50 flex items-center justify-center font-bold text-slate-700">
                          {slot}
                        </div>

                        {/* 7 Days cells */}
                        {weekDays.map((d) => {
                          const item = matchBooking(d, slot)

                          if (!item) {
                            return (
                              <div
                                key={`${d.isoDate}-${slot}`}
                                className="p-1.5 border-r border-slate-100 last:border-r-0 flex items-center justify-center text-[11px] text-slate-300 hover:bg-slate-50/60 transition-colors"
                              >
                                <span className="text-[10px] text-slate-400 font-medium">Trống</span>
                              </div>
                            )
                          }

                          const isPending = item.status === 'pending' || item.status === 'upcoming'
                          const isConfirmed = item.status === 'confirmed' || item.status === 'completed'
                          const isCancelled = item.status === 'cancelled'

                          return (
                            <div
                              key={`${d.isoDate}-${slot}`}
                              className="p-1 border-r border-slate-100 last:border-r-0 flex items-center justify-center"
                            >
                              <button
                                type="button"
                                onClick={() => router.push(`/counselor/appointments/${item.id}`)}
                                title={`Bấm để vào chi tiết buổi khám: ${item.patientName}`}
                                className={`w-full h-full min-h-[52px] rounded-xl p-2 flex flex-col justify-between text-left transition-all shadow-xs group ${
                                  isConfirmed
                                    ? 'bg-teal-700 text-white font-extrabold hover:bg-teal-800 ring-1 ring-teal-800 scale-[1.02]'
                                    : isPending
                                    ? 'bg-amber-400 text-amber-950 font-bold hover:bg-amber-500 ring-2 ring-amber-300 animate-pulse'
                                    : 'bg-slate-200 text-slate-500 line-through opacity-60'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="truncate text-[11px] font-extrabold flex items-center gap-1">
                                    <User className="h-3 w-3 shrink-0" />
                                    {item.patientName}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between text-[9px] mt-1 pt-1 border-t border-black/10">
                                  <span>
                                    {isConfirmed ? 'Lịch bận (Đã duyệt)' : isPending ? 'Chờ duyệt ⚡' : 'Đã từ chối'}
                                  </span>
                                  <ChevronRight className="h-3 w-3 shrink-0 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* VIEW 2: LIST VIEW (DANH SÁCH THẺ) */}
          {viewMode === 'list' && (
            <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm space-y-3">
              <div className="space-y-3">
                {bookings.length ? (
                  bookings.map((item) => {
                    const isConfirmed = item.status === 'confirmed'
                    const isCancelled = item.status === 'cancelled'
                    const isCompleted = item.status === 'completed'

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-4 gap-3 hover:border-teal-300 transition-all shadow-2xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <UserRound className="h-4 w-4 text-teal-600 shrink-0" />
                            <strong className="text-sm font-bold text-slate-900">{item.patientName}</strong>
                            {item.patientPhone && <span className="text-xs text-slate-500 font-semibold">({item.patientPhone})</span>}
                            <span
                              className={`ml-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                                isCompleted
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isConfirmed
                                  ? 'bg-teal-700 text-white'
                                  : isCancelled
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-400 text-amber-950 animate-pulse'
                              }`}
                            >
                              {isCompleted
                                ? 'Đã khám'
                                : isConfirmed
                                ? 'Lịch bận (Đã duyệt)'
                                : isCancelled
                                ? 'Đã từ chối'
                                : 'Chờ bác sĩ duyệt'}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600">
                            📅 <span className="font-semibold">{item.date}</span> lúc <span className="font-bold text-teal-700">{item.time}</span> · {item.specialty} ({item.mode === 'online' ? 'Online' : 'Trực tiếp'})
                          </p>
                        </div>

                        {/* Action buttons bar */}
                        <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 shrink-0">
                          <button
                            onClick={() => void handleQuickStatusChange(item, 'confirmed')}
                            disabled={updatingId === item.id || isConfirmed || isCompleted}
                            className="rounded-xl bg-teal-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-40"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => void handleQuickStatusChange(item, 'cancelled')}
                            disabled={updatingId === item.id || isCancelled || isCompleted}
                            className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-40"
                          >
                            Từ chối
                          </button>
                          <Link
                            href={`/counselor/appointments/${item.id}`}
                            className="flex items-center gap-1 rounded-xl border border-teal-600 bg-white px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-50"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>Chi tiết buổi khám</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
                    Chưa có lịch hẹn bệnh nhân nào được gửi tới.
                  </p>
                )}
              </div>
            </section>
          )}

          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 font-heading font-extrabold text-slate-900 text-base">
              <Bell className="h-5 w-5 text-emerald-600" /> Thông báo chuyên môn
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              Hệ thống tự động cập nhật lịch bận và gửi thông báo khi có bệnh nhân đặt lịch hẹn mới.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}



