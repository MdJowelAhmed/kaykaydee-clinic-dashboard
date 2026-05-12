import React, { useMemo } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  advanceScheduleWindow,
  retreatScheduleWindow,
  setSelectedDate,
  setSelectedTime,
  setViewRange,
} from '@/redux/slices/calendarSlice'
import type { CalendarDay, CalendarViewRange } from '@/types'
import { CATEGORY_CELL_STYLES, type ClinicCalendarEvent } from '../clinicCalendarData'
import { cn } from '@/utils/cn'
import DayAggregatedCalendarView from './DayAggregatedCalendarView'

export interface SelectedSlot {
  dayIndex: number
  time: string
}

const generateTimeSlots = (): string[] => {
  const slots: string[] = []
  for (let hour = 0; hour < 24; hour++) {
    const date = new Date()
    date.setHours(hour, 0, 0, 0)
    slots.push(
      date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    )
  }
  return slots
}

const timeSlots: string[] = generateTimeSlots()

/** Time column fixed; day columns share remaining width — no horizontal scroll */
const TIME_COL_WIDTH_PX = 100

const gridTemplateColumns = (dayCount: number) =>
  `${TIME_COL_WIDTH_PX}px repeat(${dayCount}, minmax(0, 1fr))`

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '…'
}

function EventCompactRow({ ev, className }: { ev: ClinicCalendarEvent; className?: string }) {
  const styles = CATEGORY_CELL_STYLES[ev.category]
  const patientLabel = ev.patientName ? truncateText(ev.patientName, 12) : '— No patient'
  const roomLabel = ev.room ?? '— No room'
  const summaryLabel = ev.summary ?? 'No summary added yet'
  return (
    <div
      className={cn(
        'min-w-0 rounded-md border px-2 py-1.5 text-left text-[10px] shadow-sm',
        styles.card,
        className
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <span className="line-clamp-2 font-semibold leading-tight text-accent">{ev.taskTitle}</span>
        <span className={cn('shrink-0 font-bold', styles.accent)}>{ev.id}</span>
      </div>
      <p
        className={cn(
          'mt-0.5 line-clamp-2 leading-snug',
          ev.summary ? 'text-muted-foreground' : 'italic text-muted-foreground/70'
        )}
      >
        {summaryLabel}
      </p>
      <div className="mt-0.5 flex items-center justify-between gap-1 text-[9px] text-accent">
        <span
          className={cn(
            'truncate font-medium',
            !ev.patientName && 'italic text-muted-foreground/70'
          )}
        >
          {patientLabel}
        </span>
        <span
          className={cn(
            'shrink-0 text-muted-foreground',
            !ev.room && 'italic text-muted-foreground/70'
          )}
        >
          {roomLabel}
        </span>
      </div>
    </div>
  )
}

function CellEventCard({
  ev,
  isActive,
  onSelect,
}: {
  ev: ClinicCalendarEvent
  isActive: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      className={cn(
        'block w-full min-w-0 cursor-pointer text-left outline-none transition',
        'hover:brightness-[0.98] focus-visible:ring-2 focus-visible:ring-violet-500',
        isActive && 'rounded-md ring-2 ring-primary/70'
      )}
    >
      <EventCompactRow ev={ev} />
    </button>
  )
}

interface CalendarViewProps {
  events: ClinicCalendarEvent[]
  searchValue: string
  onSearchChange: (value: string) => void
  selectedSlot: SelectedSlot | null
  onSlotSelect: (slot: SelectedSlot | null) => void
  selectedDayIso: string | null
  onDaySelect: (iso: string | null) => void
}

const viewOptions: { label: string; range: CalendarViewRange }[] = [
  { label: '7 days', range: 7 },
  { label: '10 days', range: 10 },
  { label: '15 days', range: 15 },
  { label: '30 days', range: 30 },
]

const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  searchValue,
  onSearchChange,
  selectedSlot,
  onSlotSelect,
  selectedDayIso,
  onDaySelect,
}) => {
  const dispatch = useAppDispatch()
  const { days, viewRange, selectedDate, selectedTime, startDate } = useAppSelector(
    (state) => state.calendar
  )

  const todayISO = new Date().toISOString().split('T')[0]
  const nextDayISO = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  })()

  const canRetreatWindow = startDate > todayISO

  const isAggregatedView = viewRange === 15 || viewRange === 30

  const eventsFilteredBySearch = useMemo(() => {
    const q = searchValue.trim().toLowerCase()
    if (!q) return events
    return events.filter((ev) => {
      const haystacks = [
        ev.patientName,
        ev.taskTitle,
        ev.summary,
        ev.room,
        ev.staffName,
        ev.id,
      ]
      return haystacks.some((field) => field?.toLowerCase().includes(q))
    })
  }, [events, searchValue])

  const onDayHeaderClick = (day: CalendarDay) => {
    dispatch(setSelectedDate(selectedDate === day.date ? '' : day.date))
  }

  const onRowSelect = (time: string) => {
    dispatch(setSelectedTime(selectedTime === time ? '' : time))
  }

  const onCellSelect = (day: CalendarDay) => {
    dispatch(setSelectedDate(selectedDate === day.date ? '' : day.date))
  }

  const getEventsForCell = (dayDate: string, time: string) =>
    eventsFilteredBySearch.filter((ev) => ev.dateISO === dayDate && ev.time === time)

  const handleViewChange = (range: CalendarViewRange) => {
    dispatch(setViewRange(range))
  }

  const dayCount = days.length

  const helperText = isAggregatedView
    ? 'Click a day card to see every visit on the right. From there, click a patient name to open their full profile.'
    : 'Click a time slot to see details on the right — use patient links there for full profiles.'

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search patient, room, task, staff…"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full rounded-full border border-border bg-background pl-9 pr-3 text-sm text-accent placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <div className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/30 p-0.5">
            <button
              type="button"
              title="Show earlier dates (stops at today)"
              disabled={!canRetreatWindow}
              onClick={() => dispatch(retreatScheduleWindow())}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-full text-accent transition-colors',
                canRetreatWindow
                  ? 'hover:bg-background hover:shadow-sm'
                  : 'cursor-not-allowed opacity-40'
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Show later dates"
              onClick={() => dispatch(advanceScheduleWindow())}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-accent transition-colors hover:bg-background hover:shadow-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="inline-flex flex-wrap rounded-full bg-muted/40 p-1">
            {viewOptions.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => handleViewChange(option.range)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                  viewRange === option.range
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-accent'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <p className="border-b border-border bg-muted/20 px-3 py-2 text-center text-[11px] text-muted-foreground">
          <span className="font-medium text-accent">Range:</span> 7 / 10 days use the hourly grid;
          15 / 30 days use the activity cards below. <span className="font-medium text-accent">
            Arrows
          </span>{' '}
          move the window. {helperText}
        </p>
        {isAggregatedView ? (
          <DayAggregatedCalendarView
            days={days}
            events={eventsFilteredBySearch}
            selectedDayIso={selectedDayIso}
            onDaySelect={onDaySelect}
            todayIso={todayISO}
          />
        ) : (
        <div className="w-full min-w-0 overflow-x-hidden">
          <div
            className="grid w-full min-w-0 border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground"
            style={{
              gridTemplateColumns: gridTemplateColumns(dayCount),
            }}
          >
            <div className="flex shrink-0 items-center justify-center border-r border-border bg-muted/20 py-3 text-accent">
              Time
            </div>
            {days.map((day: CalendarDay) => (
              <div
                key={day.date}
                role="button"
                tabIndex={0}
                onClick={() => onDayHeaderClick(day)}
                className={cn(
                  'flex min-w-0 cursor-pointer flex-col items-center justify-center border-r border-border py-3 transition-colors last:border-r-0',
                  day.date === selectedDate && 'bg-primary/10',
                  day.date !== selectedDate && day.date === todayISO && 'bg-sky-500/10',
                  day.date !== selectedDate && day.date === nextDayISO && 'bg-emerald-500/10'
                )}
              >
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {day.label}
                </span>
                <span className="mt-1 text-base font-semibold text-accent">
                  {day.dayNumber.toString().padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>

          <div>
            {timeSlots.map((time) => (
              <div
                key={time}
                onClick={(e) => {
                  const t = e.target as HTMLElement
                  if (t.closest('[data-calendar-cell]')) return
                  onRowSelect(time)
                }}
                className={cn(
                  'grid w-full min-h-[5.5rem] min-w-0 items-stretch border-b border-border last:border-b-0 sm:min-h-[6rem]',
                  selectedTime === time && 'bg-primary/5'
                )}
                style={{
                  gridTemplateColumns: gridTemplateColumns(dayCount),
                }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  className="flex shrink-0 select-none items-start justify-center self-stretch border-r border-border bg-muted/20 px-2 py-3 text-xs font-medium text-accent"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRowSelect(time)
                  }}
                >
                  {time}
                </div>

                {days.map((day: CalendarDay, dayIndex: number) => {
                  const cellEvents = getEventsForCell(day.date, time)
                  const count = cellEvents.length
                  const isSlotSelected =
                    selectedSlot?.dayIndex === dayIndex && selectedSlot?.time === time

                  const handleSlotPick = () => {
                    if (count === 0) return
                    if (isSlotSelected) {
                      onSlotSelect(null)
                    } else {
                      onSlotSelect({ dayIndex, time })
                    }
                  }

                  const handleCellClick = () => {
                    if (count > 0) handleSlotPick()
                    else onCellSelect(day)
                  }

                  return (
                    <div
                      key={day.date + time}
                      data-calendar-cell
                      onClick={handleCellClick}
                      className={cn(
                        'relative flex min-h-0 min-w-0 flex-col border-r border-border p-0.5 transition-colors last:border-r-0 sm:p-1',
                        count > 0 && 'cursor-pointer',
                        isSlotSelected
                          ? 'bg-primary/10 ring-1 ring-inset ring-primary/40'
                          : day.date === selectedDate
                            ? 'bg-primary/5'
                            : 'bg-transparent'
                      )}
                    >
                      {count > 0 && (
                        <div className="flex max-h-36 min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden overscroll-y-contain [scrollbar-width:thin] sm:max-h-40">
                          {count > 1 && (
                            <p className="sticky top-0 z-[1] -mx-0.5 mb-0.5 rounded bg-primary/90 px-1.5 py-0.5 text-center text-[9px] font-semibold text-white shadow-sm">
                              {count} in slot — tap for details
                            </p>
                          )}
                          {cellEvents.map((ev) => (
                            <CellEventCard
                              key={ev.id}
                              ev={ev}
                              isActive={isSlotSelected}
                              onSelect={handleSlotPick}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  )
}

export default CalendarView
