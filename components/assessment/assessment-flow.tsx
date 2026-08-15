'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  RotateCcw,
  CheckCircle2,
  Lightbulb,
  UserCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { SosButton } from '@/components/sos-button'
import { MoodCheckIn } from '@/components/assessment/mood-check-in'
import {
  ASSESSMENT_OPTIONS,
  ASSESSMENT_QUESTIONS,
  RISK_META,
  classifyDass,
} from '@/lib/mind-care'
import { saveAssessment } from '@/lib/mind-care-store'

type Step = 'quiz' | 'result'

export function AssessmentFlow() {
  const [step, setStep] = useState<Step>('quiz')
  const [name, setName] = useState('')
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    const cookies = Object.fromEntries(
      document.cookie.split('; ').map((c) => {
        const [k, v] = c.split('=')
        return [k, decodeURIComponent(v || '')]
      })
    )
    if (cookies.user_name) setName(cookies.user_name)
  }, [])

  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === ASSESSMENT_QUESTIONS.length
  const result = useMemo(() => classifyDass(answers), [answers])

  function reset() {
    setStep('quiz')
    setAnswers({})
    setSaveError('')
  }

  async function showResult() {
    setSaving(true)
    setSaveError('')
    const scored = classifyDass(answers)
    const response = await fetch('/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    }).catch(() => null)
    setSaving(false)
    if (!response?.ok) {
      const payload = response ? await response.json().catch(() => ({})) : {}
      setSaveError(payload.message || 'Không thể lưu kết quả. Vui lòng thử lại.')
      return
    }
    const persisted = await response.json()
    saveAssessment({
      id: persisted.id,
      surveyId: 'DASS-21',
      surveyVersion: '1.0',
      source: 'survey',
      completedAt: new Date().toISOString(),
      name: name.trim() || 'Tài khoản',
      date: new Date().toLocaleDateString('vi-VN'),
      total: scored.total,
      depression: scored.depression,
      anxiety: scored.anxiety,
      stress: scored.stress,
      level: RISK_META[scored.risk].label,
    })
    setStep('result')
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <StepIndicator step={step} />

      {step === 'quiz' && (
        <div className="mt-6 flex flex-col gap-5">
          {/* Logged in User Greeting Banner */}
          <div className="flex items-center justify-between rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <UserCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold text-slate-500">Tài khoản khảo sát</p>
                <h3 className="font-heading text-sm font-extrabold text-teal-950">
                  {name || 'Người dùng đã đăng nhập'}
                </h3>
              </div>
            </div>
            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
              DASS-21
            </Badge>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl bg-white p-4 border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-teal-900 font-bold">
                Đã trả lời {answeredCount}/{ASSESSMENT_QUESTIONS.length} câu
              </span>
              <span className="text-slate-500">
                Hãy chọn mức độ phù hợp với bạn trong 2 tuần qua
              </span>
            </div>
            <Progress value={(answeredCount / ASSESSMENT_QUESTIONS.length) * 100} className="h-2" />
          </div>

          {ASSESSMENT_QUESTIONS.map((q) => (
            <Card key={q.id} className="border-border/70">
              <CardContent className="flex flex-col gap-3 py-5">
                <p className="font-medium text-foreground">
                  <span className="mr-2 text-primary font-extrabold">{q.id}.</span>
                  {q.text}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {ASSESSMENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt.value }))}
                      className={cn(
                        'rounded-lg border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer',
                        answers[q.id] === opt.value
                          ? 'border-teal-600 bg-teal-600 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50/50',
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="shrink-0">
              <Button variant="outline" className="h-11">
                <ArrowLeft className="size-4" /> Trang chủ
              </Button>
            </Link>
            <Button
              className="h-11 flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold"
              disabled={!allAnswered || saving}
              onClick={showResult}
            >
              {saving ? 'Đang lưu kết quả...' : allAnswered ? 'Xem kết quả' : `Còn ${ASSESSMENT_QUESTIONS.length - answeredCount} câu chưa trả lời`}
              <ArrowRight className="size-4" />
            </Button>
          </div>
          {saveError && <p role="alert" className="rounded-xl border border-danger/30 bg-danger/5 p-3 text-sm font-medium text-danger">{saveError}</p>}
        </div>
      )}

      {step === 'result' && (
        <div className="mt-6 flex flex-col gap-5">
          <Card className="overflow-hidden">
            <div
              className={cn(
                'flex flex-col items-center gap-3 border-b border-border px-6 py-8 text-center',
                result.risk === 'NORMAL' && 'bg-emerald-50',
                result.risk === 'NEED_HELP' && 'bg-amber-50',
                result.risk === 'SEVERE' && 'bg-rose-50',
              )}
            >
              <span
                className={cn(
                  'flex size-14 items-center justify-center rounded-full',
                  result.risk === 'NORMAL' && 'bg-emerald-100 text-emerald-700',
                  result.risk === 'NEED_HELP' && 'bg-amber-100 text-amber-800',
                  result.risk === 'SEVERE' && 'bg-rose-100 text-rose-700',
                )}
              >
                <CheckCircle2 className="size-8" />
              </span>
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-slate-600 font-medium">
                  Cảm ơn <strong className="text-slate-900">{name || 'bạn'}</strong> đã hoàn thành bài trắc nghiệm
                </p>
                <Badge variant="outline" className={cn('h-7 px-3 text-sm font-bold', RISK_META[result.risk].badge)}>
                  {RISK_META[result.risk].label}
                </Badge>
                <p className="font-heading text-3xl font-extrabold text-slate-900">
                  {result.total}
                  <span className="text-lg font-medium text-slate-500"> điểm DASS-21</span>
                </p>
              </div>
            </div>
            <CardContent className="flex flex-col gap-4 py-6">
              <div className="flex gap-3 rounded-xl bg-teal-50/80 p-4 border border-teal-100">
                <Lightbulb className="mt-0.5 size-5 shrink-0 text-teal-600" />
                <div className="space-y-1 text-sm text-slate-800 leading-relaxed">
                  <p>{result.advice}</p>
                  <p className="text-xs text-teal-900 font-semibold pt-1 border-t border-teal-200/60">
                    💡 <strong>Lưu ý:</strong> Điểm trắc nghiệm này là thông tin sàng lọc ban đầu. Hồ sơ chẩn đoán chính thức & đơn thuốc/bài tập trị liệu sẽ do Bác sĩ/Chuyên gia trực tiếp trả về cho bạn trong phần <Link href="/results" className="underline font-bold text-teal-700 hover:text-teal-900 font-extrabold">"Kết quả & Hồ sơ"</Link> sau buổi khám.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100"><strong className="block text-base text-teal-900">{result.depression}</strong>Trầm cảm</div>
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100"><strong className="block text-base text-teal-900">{result.anxiety}</strong>Lo âu</div>
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100"><strong className="block text-base text-teal-900">{result.stress}</strong>Căng thẳng</div>
              </div>

              {result.route === 2 && (
                <Link href="/booking" className="block"><Button className="w-full bg-teal-600 hover:bg-teal-700">Đặt lịch tham vấn với chuyên gia</Button></Link>
              )}

              {result.route === 3 && (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-center">
                  <p className="text-sm font-bold text-rose-900">
                    Bạn xứng đáng được hỗ trợ ngay bây giờ.
                  </p>
                  <SosButton variant="compact" />
                </div>
              )}
            </CardContent>
          </Card>

          <MoodCheckIn />

          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-11 flex-1" onClick={reset}>
              <RotateCcw className="size-4" /> Làm lại bài đánh giá
            </Button>
            <Link href="/" className="flex-1">
              <Button className="h-11 w-full bg-teal-600 hover:bg-teal-700">Về trang chủ</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function StepIndicator({ step }: { step: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: 'quiz', label: 'Trả lời câu hỏi' },
    { key: 'result', label: 'Kết quả đánh giá' },
  ]
  const activeIndex = steps.findIndex((s) => s.key === step)
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <span
            className={cn(
              'flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-extrabold transition-colors',
              i <= activeIndex
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-500',
            )}
          >
            <span
              className={cn(
                'flex size-5 items-center justify-center rounded-full text-[11px]',
                i <= activeIndex ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600',
              )}
            >
              {i + 1}
            </span>
            <span>{s.label}</span>
          </span>
          {i < steps.length - 1 && (
            <span className={cn('h-px w-6', i < activeIndex ? 'bg-teal-600' : 'bg-slate-200')} />
          )}
        </div>
      ))}
    </div>
  )
}
