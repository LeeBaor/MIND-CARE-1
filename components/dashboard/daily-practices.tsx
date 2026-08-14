'use client'

import { useEffect, useMemo, useState } from 'react'
import { BedDouble, BookOpenText, Check, Play, Save, Wind } from 'lucide-react'

type PracticeState = {
  breatheStartedAt?: string
  breatheCompletedAt?: string
  breatheSeconds?: number
  journal?: string
  journalCompleted?: boolean
  sleepStartedAt?: string
  sleepCompletedAt?: string
  sleepMinutes?: number
}

const dayKey = () => {
  const now = new Date()
  const boundary = new Date(now)
  boundary.setHours(8, 0, 0, 0)
  if (now < boundary) boundary.setDate(boundary.getDate() - 1)
  return boundary.toLocaleDateString('en-CA')
}

const storageKey = () => `mind-care-daily-practices:${dayKey()}`
const elapsedSeconds = (startedAt?: string) => startedAt ? Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000) : 0

export function DailyPractices() {
  const [data, setData] = useState<PracticeState>({})
  const [now, setNow] = useState(Date.now())
  const [message, setMessage] = useState('')
  const breatheElapsed = useMemo(() => data.breatheStartedAt && !data.breatheCompletedAt ? Math.floor((now - new Date(data.breatheStartedAt).getTime()) / 1000) : data.breatheSeconds || 0, [data, now])

  useEffect(() => {
    let fallback: PracticeState = {}
    try { fallback = JSON.parse(localStorage.getItem(storageKey()) || '{}'); setData(fallback) } catch { setData({}) }
    fetch(`/api/daily-practices?date=${dayKey()}`).then(response => response.ok ? response.json() : Promise.reject()).then(remote => { if (Object.keys(remote).length) { setData(remote); localStorage.setItem(storageKey(), JSON.stringify(remote)) } }).catch(() => undefined)
  }, [])
  useEffect(() => {
    if (!data.breatheStartedAt || data.breatheCompletedAt) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [data.breatheStartedAt, data.breatheCompletedAt])

  useEffect(() => {
    if (!data.breatheStartedAt || data.breatheCompletedAt || breatheElapsed < 180) return
    const next = { ...data, breatheCompletedAt: new Date().toISOString(), breatheSeconds: 180 }
    setData(next); localStorage.setItem(storageKey(), JSON.stringify(next)); void persist(next); setMessage('Đã đủ 3 phút. Bài tập hít thở được hoàn thành và lưu tự động.')
  }, [breatheElapsed, data])

  const save = (next: PracticeState, notice: string) => {
    setData(next)
    localStorage.setItem(storageKey(), JSON.stringify(next))
    void persist(next)
    setMessage(notice)
  }
  const completed = [Boolean(data.breatheCompletedAt), Boolean(data.journalCompleted), Boolean(data.sleepCompletedAt)].filter(Boolean).length

  const startBreathe = () => save({ ...data, breatheStartedAt: new Date().toISOString(), breatheCompletedAt: undefined, breatheSeconds: undefined }, 'Đã bắt đầu bài tập hít thở.')
  const finishBreathe = () => {
    const seconds = elapsedSeconds(data.breatheStartedAt)
    if (seconds < 60) { setMessage(`Hãy tiếp tục thêm ${60 - seconds} giây để đủ thời gian tối thiểu.`); return }
    save({ ...data, breatheCompletedAt: new Date().toISOString(), breatheSeconds: Math.min(seconds, 180) }, 'Đã hoàn thành và lưu bài tập hít thở.')
  }
  const startSleep = () => save({ ...data, sleepStartedAt: new Date().toISOString(), sleepCompletedAt: undefined, sleepMinutes: undefined }, 'Đã ghi nhận thời gian bắt đầu giấc ngủ.')
  const finishSleep = () => {
    if (!data.sleepStartedAt) return
    const minutes = Math.max(1, Math.round((Date.now() - new Date(data.sleepStartedAt).getTime()) / 60000))
    save({ ...data, sleepCompletedAt: new Date().toISOString(), sleepMinutes: minutes }, 'Đã hoàn thành và lưu thời lượng giấc ngủ.')
  }

  return <section className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between"><div className="flex items-center gap-2"><BookOpenText className="h-5 w-5 text-emerald-600" /><h2 className="font-heading font-extrabold text-slate-900">Bài tập trị liệu hằng ngày</h2></div><span className="text-xs font-bold text-emerald-700">{completed}/3 hoàn thành</span></div>
    <p className="mt-1 text-xs text-slate-500">Trạng thái được làm mới mỗi ngày lúc 08:00.</p>
    {message && <p role="status" className="mt-3 rounded-xl bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800">{message}</p>}
    <div className="mt-4 space-y-3">
      <PracticeCard icon={Wind} title="Hít thở 4–7–8" done={Boolean(data.breatheCompletedAt)} note={data.breatheCompletedAt ? `Đã lưu · ${Math.ceil((data.breatheSeconds || 60) / 60)} phút` : data.breatheStartedAt ? `Đang thực hiện · ${Math.min(breatheElapsed, 180)} giây / 180 giây` : 'Tối thiểu 1 phút, tối đa 3 phút'}>
        {!data.breatheStartedAt || data.breatheCompletedAt ? <Action onClick={startBreathe} icon={Play} text={data.breatheCompletedAt ? 'Thực hiện lại' : 'Bắt đầu'} /> : <Action onClick={finishBreathe} disabled={breatheElapsed < 60} icon={Check} text="Hoàn thành và lưu" />}
      </PracticeCard>
      <PracticeCard icon={BookOpenText} title="Nhật ký hôm nay" done={Boolean(data.journalCompleted)} note="Có thể nhập tại đây hoặc đánh dấu nếu đã viết bằng giấy bút.">
        <textarea value={data.journal || ''} onChange={event => setData({ ...data, journal: event.target.value })} rows={3} placeholder="Hôm nay bạn cảm thấy thế nào?" className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500" />
        <Action onClick={() => save({ ...data, journalCompleted: true }, 'Đã hoàn thành và lưu nhật ký hôm nay.')} icon={Save} text={data.journal?.trim() ? 'Lưu nhật ký' : 'Đã viết bằng giấy · Hoàn thành'} />
      </PracticeCard>
      <PracticeCard icon={BedDouble} title="Theo dõi giấc ngủ" done={Boolean(data.sleepCompletedAt)} note={data.sleepCompletedAt ? `Đã ngủ ${Math.floor((data.sleepMinutes || 0) / 60)} giờ ${Number(data.sleepMinutes || 0) % 60} phút` : data.sleepStartedAt ? `Bắt đầu lúc ${new Date(data.sleepStartedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : 'Một ngày được tính từ 08:00 hôm trước đến 08:00 hôm sau.'}>
        {!data.sleepStartedAt || data.sleepCompletedAt ? <Action onClick={startSleep} icon={Play} text={data.sleepCompletedAt ? 'Ghi giấc ngủ mới' : 'Bắt đầu giấc ngủ'} /> : <Action onClick={finishSleep} icon={Check} text="Thức dậy · Hoàn thành" />}
      </PracticeCard>
    </div>
  </section>
}

async function persist(data: PracticeState) {
  await fetch('/api/daily-practices', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ practiceDate: dayKey(), ...data }) }).catch(() => undefined)
}

function PracticeCard({ icon: Icon, title, note, done, children }: { icon: typeof Wind; title: string; note: string; done: boolean; children: React.ReactNode }) {
  return <div className={`rounded-2xl border p-4 ${done ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200'}`}><div className="flex items-start gap-3"><span className={`rounded-xl p-2 ${done ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}><Icon className="h-5 w-5" /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><strong className="text-sm text-slate-900">{title}</strong>{done && <span className="text-[11px] font-bold text-emerald-700">Đã hoàn thành</span>}</div><p className="mt-1 text-xs text-slate-500">{note}</p>{children}</div></div></div>
}

function Action({ onClick, icon: Icon, text, disabled = false }: { onClick: () => void; icon: typeof Play; text: string; disabled?: boolean }) {
  return <button type="button" onClick={onClick} disabled={disabled} className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"><Icon className="h-3.5 w-3.5" />{text}</button>
}
