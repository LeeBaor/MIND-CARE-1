'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { BarChart3, Calendar, Download, FileText, ShieldCheck, Star, TrendingUp } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BachMaiNav } from '@/components/bachmai-nav'
import { getAssessments, type MindAssessment } from '@/lib/mind-care-store'

export default function ResultsPage() {
  const [records, setRecords] = useState<MindAssessment[]>([])
  const [rating, setRating] = useState(0)
  const [feedbackSent, setFeedbackSent] = useState(false)

  useEffect(() => {
    fetch('/api/assessments')
      .then(async (response) => response.ok ? response.json() : Promise.reject())
      .then((items: MindAssessment[]) => setRecords(items))
      .catch(() => setRecords(getAssessments()))
  }, [])
  const latest = records[0]
  const average = useMemo(() => records.length ? Math.round(records.reduce((sum, item) => sum + item.total, 0) / records.length) : 0, [records])

  async function exportPdf() {
    const { default: jsPDF } = await import('jspdf')
    const pdf = new jsPDF()
    pdf.setFontSize(18)
    pdf.text('MIND CARE - BAO CAO DANH GIA TAM LY', 18, 22)
    pdf.setFontSize(11)
    const lines = latest
      ? [`Ma phieu: ${latest.id}`, `Ngay danh gia: ${latest.date}`, `Diem DASS-21: ${latest.total}`, `Tram cam: ${latest.depression} | Lo au: ${latest.anxiety} | Stress: ${latest.stress}`, `Muc do: ${latest.level}`, 'Bao cao nay chi co gia tri sang loc, khong thay the chan doan chuyen mon.']
      : ['Chua co ket qua danh gia. Hay hoan thanh DASS-21 de tao bao cao.']
    pdf.text(lines, 18, 40)
    pdf.save('bao-cao-mind-care.pdf')
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5fbf7]">
      <SiteHeader active="results" />
      <main className="flex-1 pb-24">
        <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
          <section className="rounded-[28px] bg-gradient-to-br from-emerald-700 to-teal-700 p-5 text-white shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-emerald-100">Hồ sơ Mind Care</p>
                <h1 className="mt-1 font-heading text-2xl font-extrabold">Kết quả & tiến trình</h1>
                <p className="mt-2 max-w-lg text-sm text-emerald-50">Theo dõi kết quả sàng lọc, lộ trình tham vấn và tiến bộ cảm xúc của bạn.</p>
              </div>
              <button onClick={exportPdf} className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-extrabold text-emerald-800"><Download className="h-4 w-4" /> PDF</button>
            </div>
          </section>

          <section className="grid grid-cols-3 gap-3">
            <Metric label="Bài đánh giá" value={String(records.length)} icon={FileText} />
            <Metric label="Điểm gần nhất" value={latest ? String(latest.total) : '—'} icon={BarChart3} />
            <Metric label="Điểm trung bình" value={records.length ? String(average) : '—'} icon={TrendingUp} />
          </section>

          {latest ? (
            <section className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div><p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Kết quả mới nhất</p><h2 className="mt-1 text-lg font-extrabold text-slate-900">DASS-21 · {latest.level}</h2><p className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-500"><Calendar className="h-3.5 w-3.5" /> {latest.date}</p></div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{latest.id}</span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
                <Score label="Trầm cảm" score={latest.depression} />
                <Score label="Lo âu" score={latest.anxiety} />
                <Score label="Stress" score={latest.stress} />
              </div>
              <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs leading-relaxed text-emerald-950">
                <strong>Nguồn kết quả:</strong> bài sàng lọc {latest.surveyId || 'DASS-21'} phiên bản {latest.surveyVersion || '1.0'}, hoàn thành ngày {latest.date}. Kết quả được tính trực tiếp từ câu trả lời của bạn.
              </div>
              <p className="mt-4 rounded-2xl bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-950">Kết quả là thông tin sàng lọc ban đầu. Bạn có thể đặt lịch để được chuyên gia trao đổi riêng tư và xây dựng kế hoạch hỗ trợ phù hợp.</p>
            </section>
          ) : (
            <section className="rounded-[28px] border border-dashed border-emerald-200 bg-white p-8 text-center"><ShieldCheck className="mx-auto h-10 w-10 text-emerald-600" /><h2 className="mt-3 font-heading text-lg font-extrabold text-slate-900">Chưa có kết quả sàng lọc</h2><p className="mt-1 text-sm text-slate-500">Hoàn thành DASS-21 để tạo hồ sơ theo dõi đầu tiên.</p><Link href="/assessment" className="mt-4 inline-flex rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white">Làm bài đánh giá</Link></section>
          )}

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-heading text-base font-extrabold text-slate-900">Đánh giá buổi tham vấn</h2>
            <p className="mt-1 text-xs text-slate-500">Phản hồi giúp Mind Care đề xuất chuyên gia phù hợp hơn.</p>
            <div className="mt-3 flex gap-2">{[1,2,3,4,5].map((item) => <button key={item} onClick={() => { setRating(item); setFeedbackSent(false) }} className="rounded-xl p-2"><Star className={`h-7 w-7 ${item <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} /></button>)}</div>
            <button disabled={!rating} onClick={() => setFeedbackSent(true)} className="mt-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-40">{feedbackSent ? 'Đã gửi đánh giá' : 'Gửi đánh giá'}</button>
          </section>
        </div>
      </main>
      <SiteFooter /><BachMaiNav />
    </div>
  )
}

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof FileText }) { return <div className="rounded-2xl border border-emerald-100 bg-white p-3 text-center shadow-sm"><Icon className="mx-auto h-4 w-4 text-emerald-600" /><strong className="mt-1 block text-lg text-slate-900">{value}</strong><span className="text-[10px] font-semibold text-slate-500">{label}</span></div> }
function Score({ label, score }: { label: string; score: number }) { return <div className="rounded-2xl bg-slate-50 p-3"><strong className="block text-lg text-emerald-700">{score}</strong><span className="text-[11px] font-semibold text-slate-500">{label}</span></div> }
