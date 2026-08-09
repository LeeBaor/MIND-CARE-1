'use client'

import { Smile, Moon, Zap, Activity, Heart, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export function StatCards() {
  const metrics = [
    {
      title: 'Tâm trạng',
      value: 'Tích cực',
      subtext: '4 / 5 điểm',
      icon: Smile,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
    },
    {
      title: 'Đánh giá lo âu',
      value: '4 / 21',
      subtext: 'Mức độ nhẹ (GAD-7)',
      icon: Activity,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-100',
    },
    {
      title: 'Giấc ngủ đêm qua',
      value: '7.5 giờ',
      subtext: 'Chất lượng tốt',
      icon: Moon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
    },
    {
      title: 'Mức độ Stress',
      value: '15 %',
      subtext: 'Trạng thái ổn định',
      icon: Zap,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
    },
  ]

  return (
    <div className="rounded-2xl bg-white p-5 border border-emerald-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Heart className="h-4 w-4 fill-emerald-600" />
          </span>
          <h3 className="text-base font-bold text-slate-800">Chỉ số sức khỏe tinh thần hôm nay</h3>
        </div>
        <Link 
          href="/results" 
          className="flex items-center text-xs font-semibold text-teal-600 hover:text-teal-700 gap-0.5"
        >
          Chi tiết <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((item, i) => {
          const Icon = item.icon
          return (
            <div
              key={i}
              className={`flex flex-col items-center justify-center rounded-xl p-3 text-center border ${item.bgColor} ${item.borderColor} transition-all hover:scale-[1.02]`}
            >
              <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-xs ${item.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-slate-500">{item.title}</span>
              <span className="mt-0.5 text-base font-extrabold text-slate-800">{item.value}</span>
              <span className="text-[11px] font-medium text-slate-500">{item.subtext}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
