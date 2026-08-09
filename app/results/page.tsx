'use client'

import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BachMaiNav } from '@/components/bachmai-nav'
import { ClipboardList, Download, Calendar, UserCheck, ShieldCheck, ArrowRight, Heart } from 'lucide-react'
import Link from 'next/link'
import jsPDF from 'jspdf'

export default function ResultsPage() {
  const exportPdf = () => {
    const pdf = new jsPDF()
    pdf.setFontSize(18); pdf.text('MIND CARE - PHIEU KET QUA DASS-21', 20, 24)
    pdf.setFontSize(11); pdf.text(['Chua co du lieu DASS-21 de ket xuat.', 'Hoan thanh bai sang loc de tao phieu ket qua.'], 20, 40)
    pdf.save('Phieu-ket-qua-DASS-21.pdf')
  }
  const records: { id: string; testName: string; score: string; level: string; date: string; doctor: string; advice: string; statusColor: string }[] = []

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader active="results" />

      <main className="flex-1 py-6 pb-16 md:pb-12">
        <div className="mx-auto max-w-3xl px-4 space-y-6">

          {/* Header Banner */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-heading text-lg sm:text-xl font-extrabold text-teal-900">
                  Kết Quả & Hồ Sơ Tâm Lý
                </h1>
                <p className="text-xs text-slate-500 font-medium">Chưa có kết quả sàng lọc nào.</p>
              </div>
            </div>

            <button onClick={exportPdf} className="hidden sm:flex items-center gap-1.5 rounded-xl border border-teal-600 bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-700 hover:bg-teal-100 transition-colors">
              <Download className="h-4 w-4" />
              <span>Tải báo cáo PDF</span>
            </button>
          </div>

          {/* Records List */}
          <div className="space-y-4">
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Lịch sử làm bài trắc nghiệm & chẩn đoán
            </h2>

            {records.map((rec) => (
              <div
                key={rec.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 hover:border-teal-300 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400">Mã phiếu: {rec.id}</span>
                    <h3 className="font-heading font-extrabold text-slate-900 text-base">{rec.testName}</h3>
                  </div>
                  <span className={`rounded-xl border px-3 py-1 text-xs font-extrabold ${rec.statusColor}`}>
                    {rec.score} • {rec.level}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4 text-teal-600 shrink-0" />
                    <span>Ngày đánh giá: <strong className="text-slate-800">{rec.date}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <UserCheck className="h-4 w-4 text-teal-600 shrink-0" />
                    <span>Chuyên gia phụ trách: <strong className="text-slate-800">{rec.doctor}</strong></span>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700 border border-slate-100">
                  <span className="font-bold text-teal-800 block mb-0.5">💡 Lời khuyên chuyên môn:</span>
                  <p className="leading-relaxed font-medium">{rec.advice}</p>
                </div>
              </div>
            ))}
            {records.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                Hồ sơ trống. Hãy hoàn thành bài sàng lọc DASS-21 để tạo kết quả đầu tiên.
              </div>
            )}
          </div>

          {/* CTA Banner */}
          <div className="rounded-3xl bg-teal-900 text-white p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-emerald-300 fill-emerald-300/20 shrink-0" />
              <div>
                <h4 className="font-bold text-sm sm:text-base">Bạn muốn tham vấn sâu hơn với Chuyên gia?</h4>
                <p className="text-xs text-teal-200 mt-0.5">Đặt lịch tư vấn 1-1 trực tuyến cùng bác sĩ chuyên khoa Mind Care.</p>
              </div>
            </div>
            <Link
              href="/booking"
              className="rounded-2xl bg-white px-4 py-2.5 text-xs font-extrabold text-teal-900 hover:bg-teal-50 shrink-0 transition-transform active:scale-95"
            >
              Đặt lịch ngay
            </Link>
          </div>

        </div>
      </main>

      <SiteFooter />
      <BachMaiNav />
    </div>
  )
}
