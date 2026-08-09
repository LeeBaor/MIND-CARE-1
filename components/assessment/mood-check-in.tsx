'use client'

import { useState } from 'react'
import { Smile, Meh, Frown, Laugh, Angry, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MOOD_HISTORY } from '@/lib/mind-care'

const MOOD_OPTIONS = [
  { value: 5, label: 'Rất vui', icon: Laugh, color: 'text-success' },
  { value: 4, label: 'Vui', icon: Smile, color: 'text-success' },
  { value: 3, label: 'Bình thường', icon: Meh, color: 'text-warning-foreground' },
  { value: 2, label: 'Buồn', icon: Frown, color: 'text-warning-foreground' },
  { value: 1, label: 'Rất tệ', icon: Angry, color: 'text-danger' },
]

export function MoodCheckIn() {
  const [mood, setMood] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg">Nhật ký cảm xúc hôm nay</CardTitle>
        <p className="text-sm text-muted-foreground">
          Hôm nay em cảm thấy thế nào? Ghi lại để theo dõi tâm trạng của mình.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between gap-2">
          {MOOD_OPTIONS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(m.value)}
              className={cn(
                'flex flex-1 flex-col items-center gap-1.5 rounded-xl border px-1 py-3 transition-colors',
                mood === m.value
                  ? 'border-primary bg-secondary'
                  : 'border-border hover:border-primary/50',
              )}
            >
              <m.icon className={cn('size-7', m.color)} />
              <span className="text-xs font-medium text-muted-foreground">{m.label}</span>
            </button>
          ))}
        </div>

        <Textarea
          placeholder="Ghi chú ngắn (không bắt buộc)..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
        />

        <Button className="h-10" disabled={mood === null} onClick={save}>
          {saved ? (
            <>
              <Check className="size-4" /> Đã lưu cảm xúc
            </>
          ) : (
            'Lưu nhật ký'
          )}
        </Button>

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <p className="text-sm font-semibold text-foreground">7 ngày gần đây</p>
          <div className="flex items-end justify-between gap-1.5">
            {MOOD_HISTORY.map((entry) => (
              <div key={entry.date} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-24 w-full items-end">
                  <div
                    className="w-full rounded-t-md bg-primary/70"
                    style={{ height: `${(entry.mood / 5) * 100}%` }}
                    title={`${entry.date}: ${entry.mood}/5`}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{entry.date}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
