import React, { useMemo } from 'react'
import type { CalendarDay } from '@/types'
import type { ClinicCalendarEvent } from '../clinicCalendarData'
import DayOverviewCard from './DayOverviewCard'
import { cn } from '@/utils/cn'

const COLS = 7

function chunkDays<T>(items: T[], size: number): T[][] {
  const rows: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size))
  }
  return rows
}

export interface DayAggregatedCalendarViewProps {
  days: CalendarDay[]
  events: ClinicCalendarEvent[]
  selectedDayIso: string | null
  onDaySelect: (iso: string | null) => void
  todayIso: string
}

const DayAggregatedCalendarView: React.FC<DayAggregatedCalendarViewProps> = ({
  days,
  events,
  selectedDayIso,
  onDaySelect,
  todayIso,
}) => {
  const rows = useMemo(() => chunkDays(days, COLS), [days])

  const countByDate = useMemo(() => {
    const m = new Map<string, number>()
    for (const ev of events) {
      m.set(ev.dateISO, (m.get(ev.dateISO) ?? 0) + 1)
    }
    return m
  }, [events])

  return (
    <div className="rounded-xl border border-border bg-muted/50 p-3 sm:p-4">
      <div className="flex flex-col gap-3">
        {rows.map((row, rowIndex) => (
          <div
            key={row[0]?.date ?? rowIndex}
            className="grid grid-cols-[minmax(2rem,2.5rem)_minmax(0,1fr)] items-stretch gap-x-2 sm:gap-x-3"
          >
            <div
              className={cn(
                'flex items-center justify-end pr-1 text-sm font-medium tabular-nums text-muted-foreground sm:pr-2'
              )}
              aria-hidden
            >
              {row[0]?.dayNumber ?? ''}
            </div>
            <div className="grid min-w-0 grid-cols-7 gap-1.5 sm:gap-2">
              {row.map((day) => (
                <DayOverviewCard
                  key={day.date}
                  day={day}
                  activityCount={countByDate.get(day.date) ?? 0}
                  isSelected={selectedDayIso === day.date}
                  isToday={day.date === todayIso}
                  onSelect={() =>
                    onDaySelect(selectedDayIso === day.date ? null : day.date)
                  }
                />
              ))}
              {Array.from({ length: COLS - row.length }).map((_, i) => (
                <div
                  key={`pad-${rowIndex}-${i}`}
                  className="min-h-[7.5rem] rounded-xl border border-transparent opacity-0"
                  aria-hidden
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DayAggregatedCalendarView
