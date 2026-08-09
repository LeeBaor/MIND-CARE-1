'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { STUDENTS, RISK_META, type RiskStatus } from '@/lib/mind-care'

type Filter = 'ALL' | RiskStatus

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'SEVERE', label: 'Báo động đỏ' },
  { key: 'NEED_HELP', label: 'Cần tham vấn' },
  { key: 'NORMAL', label: 'Bình thường' },
]

export function StudentTable() {
  const [filter, setFilter] = useState<Filter>('ALL')
  const [query, setQuery] = useState('')

  const rows = useMemo(() => {
    return STUDENTS.filter((s) => {
      const matchFilter = filter === 'ALL' || s.status === filter
      const matchQuery =
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.grade.toLowerCase().includes(query.toLowerCase())
      return matchFilter && matchQuery
    }).sort((a, b) => b.riskScore - a.riskScore)
  }, [filter, query])

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-heading text-lg font-bold text-foreground">Danh sách học sinh</h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                filter === f.key
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/50',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên hoặc lớp..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="divide-y divide-border">
          <div className="hidden grid-cols-12 gap-4 bg-muted/50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
            <span className="col-span-4">Học sinh</span>
            <span className="col-span-2">Lớp</span>
            <span className="col-span-2">Điểm rủi ro</span>
            <span className="col-span-3">Trạng thái</span>
            <span className="col-span-1 text-right">Chi tiết</span>
          </div>

          {rows.map((s) => (
            <Link
              key={s.id}
              href={`/dashboard/student/${s.id}`}
              className="grid grid-cols-1 gap-3 px-4 py-3 transition-colors hover:bg-muted/40 md:grid-cols-12 md:items-center md:gap-4"
            >
              <div className="col-span-4 flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-secondary font-heading text-sm font-bold text-primary">
                  {s.name.split(' ').pop()?.[0]}
                </span>
                <span className="font-medium text-foreground">{s.name}</span>
              </div>
              <span className="col-span-2 text-sm text-muted-foreground">{s.grade}</span>
              <div className="col-span-2 flex items-center gap-2">
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      s.status === 'SEVERE' && 'bg-danger',
                      s.status === 'NEED_HELP' && 'bg-warning',
                      s.status === 'NORMAL' && 'bg-success',
                    )}
                    style={{ width: `${(s.riskScore / 27) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground">{s.riskScore}</span>
              </div>
              <div className="col-span-3">
                <Badge variant="outline" className={cn('h-6', RISK_META[s.status].badge)}>
                  <span className={cn('size-1.5 rounded-full', RISK_META[s.status].dot)} />
                  {RISK_META[s.status].label}
                </Badge>
              </div>
              <div className="col-span-1 flex md:justify-end">
                <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </Link>
          ))}

          {rows.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              Không tìm thấy học sinh phù hợp.
            </p>
          )}
        </div>
      </Card>
    </section>
  )
}
