'use client'

import { useState } from 'react'
import { Calendar as CalendarIcon, Clock, User, ChevronDown, Check, ArrowLeft, ArrowRight, ShieldCheck, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

const TITLES = [
  'Tất cả chức danh',
  'PGS.TS - Chuyên gia Cao cấp',
  'Tiến sĩ - Bác sĩ Chuyên khoa II',
  'Thạc sĩ Tâm lý Lâm sàng',
  'Chuyên gia Trị liệu Cận tâm lý',
]

const DATES = Array.from({ length: 6 }, (_, index) => {
  const value = new Date()
  value.setDate(value.getDate() + index + 1)
  const date = value.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
  const day = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][value.getDay()]
  return { day, date, year: String(value.getFullYear()), full: value.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }) }
})

const DEPARTMENTS = [
  {
    id: 'kambenh',
    name: '(Khoa 1) Khoa Tư vấn & Trị liệu Tâm lý',
    specialties: [
      { id: 'daliau', name: 'CK. Tư vấn Trầm cảm & Lo âu' },
      { id: 'hocduong', name: 'CK. Tâm lý Học đường & Giới trẻ' },
      { id: 'honnhan', name: 'CK. Tâm lý Hôn nhân & Gia đình' },
      { id: 'rloangiacngu', name: 'CK. Rối loạn Giấc ngủ & Stress' },
    ],
  },
]

const TIME_SLOTS = [
  '06:15', '07:45', '08:00', '09:00',
  '13:00', '13:45', '15:15', '15:45',
  '16:15', '16:45',
]

