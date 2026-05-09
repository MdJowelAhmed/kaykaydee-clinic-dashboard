import React, { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setPeriod, setSelectedDate, setSelectedTime, setViewRange } from '@/redux/slices/calendarSlice'
import type { CalendarDay, CalendarPeriod, CalendarViewRange } from '@/types'
import { CATEGORY_CELL_STYLES, type ClinicCalendarEvent } from '../clinicCalendarData'
import { cn } from '@/utils/cn'

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

/** Time column fixed; day columns equal width — wider when fewer days are visible */
const TIME_COL_WIDTH_PX = 100

function dayColumnWidthPx(dayCount: number): number {
  if (dayCount <= 7) return 200
  if (dayCount <= 10) return 175
  if (dayCount <= 15) return 160
  return 140
}

const gridTemplateColumns = (dayCount: number, dayColPx: number) =>
  `${TIME_COL_WIDTH_PX}px repeat(${dayCount}, ${dayColPx}px)`

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '…'
}

/** Same compact layout as a cell card */
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

/** Compact card inside a cell — clicking it opens the slot's full details in the side panel */
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
      data-stop-calendar-drag
      data-stop-row-select
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
}

const viewOptions: { label: string; range: CalendarViewRange; period?: CalendarPeriod }[] = [
  { label: '7 days', range: 7 },
  { label: '10 days', range: 10 },
  { label: '15 days', range: 15 },
  { label: '30 days', range: 30 },
  { label: 'Prev 30 days', range: 30, period: 'previous' },
]

