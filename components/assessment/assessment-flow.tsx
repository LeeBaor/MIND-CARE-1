'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  RotateCcw,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

type Step = 'info' | 'quiz' | 'result'

const GRADES = [
  'Lớp 10A1', 'Lớp 10A2', 'Lớp 11B1', 'Lớp 11B2', 'Lớp 12A1', 'Lớp 12A3',
]

export function AssessmentFlow() {
  const [step, setStep] = useState<Step>('info')
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')
  const [answers, setAnswers] = useState<Record<number, number>>({})

  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === ASSESSMENT_QUESTIONS.length
  const result = useMemo(() => classifyDass(answers), [answers])

  function reset() {
    setStep('info')
    setAnswers({})
  }

  function showResult() {
    const scored = classifyDass(answers)
    saveAssessment({
      id: `MC-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
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
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <StepIndicator step={step} />

      {step === 'info' && (
        <Card className="mt-6">
          <CardHeader>
            <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
              <ClipboardCheck className="size-5" />
            </span>
            <CardTitle className="mt-3 font-heading text-2xl">Bắt đầu khảo sát</CardTitle>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Hãy cho chúng tôi biết một chút về em. Mọi câu trả lời đều được giữ bí mật.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                placeholder="Ví dụ: Nguyễn Minh An"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="grade">Lớp</Label>
              <div className="flex flex-wrap gap-2" id="grade">
                {GRADES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={cn(
                      'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                      grade === g
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-muted-foreground hover:border-primary/50',
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <Button
              className="mt-2 h-11"
              disabled={!name.trim() || !grade}
              onClick={() => setStep('quiz')}
            >
              Tiếp tục <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'quiz' && (
        <div className="mt-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">
                Đã trả lời {answeredCount}/{ASSESSMENT_QUESTIONS.length}
              </span>
              <span className="text-muted-foreground">
                Trong 2 tuần qua, em có thường xuyên...
              </span>
            </div>
            <Progress value={(answeredCount / ASSESSMENT_QUESTIONS.length) * 100} />
          </div>

          {ASSESSMENT_QUESTIONS.map((q) => (
            <Card key={q.id} className="border-border/70">
              <CardContent className="flex flex-col gap-3 py-5">
                <p className="font-medium text-foreground">
                  <span className="mr-2 text-primary">{q.id}.</span>
                  {q.text}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {ASSESSMENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt.value }))}
                      className={cn(
                        'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                        answers[q.id] === opt.value
                          ? 'border-primary bg-secondary text-secondary-foreground'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/50',
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
            <Button variant="outline" className="h-11" onClick={() => setStep('info')}>
              <ArrowLeft className="size-4" /> Quay lại
            </Button>
            <Button
              className="h-11 flex-1"
              disabled={!allAnswered}
              onClick={showResult}
            >
              {allAnswered ? 'Xem kết quả' : `Còn ${ASSESSMENT_QUESTIONS.length - answeredCount} câu`}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 'result' && (
        <div className="mt-6 flex flex-col gap-5">
          <Card className="overflow-hidden">
            <div
              className={cn(
                'flex flex-col items-center gap-3 border-b border-border px-6 py-8 text-center',
                result.risk === 'NORMAL' && 'bg-success/10',
                result.risk === 'NEED_HELP' && 'bg-warning/15',
                result.risk === 'SEVERE' && 'bg-danger/10',
              )}
            >
              <span
                className={cn(
                  'flex size-14 items-center justify-center rounded-full',
                  result.risk === 'NORMAL' && 'bg-success/20 text-success',
                  result.risk === 'NEED_HELP' && 'bg-warning/25 text-warning-foreground',
                  result.risk === 'SEVERE' && 'bg-danger/20 text-danger',
                )}
              >
                <CheckCircle2 className="size-8" />
              </span>
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Cảm ơn {name || 'em'} đã hoàn thành khảo sát
                </p>
                <Badge variant="outline" className={cn('h-7 px-3 text-sm', RISK_META[result.risk].badge)}>
                  {RISK_META[result.risk].label}
                </Badge>
                <p className="font-heading text-3xl font-bold text-foreground">
                  {result.total}
                  <span className="text-lg font-medium text-muted-foreground"> điểm DASS-21</span>
                </p>
              </div>
            </div>
            <CardContent className="flex flex-col gap-4 py-6">
              <div className="flex gap-3 rounded-xl bg-secondary/60 p-4">
                <Lightbulb className="mt-0.5 size-5 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-foreground">{result.advice}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-muted p-2"><strong className="block text-base">{result.depression}</strong>Trầm cảm</div>
                <div className="rounded-lg bg-muted p-2"><strong className="block text-base">{result.anxiety}</strong>Lo âu</div>
                <div className="rounded-lg bg-muted p-2"><strong className="block text-base">{result.stress}</strong>Căng thẳng</div>
              </div>

              {result.route === 2 && (
                <Link href="/booking" className="block"><Button className="w-full">Đặt lịch tham vấn với chuyên gia</Button></Link>
              )}

              {result.route === 3 && (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4 text-center">
                  <p className="text-sm font-medium text-foreground">
                    Em xứng đáng được hỗ trợ ngay bây giờ.
                  </p>
                  <SosButton variant="compact" />
                </div>
              )}
            </CardContent>
          </Card>

          <MoodCheckIn />

          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-11 flex-1" onClick={reset}>
              <RotateCcw className="size-4" /> Làm lại
            </Button>
            <Link href="/" className="flex-1">
              <Button className="h-11 w-full">Về trang chủ</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function StepIndicator({ step }: { step: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: 'info', label: 'Thông tin' },
    { key: 'quiz', label: 'Câu hỏi' },
    { key: 'result', label: 'Kết quả' },
  ]
  const activeIndex = steps.findIndex((s) => s.key === step)
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <span
            className={cn(
              'flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold transition-colors',
              i <= activeIndex
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground',
            )}
          >
            <span
              className={cn(
                'flex size-5 items-center justify-center rounded-full text-xs',
                i <= activeIndex ? 'bg-primary-foreground/25' : 'bg-background',
              )}
            >
              {i + 1}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </span>
          {i < steps.length - 1 && (
            <span className={cn('h-px w-5', i < activeIndex ? 'bg-primary' : 'bg-border')} />
          )}
        </div>
      ))}
    </div>
  )
}
