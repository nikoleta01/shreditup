'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { FESTIVAL_DAYS, getPerformancesByDay, STAGE_NAME, type Performance } from '@/lib/data'

const SLOT_HEIGHT = 60 // px per hour
const START_HOUR = 12 // timetable starts at 12:00
const END_HOUR = 25 // 01:00 next day

function timeToMinutes(time: string) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function minutesSinceStart(time: string) {
  return timeToMinutes(time) - START_HOUR * 60
}

function totalMinutes() {
  return (END_HOUR - START_HOUR) * 60
}

function hourLabels() {
  const labels = []
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    labels.push(h % 24)
  }
  return labels
}

function PerformanceBlock({ p }: { p: Performance }) {
  const top = (minutesSinceStart(p.startTime) / 60) * SLOT_HEIGHT
  const startMins = timeToMinutes(p.startTime)
  let endMins = timeToMinutes(p.endTime)
  if (endMins < startMins) endMins += 24 * 60 // crosses midnight
  const height = Math.max(((endMins - startMins) / 60) * SLOT_HEIGHT - 4, 20)

  return (
    <div
      className="absolute left-0 right-0 mx-1 overflow-hidden rounded-md bg-primary/90 px-2 py-1 text-primary-foreground"
      style={{ top, height }}
    >
      <p className="truncate text-xs font-semibold leading-tight">{p.artist}</p>
      <p className="truncate text-[10px] opacity-75">
        {p.startTime}–{p.endTime}
      </p>
    </div>
  )
}

function DayTimetable({ day }: { day: 1 | 2 | 3 }) {
  const perfs = getPerformancesByDay(day)
  const gridHeight = (totalMinutes() / 60) * SLOT_HEIGHT
  const labels = hourLabels()

  return (
    <div className="flex overflow-x-auto pb-4">
      {/* Time axis */}
      <div className="relative mr-2 shrink-0" style={{ height: gridHeight }}>
        {labels.map((h, i) => (
          <div
            key={h}
            className="absolute right-0 -translate-y-2 text-right text-[10px] tabular-nums text-muted-foreground"
            style={{ top: i * SLOT_HEIGHT }}
          >
            {String(h).padStart(2, '0')}:00
          </div>
        ))}
      </div>

      {/* Stage column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-1 text-center text-xs font-medium text-muted-foreground">
          {STAGE_NAME}
        </div>
        <div className="relative" style={{ height: gridHeight }}>
          {/* Hour grid lines */}
          {labels.map((h, i) => (
            <div
              key={h}
              className="absolute left-0 right-0 border-t border-border/40"
              style={{ top: i * SLOT_HEIGHT }}
            />
          ))}
          {/* Performances */}
          {perfs.map((p) => (
            <PerformanceBlock key={p.id} p={p} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TimetablePage() {
  const [activeDay, setActiveDay] = useState<'1' | '2' | '3'>('1')

  return (
    <div className="px-4 pt-4">
      <div className="mx-auto max-w-lg">
        <p className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Harmonogram
        </p>

        <Tabs value={activeDay} onValueChange={(v) => setActiveDay(v as '1' | '2' | '3')}>
          <TabsList className="mb-4 grid w-full grid-cols-3">
            {([1, 2, 3] as const).map((day) => (
              <TabsTrigger key={day} value={String(day)} className="text-xs">
                {FESTIVAL_DAYS[day].short}
              </TabsTrigger>
            ))}
          </TabsList>

          {([1, 2, 3] as const).map((day) => (
            <TabsContent key={day} value={String(day)}>
              <DayTimetable day={day} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
