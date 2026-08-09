import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { COVERAGE_BY_GRADE, MONTHLY_TREND } from '@/lib/mind-care'

export function Analytics() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Tỷ lệ bao phủ tham vấn</CardTitle>
          <p className="text-sm text-muted-foreground">Số học sinh đã khảo sát theo từng khối</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {COVERAGE_BY_GRADE.map((g) => {
            const pct = Math.round((g.surveyed / g.total) * 100)
            return (
              <div key={g.grade} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{g.grade}</span>
                  <span className="text-muted-foreground">
                    {g.surveyed}/{g.total}{' '}
                    <span className="font-semibold text-primary">({pct}%)</span>
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Xu hướng sức khỏe tinh thần</CardTitle>
          <p className="text-sm text-muted-foreground">Phân bố mức độ theo tháng (%)</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-2">
            {MONTHLY_TREND.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-40 w-full max-w-10 flex-col justify-end overflow-hidden rounded-md">
                  <div className="bg-danger" style={{ height: `${m.severe}%` }} />
                  <div className="bg-warning" style={{ height: `${m.needHelp}%` }} />
                  <div className="bg-success" style={{ height: `${m.normal}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 border-t border-border pt-3 text-xs">
            <Legend color="bg-success" label="Bình thường" />
            <Legend color="bg-warning" label="Cần tham vấn" />
            <Legend color="bg-danger" label="Báo động đỏ" />
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      <span className={`size-2.5 rounded-sm ${color}`} />
      {label}
    </span>
  )
}
