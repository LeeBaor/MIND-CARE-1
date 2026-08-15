'use client'

import { useEffect, useState } from 'react'
import { Calendar as CalendarIcon, Clock, User, ChevronDown, Check, ArrowLeft, ArrowRight, ShieldCheck, Heart, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { saveBooking } from '@/lib/mind-care-store'

interface ExpertItem {
  id: string
  name: string
  specialty?: string
  email?: string
}

interface DateOption {
  day: string
  date: string
  full: string
  isoDate: string
}

function getDynamicDates(): DateOption[] {
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
  const [experts, setExperts] = useState<ExpertItem[]>([])
  const [loadingExperts, setLoadingExperts] = useState(true)
  const [dates, setDates] = useState<DateOption[]>([])
  const [selectedDate, setSelectedDate] = useState<DateOption>({ day: '', date: '', full: '', isoDate: '' })
  const [selectedSpecialty, setSelectedSpecialty] = useState('CK. Tư vấn Trầm cảm & Lo âu')
  const [selectedTime, setSelectedTime] = useState('09:00')
  const [busySlots, setBusySlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedCounselor, setSelectedCounselor] = useState('')
  const [sessionMode, setSessionMode] = useState<'online' | 'offline'>('online')
  const [patientName, setPatientName] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [bookingError, setBookingError] = useState('')

  useEffect(() => {
    const generatedDates = getDynamicDates()
    setDates(generatedDates)
    setSelectedDate(generatedDates[0])

    fetch('/api/experts')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: ExpertItem[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setExperts(data)
          setSelectedCounselor(data[0].name)
        }
      })
      .catch(() => {})
      .finally(() => setLoadingExperts(false))
  }, [])

  // Fetch busy slots whenever counselor or date changes
  useEffect(() => {
    if (!selectedCounselor || !selectedDate.isoDate) return
    setLoadingSlots(true)
    fetch(`/api/bookings?counselor=${encodeURIComponent(selectedCounselor)}&date=${encodeURIComponent(selectedDate.isoDate)}&action=busySlots`)
      .then((res) => (res.ok ? res.json() : { busySlots: [] }))
      .then((data) => {
        if (Array.isArray(data.busySlots)) {
          setBusySlots(data.busySlots)
          // If selected time is busy, reset selectedTime to first available time
          if (data.busySlots.includes(selectedTime)) {
            const firstAvailable = TIME_SLOTS.find((t) => !data.busySlots.includes(t))
            if (firstAvailable) setSelectedTime(firstAvailable)
          }
        } else {
          setBusySlots([])
        }
      })
      .catch(() => setBusySlots([]))
      .finally(() => setLoadingSlots(false))
  }, [selectedCounselor, selectedDate])

  async function confirmBooking() {
    setSubmitting(true)
    setBookingError('')
    const isoDateStr = selectedDate.isoDate || new Date().toISOString().split('T')[0]
    const scheduledAt = `${isoDateStr}T${selectedTime}:00+07:00`

    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientName,
        patientPhone,
        symptoms,
        selectedCounselor,
        selectedSpecialty,
        mode: sessionMode,
        scheduledAt,
      }),
    }).catch(() => null)

    setSubmitting(false)
    if (!response?.ok) {
      const payload = response ? await response.json().catch(() => ({})) : {}
      setBookingError(payload.message || 'Khung giờ này không thể đặt. Vui lòng thử lại.')
      return
    }

    const persisted = await response.json()
    saveBooking({
      id: persisted.bookingId,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      symptoms: symptoms.trim(),
      patientEmail: document.cookie.split('; ').find((value) => value.startsWith('user_email='))?.split('=')[1] || '',
      counselor: selectedCounselor,
      specialty: selectedSpecialty,
      date: selectedDate.full,
      time: selectedTime,
      mode: sessionMode,
      status: 'pending',
    })
    setStep(4)
  }

  return (
    <div className="mx-auto max-w-xl px-2 py-4 sm:px-4">
      {/* Container Frame */}
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
          {step === 1 && 'Chọn Khoa Khám & Chuyên Gia'}
          {step === 2 && 'Đặt lịch theo chuyên khoa'}
          {step === 3 && 'Điền thông tin người khám'}
          {step === 4 && 'Xác nhận phiếu hẹn tư vấn'}
        </h2>

        {/* STEP 2: Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Chuyên gia mong muốn</label>
              <select
                value={selectedCounselor}
                onChange={(e) => setSelectedCounselor(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 focus:border-teal-600 focus:outline-none"
              >
                {loadingExperts ? (
                  <option value="">Đang tải danh sách chuyên gia...</option>
                ) : (
                  experts.map((exp) => (
                    <option key={exp.id || exp.name} value={exp.name}>
                      {exp.name} {exp.specialty ? `(${exp.specialty})` : ''}
                    </option>
                  ))
                )}
              </select>
              <p className="mt-1 text-[11px] text-slate-500">Chọn chuyên gia từ danh sách dữ liệu hệ thống.</p>
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

            {/* Horizontal Date Selector */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Chọn Ngày Khám</label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {dates.map((d) => {
                  const isSelected = selectedDate.isoDate === d.isoDate
                  return (
                    <button
                      key={d.isoDate || d.date}
                      type="button"
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
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500">Chọn khung giờ khả dụng:</span>
                    {loadingSlots && <span className="text-[11px] text-teal-600 animate-pulse">Đang kiểm tra lịch...</span>}
                  </div>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-4">
                    {TIME_SLOTS.map((t) => {
                      const isSelected = selectedTime === t
                      const isBusy = busySlots.includes(t)
                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={isBusy}
                          onClick={() => !isBusy && setSelectedTime(t)}
                          className={cn(
                            'rounded-xl py-2 text-xs font-bold border transition-all text-center flex flex-col items-center justify-center',
                            isBusy
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through opacity-70'
                              : isSelected
                              ? 'bg-teal-600 text-white border-teal-600 ring-2 ring-teal-200 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50/50'
                          )}
                        >
                          <span>{t}</span>
                          {isBusy && <span className="text-[9px] font-normal no-underline text-rose-500">Đã đặt</span>}
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
          <div className="rounded-2xl border border-teal-200 bg-emerald-50/40 p-4 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-base font-extrabold text-teal-900">Đặt Lịch Thành Công!</h3>
            <p className="mt-0.5 text-xs text-slate-600">Lịch hẹn đã được gửi đến bác sĩ/chuyên gia và đang chờ duyệt.</p>

            <div className="mt-3 rounded-xl bg-white p-3 text-left text-xs space-y-1.5 border border-slate-200">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Trạng thái:</span>
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px]">Chờ bác sĩ duyệt</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Họ và tên:</span>
                <span className="font-semibold text-slate-800">{patientName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Thời gian:</span>
                <span className="font-bold text-teal-700">{selectedDate.date} lúc {selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chuyên gia:</span>
                <span className="font-semibold text-slate-800">{selectedCounselor}</span>
              </div>
            </div>
          </div>
        )}
        <div className="mt-6 flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <button
            type="button"
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
            type="button"
            disabled={submitting || (step === 2 && busySlots.includes(selectedTime)) || (step === 3 && (!patientName.trim() || !patientPhone.trim() || !selectedCounselor))}
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
        {bookingError && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-rose-600" />
            <span>{bookingError}</span>
          </div>
        )}
      </div>
    </div>
  )
}