export function BookingFlow() {
  const [step, setStep] = useState(2)
  const [selectedTitle, setSelectedTitle] = useState(TITLES[0])
  const [selectedDate, setSelectedDate] = useState(DATES[0])
  const [selectedSpecialty, setSelectedSpecialty] = useState('CK. Tư vấn Trầm cảm & Lo âu')
  const [selectedTime, setSelectedTime] = useState('09:00')
  const [selectedCounselor, setSelectedCounselor] = useState('ThS. Nguyễn Minh An')
  const [sessionMode, setSessionMode] = useState<'online' | 'offline'>('online')
  const [patientName, setPatientName] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [bookingError, setBookingError] = useState('')

  async function confirmBooking() {
    setSubmitting(true)
    setBookingError('')
    const [day, month] = selectedDate.date.split('/')
    const year = selectedDate.year
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientName, patientPhone, symptoms, selectedCounselor, selectedSpecialty, mode: sessionMode, scheduledAt: `${year}-${month}-${day}T${selectedTime}:00+07:00` }),
    }).catch(() => null)
    setSubmitting(false)
    if (!response?.ok) {
      const payload = response ? await response.json().catch(() => ({})) : {}
      setBookingError(payload.message || 'Không thể đặt lịch. Vui lòng thử lại.')
      return
    }
    setStep(4)
  }

  return (
    <div className="mx-auto max-w-xl px-2 py-4 sm:px-4">
      {/* Container Frame styled after Bach Mai App Mobile Window */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xl">
        {/* Step Indicator Header (1 - 2 - 3 - 4) */}
        <div className="mb-6 flex items-center justify-center gap-2 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full font-bold text-sm transition-all',
                  step === i
                    ? 'bg-teal-600 text-white ring-4 ring-teal-100 shadow-md scale-110'
                    : step > i
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-400'
                )}
              >
                {step > i ? <Check className="h-5 w-5" /> : i}
              </div>
              {i < 4 && (
                <div
                  className={cn(
                    'h-1 w-6 sm:w-10 rounded-full mx-1 transition-colors',
                    step > i ? 'bg-emerald-500' : 'bg-slate-200'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <h2 className="mb-4 text-center font-heading text-xl font-bold text-teal-900">
          {step === 1 && 'Chọn Chức Danh & Khoa Khám'}
          {step === 2 && 'Đặt lịch theo chuyên khoa'}
          {step === 3 && 'Điền thông tin người khám'}
          {step === 4 && 'Xác nhận phiếu hẹn tư vấn'}
        </h2>

        {/* STEP 2: Main Bach Mai Style Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Chuyên gia / Thầy cô mong muốn</label>
              <select value={selectedCounselor} onChange={(e) => setSelectedCounselor(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 focus:border-teal-600 focus:outline-none">
                <option>ThS. Nguyễn Minh An</option>
                <option>BS. Trần Thu Hà</option>
                <option>Chuyên gia Lê Gia Hân</option>
                <option>Đặng Hiếu</option>
              </select>
              <p className="mt-1 text-[11px] text-slate-500">Chọn chuyên gia phù hợp với nhu cầu của bạn.</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Hình thức tham vấn</label>
              <div className="grid grid-cols-2 gap-2">
                {([['online', 'Trực tuyến'], ['offline', 'Tại phòng khám']] as const).map(([value, label]) => (
                  <button key={value} type="button" onClick={() => setSessionMode(value)} className={cn('rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors', sessionMode === value ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600')}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {/* Title Selector Dropdown */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Chức danh Chuyên gia</label>
              <div className="relative">
                <select
                  value={selectedTitle}
                  onChange={(e) => setSelectedTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100 shadow-xs appearance-none"
                >
                  {TITLES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Horizontal Date Selector */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Chọn Ngày Khám</label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {DATES.map((d) => {
                  const isSelected = selectedDate.date === d.date
                  return (
                    <button
                      key={d.date}
                      onClick={() => setSelectedDate(d)}
                      className={cn(
                        'flex flex-col items-center justify-center rounded-xl px-3.5 py-2 min-w-[70px] border transition-all',
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-md'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300'
                      )}
                    >
                      <span className="text-xs font-semibold">{d.date}</span>
                      <span className="text-sm font-extrabold mt-0.5">{d.day}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Accordion Department Box */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden">
              <div className="bg-teal-700 px-4 py-2.5 text-white font-bold text-sm flex items-center justify-between">
                <span>{DEPARTMENTS[0].name}</span>
                <ChevronDown className="h-4 w-4" />
              </div>

              <div className="p-3 space-y-2">
                <div className="bg-emerald-100/70 text-emerald-900 px-3 py-2 rounded-lg font-bold text-xs flex items-center justify-between">
                  <span>{selectedSpecialty}</span>
                  <ChevronDown className="h-4 w-4" />
                </div>

                {/* Time Slots Grid */}
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-500 mb-2 block">Chọn khung giờ khả dụng:</span>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-4">
                    {TIME_SLOTS.map((t) => {
                      const isSelected = selectedTime === t
                      return (
                        <button
                          key={t}
                          onClick={() => setSelectedTime(t)}
                          className={cn(
                            'rounded-xl py-2 text-xs font-bold border transition-all text-center',
                            isSelected
                              ? 'bg-teal-600 text-white border-teal-600 ring-2 ring-teal-200 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50/50'
                          )}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Patient Information Form */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Họ và tên người tư vấn</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-semibold text-slate-800 focus:border-teal-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Số điện thoại liên hệ</label>
              <input
                type="text"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-semibold text-slate-800 focus:border-teal-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Mô tả lý do / Trạng thái sức khỏe tinh thần</label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-medium text-slate-800 focus:border-teal-600 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Success Ticket */}
        {step === 4 && (
          <div className="rounded-2xl border-2 border-dashed border-teal-200 bg-emerald-50/40 p-5 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="font-heading text-lg font-extrabold text-teal-900">Đặt Lịch Thành Công!</h3>
            <p className="mt-1 text-xs text-slate-600">Phòng khám Mind Care đã ghi nhận lịch hẹn của bạn.</p>

            <div className="mt-4 rounded-xl bg-white p-4 text-left text-xs space-y-2 border border-emerald-100 shadow-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Mã phiếu hẹn:</span>
                <span className="font-extrabold text-teal-700">MC-2025-8892</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Họ và tên:</span>
                <span className="font-bold text-slate-800">{patientName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Ngày tư vấn:</span>
                <span className="font-bold text-slate-800">{selectedDate.full}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Khung giờ:</span>
                <span className="font-bold text-emerald-700">{selectedTime}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Chuyên gia:</span>
                <span className="font-bold text-slate-800">{selectedCounselor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chuyên khoa:</span>
                <span className="font-bold text-slate-800">{selectedSpecialty}</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons (Quay lại / Tiếp theo) */}
        <div className="mt-6 flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            disabled={step === 1}
            className={cn(
              'flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold border transition-all',
              step === 1
                ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                : 'border-teal-600 bg-white text-teal-700 hover:bg-teal-50'
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </button>

          <button
            disabled={submitting || (step === 3 && (!patientName.trim() || !patientPhone.trim() || !selectedCounselor))}
            onClick={() => {
              if (step === 3) { void confirmBooking() }
              else if (step < 4) setStep((prev) => prev + 1)
              else setStep(2)
            }}
            className="flex items-center gap-2 rounded-2xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-teal-700 transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>{submitting ? 'Đang lưu lịch hẹn...' : step === 4 ? 'Đặt lịch mới' : step === 3 ? 'Xác nhận đặt lịch' : 'Tiếp theo'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        {bookingError && <p role="alert" className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{bookingError}</p>}
      </div>
    </div>
  )
}
