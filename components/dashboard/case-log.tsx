'use client'

import { useState } from 'react'
import { Lock, AlertTriangle, Send, NotebookPen, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { CaseHistory } from '@/lib/mind-care'

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function CaseLog({ initial }: { initial: CaseHistory[] }) {
  const [entries, setEntries] = useState<CaseHistory[]>(initial)
  const [note, setNote] = useState('')
  const [closed, setClosed] = useState(false)

  function addNote() {
    if (!note.trim()) return
    const entry: CaseHistory = {
      id: `local-${Date.now()}`,
      studentId: initial[0]?.studentId ?? '',
      author: 'CV. Nguyễn Thu Hà',
      notes: note.trim(),
      isUrgent: false,
      createdAt: new Date().toISOString(),
    }
    setEntries((prev) => [entry, ...prev])
    setNote('')
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2"><NotebookPen className="size-5 text-primary" /><CardTitle className="font-heading text-lg">Nhật ký tham vấn</CardTitle></div>
          <Button variant={closed ? 'outline' : 'default'} className="h-8 text-xs" onClick={() => setClosed((value) => !value)}>
            <CheckCircle2 className="size-3.5" /> {closed ? 'Ca đã hoàn thành' : 'Đóng ca'}
          </Button>
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Lock className="size-3.5" /> Riêng tư — chỉ chuyên viên tư vấn xem được.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/40 p-3">
          <Textarea
            placeholder="Ghi lại nội dung buổi tham vấn, quan sát hoặc kế hoạch hỗ trợ..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="bg-card"
          />
          <div className="flex justify-end">
            <Button className="h-9 gap-2" disabled={!note.trim()} onClick={addNote}>
              <Send className="size-4" /> Lưu ghi chú
            </Button>
          </div>
        </div>

        <ol className="flex flex-col gap-4">
          {entries.map((c) => (
            <li key={c.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full',
                    c.isUrgent ? 'bg-danger/15 text-danger' : 'bg-secondary text-primary',
                  )}
                >
                  {c.isUrgent ? <AlertTriangle className="size-4" /> : <NotebookPen className="size-4" />}
                </span>
                <span className="mt-1 w-px flex-1 bg-border" />
              </div>
              <div className="flex flex-1 flex-col gap-1 pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{c.author}</span>
                  {c.isUrgent && (
                    <span className="rounded-full bg-danger/10 px-2 py-0.5 text-xs font-bold text-danger">
                      Kích hoạt SOS
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{c.notes}</p>
              </div>
            </li>
          ))}
          {entries.length === 0 && (
            <p className="text-sm text-muted-foreground">Chưa có ghi chú tham vấn nào.</p>
          )}
        </ol>
      </CardContent>
    </Card>
  )
}
