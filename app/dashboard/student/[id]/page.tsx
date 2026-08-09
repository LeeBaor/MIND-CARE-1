import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarClock, TrendingDown, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { DashboardTopbar } from '@/components/dashboard/dashboard-topbar'
import { CaseLog } from '@/components/dashboard/case-log'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  getStudent,
  getAssessments,
  getCaseHistories,
  RISK_META,
} from '@/lib/mind-care'

const ASSESSMENT_STATUS_META: Record<string, string> = {
  NORMAL: 'bg-success/15 text-success border-success/30',
  MILD: 'bg-warning/20 text-warning-foreground border-warning/40',
  SEVERE: 'bg-danger/15 text-danger border-danger/30',
}

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const student = getStudent(id)
  if (!student) notFound()

  const assessments = getAssessments(id).sort((a, b) => b.month - a.month)
  const caseHistories = getCaseHistories(id).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
  const meta = RISK_META[student.status]

  const latest = assessments[0]?.totalScore ?? student.riskScore
  const previous = assessments[1]?.totalScore
  const trend = previous !== undefined ? latest - previous : 0

  return (
    <div className="min-h-screen bg-background">
      <DashboardTopbar
        breadcrumb={[
          { label: 'Bảng điều khiển', href: '/dashboard' },
          { label: student.name },
        ]}
      />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
        <Link
          href="/dashboard"
          className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Quay lại danh sách
        </Link>

        {/* Profile header */}
        <Card>
          <CardContent className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex size-16 items-center justify-center rounded-2xl bg-secondary font-heading text-2xl font-bold text-primary">
                {student.name.split(' ').pop()?.[0]}
              </span>
              <div className="flex flex-col gap-1.5">
                <h1 className="font-heading text-2xl font-bold text-foreground">{student.name}</h1>
                <p className="text-muted-foreground">{student.grade}</p>
                <Badge variant="outline" className={cn('h-6 w-fit', meta.badge)}>
                  <span className={cn('size-1.5 rounded-full', meta.dot)} />
                  {meta.label}
                </Badge>
              </div>
            </div>
            <div className="rounded-xl bg-muted/50 px-5 py-4 text-center">
              <p className="font-heading text-3xl font-bold text-foreground">
                {student.riskScore}
                <span className="text-base font-medium text-muted-foreground">/27</span>
              </p>
              <p className="text-sm text-muted-foreground">Điểm rủi ro hiện tại</p>
            </div>
          </CardContent>
        </Card>

        <p className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          {meta.description}
        </p>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Assessment history */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Lịch sử đánh giá</CardTitle>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  {trend > 0 ? (
                    <>
                      <TrendingUp className="size-4 text-danger" /> Tăng {trend} điểm so với kỳ trước
                    </>
                  ) : trend < 0 ? (
                    <>
                      <TrendingDown className="size-4 text-success" /> Giảm {Math.abs(trend)} điểm so với kỳ trước
                    </>
                  ) : (
                    <>Chưa đủ dữ liệu so sánh</>
                  )}
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {assessments.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarClock className="size-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">Tháng {a.month}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-foreground">{a.totalScore}/27</span>
                      <Badge
                        variant="outline"
                        className={cn('h-6', ASSESSMENT_STATUS_META[a.status])}
                      >
                        {a.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {assessments.length === 0 && (
                  <p className="text-sm text-muted-foreground">Chưa có bài đánh giá nào.</p>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button className="h-11 w-full">Đặt lịch tham vấn</Button>
              <Button variant="outline" className="h-11 w-full">
                Thông báo cho giáo viên chủ nhiệm
              </Button>
            </div>
          </div>

          {/* Case log */}
          <div className="lg:col-span-3">
            <CaseLog initial={caseHistories} />
          </div>
        </div>
      </main>
    </div>
  )
}
