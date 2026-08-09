'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { 
  Calendar, Clock, User, ClipboardList, Pill, Star, CheckCircle2, 
  Search, Filter, Plus, Send, AlertTriangle, FileText, ChevronRight, LogOut
} from 'lucide-react'

export default function CounselorPage() {
  const router = useRouter()
  const [selectedPatient, setSelectedPatient] = useState<string>('')
  const [treatmentType, setTreatmentType] = useState<'exercise' | 'medicine'>('exercise')
  const [prescTitle, setPrescTitle] = useState('Bài tập hít thở 4-7-8 & Thiền định thư giãn tối')
  const [prescNotes, setPrescNotes] = useState('Thực hiện 15 phút trước khi đi ngủ. Duy trì nhật ký cảm xúc hàng ngày.')
  const [successMsg, setSuccessMsg] = useState('')

  const appointments: { id: string; patientName: string; age: number; gender: string; time: string; specialty: string; testResult: string; status: string; statusBg: string }[] = []

  const handleSendPrescription = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg(`Đã kê ${treatmentType === 'exercise' ? 'lộ trình bài tập' : 'đơn thuốc điện tử'} thành công cho bệnh nhân ${selectedPatient}!`)
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  const handleLogout = () => {
    document.cookie = 'is_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader active="dashboard" />

      <main className="flex-1 py-6 pb-16 md:pb-12">
        <div className="mx-auto max-w-5xl px-4 space-y-6">

          {/* Counselor Profile Header */}
          <section className="rounded-3xl bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white border border-white/20 text-xl font-bold backdrop-blur-xs">
                BS
              </div>
              <div>
                <span className="inline-block text-[11px] font-bold tracking-wider text-emerald-200 uppercase bg-white/10 px-2.5 py-0.5 rounded-full mb-1">
                  BẢNG ĐIỀU KHIỂN CHUYÊN VIÊN TƯ VẤN
                </span>
                <h1 className="font-heading text-xl sm:text-2xl font-extrabold">
                  Chưa có hồ sơ chuyên gia
                </h1>
                <p className="text-xs text-teal-100 font-medium">Khoa Tư vấn & Trị liệu Tâm lý Mind Care</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 border border-white/20 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </section>

          {/* Key Metrics Grid */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Lịch tư vấn hôm nay</span>
              <span className="text-2xl font-extrabold text-teal-700 mt-1 block">0 ca</span>
              <span className="text-[11px] font-bold text-slate-500">Chưa có lịch hẹn</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Hồ sơ bệnh nhân mới</span>
              <span className="text-2xl font-extrabold text-teal-700 mt-1 block">0 hồ sơ</span>
              <span className="text-[11px] font-bold text-slate-500">Chưa có dữ liệu</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Đánh giá dịch vụ</span>
              <span className="text-2xl font-extrabold text-slate-400 mt-1 block">—</span>
              <span className="text-[11px] font-bold text-slate-500">Chưa có nhận xét</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Đơn thuốc / Lộ trình</span>
              <span className="text-2xl font-extrabold text-indigo-700 mt-1 block">0</span>
              <span className="text-[11px] font-bold text-slate-500">Chưa phát hành</span>
            </div>
          </section>

          {/* Section 1: Patient Appointment List */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-teal-600" />
                <h2 className="font-heading text-lg font-bold text-slate-900">
                  Danh sách Bệnh nhân Đặt lịch Tư vấn
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">Cập nhật lúc 20:45</span>
            </div>

            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 hover:border-teal-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">{apt.patientName}</h3>
                      <span className="text-xs text-slate-500 font-medium">({apt.gender}, {apt.age} tuổi)</span>
                      <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md ${apt.statusBg}`}>
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-teal-800">{apt.specialty}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-teal-600" /> {apt.time}</span>
                      <span className="flex items-center gap-1 text-slate-700 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                        📋 {apt.testResult}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedPatient(apt.patientName)}
                      className="rounded-xl bg-teal-600 text-white font-bold text-xs px-3.5 py-2 hover:bg-teal-700 transition-colors shadow-xs"
                    >
                      Kê đơn / Bài tập
                    </button>
                  </div>
                </div>
              ))}
              {appointments.length === 0 && <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">Chưa có lịch hẹn hoặc hồ sơ bệnh nhân.</p>}
            </div>
          </section>

          {/* Section 2: Prescription & Therapy Plan Tool */}
          <section className="rounded-3xl border border-teal-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Pill className="h-5 w-5 text-teal-600" />
              <h2 className="font-heading text-lg font-bold text-slate-900">
                Công cụ Kê Đơn Thuốc Điện Tử & Bài Tập Thư Giãn
              </h2>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSendPrescription} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Bệnh nhân nhận đơn</label>
                  <select
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:border-teal-600 focus:outline-none"
                  >
                    {appointments.map((a) => (
                      <option key={a.id} value={a.patientName}>
                        {a.patientName} ({a.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Loại kê duyệt</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTreatmentType('exercise')}
                      className={`flex-1 rounded-xl py-2.5 text-xs font-bold border transition-all ${
                        treatmentType === 'exercise'
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      🧘 Bài tập thư giãn / Lộ trình
                    </button>
                    <button
                      type="button"
                      onClick={() => setTreatmentType('medicine')}
                      className={`flex-1 rounded-xl py-2.5 text-xs font-bold border transition-all ${
                        treatmentType === 'medicine'
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      💊 Đơn thuốc hỗ trợ
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tên bài tập / Đơn thuốc</label>
                <input
                  type="text"
                  value={prescTitle}
                  onChange={(e) => setPrescTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:border-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Hướng dẫn chi tiết & Nhắc nhở cho bệnh nhân</label>
                <textarea
                  rows={3}
                  value={prescNotes}
                  onChange={(e) => setPrescNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:border-teal-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 text-white font-bold text-xs sm:text-sm px-6 py-2.5 shadow-md hover:bg-teal-700 transition-colors w-full sm:w-auto"
              >
                <Send className="h-4 w-4" />
                <span>Gửi trực tiếp tới tài khoản bệnh nhân</span>
              </button>
            </form>
          </section>

        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
