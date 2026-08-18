'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Bell, Calendar, CheckCircle2, FileText, Pill, Send, UserRound, XCircle, Phone, Clock, AlertCircle, ShieldCheck } from 'lucide-react'
import { DoctorHeader } from '@/components/doctor-header'
import { SiteFooter } from '@/components/site-footer'
import { getBookings, saveCarePlan, saveClinicalRecord, updateBooking, type MindBooking } from '@/lib/mind-care-store'

export default function CounselorAppointmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params?.id as string

  const [booking, setBooking] = useState<MindBooking | null>(null)
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState('Đã hoàn tất buổi tham vấn. Khuyến nghị tiếp tục theo dõi cảm xúc hằng ngày.')
  const [kind, setKind] = useState<'exercise' | 'medicine'>('exercise')
  const [title, setTitle] = useState('Bài tập hít thở 4-7-8 và thư giãn buổi tối')
  const [notes, setNotes] = useState('Thực hiện 10 phút trước khi ngủ. Ghi lại cảm xúc và mức độ căng thẳng.')
  const [message, setMessage] = useState('')
  const [updating, setUpdating] = useState(false)

  const fetchAppointment = async () => {
    setLoading(true)
    if (!bookingId) return

    try {
      const res = await fetch(`/api/bookings?id=${encodeURIComponent(bookingId)}`)
      if (res.ok) {
        const data = await res.json()
        const found = Array.isArray(data) ? data.find((b: MindBooking) => b.id === bookingId) : data
        if (found && found.id) {
          setBooking(found)
          setLoading(false)
          return
        }
      }
    } catch {
      // fallback
    }

    const localBookings = getBookings()
    const foundLocal = localBookings.find((b) => b.id === bookingId)
    if (foundLocal) {
      setBooking(foundLocal)
    }
    setLoading(false)
  }

  useEffect(() => {
    void fetchAppointment()
  }, [bookingId])

  async function handleStatusChange(status: 'confirmed' | 'cancelled') {
    if (!booking) return
    setUpdating(true)

    await fetch('/api/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: booking.id, status }),
    }).catch(() => null)

    const updated = { ...booking, status }
    setBooking(updated)
    updateBooking(updated)
    setUpdating(false)

    if (status === 'confirmed') {
      setMessage(`Đã chấp nhận lịch hẹn với bệnh nhân ${booking.patientName}.`)
    } else {
      setMessage(`Đã từ chối lịch hẹn của bệnh nhân ${booking.patientName}.`)
    }
  }

  async function completeVisit() {
    if (!booking) return
    setUpdating(true)

    await fetch('/api/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: booking.id, status: 'completed' }),
    }).catch(() => null)

    const completed = { ...booking, status: 'completed' as const }
    setBooking(completed)
    updateBooking(completed)
    saveClinicalRecord({
      id: `HS-${Date.now().toString().slice(-6)}`,
      bookingId: booking.id,
      patientName: booking.patientName,
      counselor: booking.counselor,
      completedAt: new Date().toLocaleDateString('vi-VN'),
      summary,
    })
    setUpdating(false)
    setMessage(`Đã hoàn tất buổi khám và lưu hồ sơ cho ${booking.patientName}.`)
  }

  function releasePlan() {
    if (!booking || booking.status !== 'completed') return
    saveCarePlan({
      id: `DT-${Date.now().toString().slice(-6)}`,
      patientName: booking.patientName,
      counselor: booking.counselor,
      kind,
      title,
      notes,
      releasedAt: new Date().toLocaleDateString('vi-VN'),
    })
    setMessage(`Đã phát hành ${kind === 'exercise' ? 'bài tập trị liệu' : 'đơn thuốc'} cho ${booking.patientName}.`)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f4fbf6]">
        <DoctorHeader active="schedule" />
        <main className="flex-1 flex items-center justify-center p-8 text-teal-700 font-bold text-sm">
          Đang tải thông tin buổi khám...
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f4fbf6]">
        <DoctorHeader active="schedule" />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center border border-slate-200 shadow-sm space-y-4">
            <AlertCircle className="mx-auto h-12 w-12 text-rose-500" />
            <h2 className="text-xl font-bold text-slate-800">Không tìm thấy lịch khám</h2>
            <p className="text-xs text-slate-500">Mã lịch khám này không tồn tại hoặc đã bị xóa.</p>
            <button
              onClick={() => router.push('/counselor')}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white hover:bg-teal-700"
            >
              <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
            </button>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f4fbf6]">
      <DoctorHeader active="schedule" />
      <main className="flex-1 pb-12">
        <div className="mx-auto max-w-5xl space-y-5 px-4 py-6">
          {/* Back button and page title */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/counselor')}
              className="inline-flex items-center gap-2 rounded-xl border border-teal-600 bg-white px-4 py-2 text-xs font-bold text-teal-700 hover:bg-teal-50 transition-all shadow-xs"
            >
              <ArrowLeft className="h-4 w-4" /> Quay lại danh sách lịch hẹn
            </button>

            <span
              className={`rounded-full px-3.5 py-1 text-xs font-extrabold ${
                booking.status === 'completed'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : booking.status === 'confirmed'
                  ? 'bg-teal-100 text-teal-800 border border-teal-300'
                  : booking.status === 'cancelled'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {booking.status === 'completed'
                ? 'Đã khám'
                : booking.status === 'confirmed'
                ? 'Đã duyệt lịch'
                : booking.status === 'cancelled'
                ? 'Đã từ chối'
                : 'Chờ duyệt'}
            </span>
          </div>

          {/* Patient Overview Card (Compact) */}
          <section className="rounded-2xl border border-teal-200 bg-white p-4 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-extrabold text-base">
                  {booking.patientName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-lg font-extrabold text-slate-900">{booking.patientName}</h1>
                  <p className="text-xs text-slate-500">
                    SĐT: <span className="font-semibold text-slate-700">{booking.patientPhone || 'Chưa cập nhật'}</span>
                  </p>
                </div>
              </div>

              {/* Status change actions if pending */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => void handleStatusChange('confirmed')}
                  disabled={updating || booking.status === 'confirmed'}
                  className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  Duyệt lịch
                </button>
                <button
                  onClick={() => void handleStatusChange('cancelled')}
                  disabled={updating || booking.status === 'cancelled'}
                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
                >
                  Từ chối
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 font-medium block">Ngày & Giờ tham vấn:</span>
                <strong className="text-slate-800">{booking.date} lúc {booking.time}</strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Chuyên khoa & Hình thức:</span>
                <strong className="text-slate-800">{booking.specialty} ({booking.mode === 'online' ? 'Online' : 'Trực tiếp'})</strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Bác sĩ phụ trách:</span>
                <strong className="text-slate-800">{booking.counselor}</strong>
              </div>
              {booking.symptoms && (
                <div className="sm:col-span-3 pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-medium block mb-0.5">Lý do khám / Triệu chứng:</span>
                  <p className="text-slate-700 italic font-medium">{booking.symptoms}</p>
                </div>
              )}
            </div>
          </section>

          {message && (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Dynamic Exam Sections for this specific booking */}
          <section className="grid gap-5 lg:grid-cols-2">
            {/* Section 1: Clinical Notes & Completion */}
            <div className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm space-y-3">
              <h2 className="flex items-center gap-2 font-heading font-extrabold text-slate-900">
                <FileText className="h-5 w-5 text-emerald-600" /> Hoàn tất buổi khám & Ghi chép
              </h2>
              <p className="text-xs text-slate-500">Sau khi xác nhận, lịch sử khám sẽ xuất hiện trong hồ sơ bệnh nhân.</p>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={5}
                className="w-full rounded-2xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => void completeVisit()}
                disabled={booking.status === 'completed' || updating}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
              >
                {booking.status === 'completed' ? 'Đã hoàn tất khám' : 'Xác nhận hoàn tất khám'}
              </button>
            </div>

            {/* Section 2: Release Care Plan / Prescriptions */}
            <div className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm space-y-3">
              <h2 className="flex items-center gap-2 font-heading font-extrabold text-slate-900">
                <Pill className="h-5 w-5 text-emerald-600" /> Phát hành đơn / bài tập
              </h2>
              <p className="text-xs text-slate-500">Chỉ phát hành sau khi buổi khám đã hoàn tất.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setKind('exercise')}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold ${kind === 'exercise' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  Bài tập trị liệu
                </button>
                <button
                  onClick={() => setKind('medicine')}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold ${kind === 'medicine' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  Đơn thuốc
                </button>
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-emerald-500"
              />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-emerald-500"
              />
              <button
                onClick={releasePlan}
                disabled={booking.status !== 'completed'}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                Phát hành cho bệnh nhân
              </button>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
