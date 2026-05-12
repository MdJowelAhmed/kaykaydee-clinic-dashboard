import React from 'react'
import type { CalendarDay } from '@/types'
import { cn } from '@/utils/cn'

export interface DayOverviewCardProps {
  day: CalendarDay
  activityCount: number
  isSelected: boolean
  isToday: boolean
  onSelect: () => void
}

/** Summary card for multi-week overview (15 / 30 day views). */
const DayOverviewCard: React.FC<DayOverviewCardProps> = ({
  day,
  activityCount,
  isSelected,
  isToday,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex min-h-[7.5rem] w-full flex-col rounded-xl border bg-card p-3 text-left shadow-sm transition-all',
        'hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        isSelected && 'border-primary ring-2 ring-primary/30',
        !isSelected && 'border-border/80',
        isToday && !isSelected && 'border-sky-400/50 bg-sky-50/40 dark:bg-sky-950/20'
      )}
    >
      <span className="text-xl font-bold leading-none text-accent tabular-nums">
        {day.dayNumber}
      </span>
      <span className="mt-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Activities
      </span>
      <span className="mt-0.5 text-lg font-semibold tabular-nums text-muted-foreground">
        {activityCount}
      </span>
    </button>
  )
}

export default DayOverviewCard