const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  searchValue,
  onSearchChange,
  selectedSlot,
  onSlotSelect,
}) => {
  const dispatch = useAppDispatch()
  const { days, viewRange, period, selectedDate, selectedTime } = useAppSelector((state) => state.calendar)
  const dayColWidthPx = dayColumnWidthPx(days.length)
  const horizontalScrollRef = useRef<HTMLDivElement>(null)
  const [horizontalGrab, setHorizontalGrab] = useState(false)

  const todayISO = new Date().toISOString().split('T')[0]
  const nextDayISO = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  })()

  useEffect(() => {
    if (!horizontalGrab) return
    const onMove = (e: MouseEvent) => {
      const el = horizontalScrollRef.current
      if (!el) return
      el.scrollLeft -= e.movementX
    }
    const onUp = () => setHorizontalGrab(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [horizontalGrab])

  const onTimeColumnGrabDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    setHorizontalGrab(true)
  }

  const onDayHeaderClick = (day: CalendarDay) => {
    dispatch(setSelectedDate(selectedDate === day.date ? '' : day.date))
  }

  const onRowSelect = (time: string) => {
    dispatch(setSelectedTime(selectedTime === time ? '' : time))
  }

  const onCellSelect = (day: CalendarDay) => {
    dispatch(setSelectedDate(selectedDate === day.date ? '' : day.date))
  }

  const getEventsForCell = (dayIndex: number, time: string) => {
    let filtered = events.filter((ev) => ev.dayIndex === dayIndex && ev.time === time)

    if (searchValue.trim()) {
      const q = searchValue.toLowerCase()
      filtered = filtered.filter((ev) => {
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
    }

    return filtered
  }

  const handleViewChange = (option: (typeof viewOptions)[number]) => {
    if (option.period === 'previous') {
      dispatch(setPeriod('previous'))
    } else {
      dispatch(setViewRange(option.range))
    }
  }

  const isActiveOption = (option: (typeof viewOptions)[number]) => {
    if (option.period === 'previous') {
      return period === 'previous'
    }
    return period === 'current' && viewRange === option.range
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

        <div className="inline-flex flex-wrap rounded-full bg-muted/40 p-1">
          {viewOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => handleViewChange(option)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                isActiveOption(option)
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-accent'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <p className="border-b border-border bg-muted/20 px-3 py-2 text-center text-[11px] text-muted-foreground">
          <span className="font-medium text-accent">Sideways:</span> hold and drag the grey{' '}
          <span className="font-medium text-accent">time</span> cell on the left ·{' '}
          <span className="font-medium text-accent">Click a slot</span> to see every visit on the
          right
        </p>
        <div ref={horizontalScrollRef} className="overflow-x-auto overflow-y-visible">
          <div
            className="grid w-max border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground"
            style={{
              gridTemplateColumns: gridTemplateColumns(days.length, dayColWidthPx),
            }}
          >
            <div
              className="sticky left-0 z-10 flex shrink-0 items-center justify-center border-r border-border bg-muted/20 py-3 text-accent"
              style={{
                width: TIME_COL_WIDTH_PX,
                minWidth: TIME_COL_WIDTH_PX,
                maxWidth: TIME_COL_WIDTH_PX,
              }}
            >
              Time
            </div>
            {days.map((day: CalendarDay) => (
              <div
                key={day.date}
                role="button"
                tabIndex={0}
                onClick={() => onDayHeaderClick(day)}
                className={cn(
                  'flex min-w-0 cursor-pointer flex-col items-center justify-center border-r border-border py-3 transition-colors',
                  day.date === selectedDate && 'bg-primary/10',
                  day.date !== selectedDate && day.date === todayISO && 'bg-sky-500/10',
                  day.date !== selectedDate && day.date === nextDayISO && 'bg-emerald-500/10'
                )}
                style={{
                  width: dayColWidthPx,
                  minWidth: dayColWidthPx,
                  maxWidth: dayColWidthPx,
                }}
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
                  if (t.closest('[data-stop-row-select]')) return
                  onRowSelect(time)
                }}
                className={cn(
                  'grid w-max min-h-[7rem] items-stretch border-b border-border last:border-b-0',
                  selectedTime === time && 'bg-primary/5'
                )}
                style={{
                  gridTemplateColumns: gridTemplateColumns(days.length, dayColWidthPx),
                }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  title="Drag to scroll the calendar sideways"
                  className={cn(
                    'sticky left-0 z-10 flex shrink-0 select-none items-start justify-center self-stretch border-r border-border bg-muted/20 px-2 py-4 text-xs font-medium text-accent',
                    horizontalGrab ? 'cursor-grabbing' : 'cursor-grab active:cursor-grabbing'
                  )}
                  style={{
                    width: TIME_COL_WIDTH_PX,
                    minWidth: TIME_COL_WIDTH_PX,
                    maxWidth: TIME_COL_WIDTH_PX,
                  }}
                  onMouseDown={onTimeColumnGrabDown}
                  onClick={(e) => {
                    e.stopPropagation()
                    onRowSelect(time)
                  }}
                >
                  {time}
                </div>

                {days.map((day: CalendarDay, dayIndex: number) => {
                  const cellEvents = getEventsForCell(dayIndex, time)
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

                  return (
                    <div
                      key={day.date + time}
                      onClick={(e) => {
                        const t = e.target as HTMLElement
                        if (t.closest('[data-stop-row-select]')) return
                        if (count > 0) {
                          handleSlotPick()
                        } else {
                          onCellSelect(day)
                        }
                      }}
                      className={cn(
                        'relative flex min-h-0 min-w-0 flex-col border-r border-border p-1 transition-colors',
                        count > 0 && 'cursor-pointer',
                        isSlotSelected
                          ? 'bg-primary/10 ring-1 ring-inset ring-primary/40'
                          : day.date === selectedDate
                            ? 'bg-primary/5'
                            : 'bg-transparent'
                      )}
                      style={{
                        width: dayColWidthPx,
                        minWidth: dayColWidthPx,
                        maxWidth: dayColWidthPx,
                      }}
                    >
                      {count > 0 && (
                        <div
                          data-stop-row-select
                          className="flex max-h-44 min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden overscroll-y-contain pr-0.5 [scrollbar-width:thin]"
                        >
                          {count > 1 && (
                            <p className="sticky top-0 z-[1] -mx-0.5 mb-0.5 rounded bg-primary/90 px-1.5 py-0.5 text-center text-[9px] font-semibold text-accent shadow-sm">
                              {count} in slot — click to view
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
      </div>
    </div>
  )
}

export default CalendarView
