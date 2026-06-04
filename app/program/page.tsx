'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { getPerformancesByDay, type Performance } from '@/lib/data'
import { useLang } from '@/components/language-provider'

function PerformanceCard({ p }: { p: Performance }) {
  return (
    <div className="flex gap-3 py-4">
      <div className="flex w-16 shrink-0 flex-col items-end pt-0.5">
        <span className="text-sm font-semibold tabular-nums">{p.startTime}</span>
        <span className="text-xs text-muted-foreground">{p.endTime}</span>
      </div>
      <div className="w-px bg-border" />
      <div className="flex-1 space-y-1">
        <p className="font-semibold leading-tight">{p.artist}</p>
        <Badge variant="secondary" className="text-xs">{p.genre}</Badge>
        {p.description && (
          <p className="text-sm text-muted-foreground">{p.description}</p>
        )}
      </div>
    </div>
  )
}

export default function ProgramPage() {
  const { t } = useLang()
  const [activeDay, setActiveDay] = useState<'1' | '2' | '3'>('1')

  return (
    <div className="mx-auto max-w-md px-4 pt-4">
      <Tabs value={activeDay} onValueChange={(v) => setActiveDay(v as '1' | '2' | '3')}>
        <TabsList className="grid w-full grid-cols-3">
          {([1, 2, 3] as const).map((day) => (
            <TabsTrigger key={day} value={String(day)} className="text-xs">
              {t.days[day].short}
            </TabsTrigger>
          ))}
        </TabsList>

        {([1, 2, 3] as const).map((day) => (
          <TabsContent key={day} value={String(day)} className="mt-4">
            <p className="mb-2 text-sm text-muted-foreground">{t.days[day].label}</p>
            <div className="divide-y divide-border">
              {getPerformancesByDay(day).map((p) => (
                <PerformanceCard key={p.id} p={p} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
