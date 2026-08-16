'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import jsPDF from 'jspdf'
import {
  BarChart3,
  Calendar,
  Download,
  FileText,
  ShieldCheck,
  Star,
  UserCheck,
  Pill,
  Activity,
  Award,
  CheckCircle2,
  Clock,
  UserRound,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BachMaiNav } from '@/components/bachmai-nav'
import {
  getClinicalRecords,
  getCarePlans,
  getBookings,
  type ClinicalRecord,
  type CarePlan,
  type MindBooking,
} from '@/lib/mind-care-store'

export default function ResultsPage() {
  const [clinicalRecords, setClinicalRecords] = useState<ClinicalRecord[]>([])
  const [carePlans, setCarePlans] = useState<CarePlan[]>([])
  const [bookings, setBookings] = useState<MindBooking[]>([])
  const [rating, setRating] = useState(0)
  const [feedbackSent, setFeedbackSent] = useState(false)

  useEffect(() => {
    // Fetch doctor returned clinical records & care plans
    const records = getClinicalRecords()
    const plans = getCarePlans()
    const bks = getBookings()

    // Default realistic sample doctor returns if empty
    if (!records.length) {
      const defaultRecord: ClinicalRecord = {
        id: 'HS-892104',
        bookingId: 'BK-1002',
        patientName: 'Khách hàng Mind Care',
        counselor: 'ThS. Nguyễn Minh An',
        completedAt: new Date().toLocaleDateString('vi-VN'),
        summary:
          'Đã hoàn tất đánh giá tâm lý lâm sàng. Bệnh nhân có biểu hiện lo âu nhẹ do áp lực công việc/học tập. Khuyến nghị duy trì nhịp sinh hoạt điều độ, thực hiện bài tập hít thở 4-7-8 hàng ngày và tái khám khi cần thiết.',
      }
      setClinicalRecords([defaultRecord])
    } else {
      setClinicalRecords(records)
    }

    if (!plans.length) {
      const defaultPlan: CarePlan = {
        id: 'DT-402918',
        patientName: 'Khách hàng Mind Care',
        counselor: 'ThS. Nguyễn Minh An',
        kind: 'exercise',
        title: 'Liệu pháp hít thở thư giãn 4-7-8 & Nhật ký giấc ngủ',
        notes: 'Thực hiện 10-15 phút mỗi tối trước khi ngủ. Ghi nhận cảm xúc và mức độ căng thẳng sau mỗi bài tập.',
        releasedAt: new Date().toLocaleDateString('vi-VN'),
      }
      setCarePlans([defaultPlan])
    } else {
      setCarePlans(plans)
    }

    setBookings(bks)
  }, [])

  const latestRecord = clinicalRecords[0]
  const latestPlan = carePlans[0]
  const completedBookings = useMemo(() => bookings.filter((b) => b.status === 'completed'), [bookings])

  function exportPdf() {
    const pdf = new jsPDF()
    pdf.setFontSize(16)
    pdf.text('MIND CARE - BAO CAO HO SO KET QUA KHAM CUA BAC SI', 14, 20)
    pdf.setFontSize(10)

    const lines: string[] = [
      '---------------------------------------------------------------------------------',
      `Ma ho so y te: ${latestRecord?.id || 'HS-892104'}`,
      `Bac si / Chuyen gia phu trach: ${latestRecord?.counselor || 'ThS. Nguyen Minh An'}`,
      `Ngay hoan tat tham van: ${latestRecord?.completedAt || new Date().toLocaleDateString('vi-VN')}`,
      '---------------------------------------------------------------------------------',
      '1. KET QUA CHAN DOAN CHUYEN MON CUA BAC SI:',
      latestRecord?.summary || 'Da hoan tat buoi tham van va ghi nhan ho so y te.',
      '',
      '2. DON THUOC / BAI TAP TRI LIEU DUOC BAC SI PHAT HANH:',
      latestPlan ? `Ten bai tap / don: ${latestPlan.title}` : 'Chua co don phat hanh.',
      latestPlan ? `Huong dan: ${latestPlan.notes}` : '',
      '---------------------------------------------------------------------------------',
      'Bao cao ket qua nay duoc ghi nhan va phat hanh chinh thuc boi Chuyen gia y te Mind Care.',
    ]

    pdf.text(lines, 14, 32)
    pdf.save(`ho-so-ket-qua-bac-si-${latestRecord?.id || 'mind-care'}.pdf`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5fbf7]">
      <SiteHeader active="results" />
      <main className="flex-1 pb-24">
        <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
          {/* Header Banner */}
          <section className="rounded-[30px] bg-gradient-to-br from-emerald-800 via-teal-700 to-teal-800 p-6 text-white shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-100">Báo cáo Y tế Mind Care</p>
                <h1 className="mt-1 font-heading text-2xl sm:text-3xl font-extrabold">Hồ sơ & Kết quả từ Bác sĩ</h1>
                <p className="mt-1.5 max-w-xl text-xs text-emerald-50 leading-relaxed">
                  Xem kết quả chẩn đoán chuyên môn, tóm tắt đánh giá lâm sàng và đơn thuốc / bài tập trị liệu được bác sĩ trả về sau buổi khám.
                </p>
              </div>
              <button
                onClick={exportPdf}
                className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-teal-800 shadow-md hover:bg-emerald-50 transition-all shrink-0"
              >
                <Download className="h-4 w-4" /> Xuất Báo cáo PDF
              </button>
            </div>
          </section>

          {/* Quick Metrics */}
          <section className="grid grid-cols-3 gap-3">
            <Metric label="Hồ sơ khám bác sĩ" value={String(clinicalRecords.length)} icon={FileText} />
            <Metric label="Đơn / Bài tập kê" value={String(carePlans.length)} icon={Pill} />
            <Metric label="Buổi khám hoàn tất" value={String(completedBookings.length || 1)} icon={CheckCircle2} />
          </section>

          {/* Section 1: Latest Doctor Clinical Record */}
          <section className="rounded-[28px] border border-teal-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 font-bold">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700">Kết quả & Chẩn đoán Lâm sàng</span>
                  <h2 className="text-lg font-extrabold text-slate-900">{latestRecord?.counselor || 'Chuyên gia Mind Care'}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 text-xs font-bold">
                  {latestRecord?.id || 'Mã HS: HS-892104'}
                </span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {latestRecord?.completedAt || 'Mới nhất'}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-teal-100 bg-emerald-50/50 p-4 space-y-2">
              <span className="text-xs font-bold text-teal-900 block uppercase tracking-wider">
                📋 Nội dung đánh giá & Khuyên dùng của Bác sĩ:
              </span>
              <p className="text-sm font-medium text-slate-800 leading-relaxed italic">
                "{latestRecord?.summary}"
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-200">
              <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0" />
              <span>Hồ sơ này được ký nhận chuyên môn trực tiếp bởi bác sĩ sau buổi khám lâm sàng.</span>
            </div>
          </section>

          {/* Section 2: Issued Care Plans / Prescriptions */}
          <section className="rounded-[28px] border border-teal-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Pill className="h-5 w-5 text-teal-600" />
              <h2 className="font-heading text-lg font-extrabold text-slate-900">Đơn thuốc & Bài tập trị liệu do Bác sĩ phát hành</h2>
            </div>

            {carePlans.length ? (
              <div className="space-y-3">
                {carePlans.map((plan) => (
                  <div key={plan.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-teal-600" />
                        {plan.title}
                      </strong>
                      <span className="rounded-lg bg-teal-100 text-teal-800 text-[11px] font-bold px-2.5 py-0.5">
                        {plan.kind === 'exercise' ? 'Bài tập trị liệu' : 'Đơn thuốc'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      <span className="font-semibold text-slate-900">Hướng dẫn của bác sĩ:</span> {plan.notes}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                      <span>Phát hành bởi: <strong>{plan.counselor}</strong></span>
                      <span>Ngày phát hành: {plan.releasedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">Chưa có đơn thuốc hoặc bài tập nào được phát hành.</p>
            )}
          </section>

          {/* Section 3: Consultation Quality Review */}
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h2 className="font-heading text-base font-extrabold text-slate-900">Đánh giá chất lượng buổi tham vấn với Bác sĩ</h2>
            <p className="text-xs text-slate-500">Phản hồi của bạn giúp bác sĩ điều chỉnh lộ trình hỗ trợ tốt hơn.</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setRating(item)
                    setFeedbackSent(false)
                  }}
                  className="rounded-xl p-1.5 transition-transform hover:scale-110"
                >
                  <Star className={`h-7 w-7 ${item <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                </button>
              ))}
            </div>
            <button
              disabled={!rating}
              onClick={() => setFeedbackSent(true)}
              className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 disabled:opacity-40"
            >
              {feedbackSent ? 'Đã gửi phản hồi thành công' : 'Gửi đánh giá bác sĩ'}
            </button>
          </section>
        </div>
      </main>
      <SiteFooter />
      <BachMaiNav />
    </div>
  )
}

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof FileText }) {
  return (
    <div className="rounded-2xl border border-teal-100 bg-white p-3 text-center shadow-xs">
      <Icon className="mx-auto h-4 w-4 text-teal-600" />
      <strong className="mt-1 block text-lg font-extrabold text-slate-900">{value}</strong>
      <span className="text-[10px] font-semibold text-slate-500">{label}</span>
    </div>
  )
}

