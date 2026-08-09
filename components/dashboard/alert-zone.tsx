'use client'

import { BellRing, CalendarCheck, CheckCircle2, Clock } from 'lucide-react'

export function AlertZone() {
  const alerts = [
    {
      id: 1,
      icon: CalendarCheck,
      text: 'Có lịch tư vấn tâm lý trực tuyến vào ngày mai (09:00, 27/06)',
      color: 'text-amber-800',
    },
    {
      id: 2,
      icon: CheckCircle2,
      text: 'Kết quả trắc nghiệm PHQ-9 & GAD-7 đã có báo cáo chi tiết',
      color: 'text-amber-800',
    },
    {
      id: 3,
      icon: Clock,
      text: 'Nhắc nhở bài tập thiền định & thư giãn cơ lúc 20:00 tối nay',
      color: 'text-amber-800',
    },
  ]

  return (
    <div className="rounded-2xl bg-amber-50/90 p-4 border border-amber-200/70 shadow-xs">
      <div className="flex items-center gap-2 mb-2.5">
        <BellRing className="h-5 w-5 text-amber-700 animate-bounce" />
        <h4 className="font-bold text-amber-900 text-sm">Thông báo quan trọng</h4>
      </div>
      <ul className="space-y-2">
        {alerts.map((alert) => {
          const Icon = alert.icon
          return (
            <li key={alert.id} className="flex items-start gap-2.5 text-xs font-semibold text-amber-950">
              <span className="mt-0.5 flex h-2 w-2 shrink-0 rounded-full bg-amber-500" />
              <span>{alert.text}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
