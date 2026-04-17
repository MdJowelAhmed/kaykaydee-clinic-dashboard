import React, { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setPeriod, setSelectedDate, setSelectedTime, setViewRange } from '@/redux/slices/calendarSlice'
import type { CalendarDay, CalendarPeriod, CalendarViewRange } from '@/types'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { CATEGORY_CELL_STYLES, type ClinicCalendarEvent } from '../clinicCalendarData'
import { cn } from '@/utils/cn'

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
  if (dayCount <= 7) return 240
  if (dayCount <= 10) return 200
  if (dayCount <= 15) return 175
  return 150
}

const gridTemplateColumns = (dayCount: number, dayColPx: number) =>
  `${TIME_COL_WIDTH_PX}px repeat(${dayCount}, ${dayColPx}px)`

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '…'
}

/** Same compact layout as a cell card — shown first in hover popover */
function EventCompactRow({ ev, className }: { ev: ClinicCalendarEvent; className?: string }) {
  const styles = CATEGORY_CELL_STYLES[ev.category]
  return (
    <div
      className={cn(
        'min-w-0 rounded-md border px-2 py-1.5 text-left text-[10px] shadow-sm',
        styles.card,
        className
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <span className="line-clamp-2 font-semibold leading-tight text-slate-900">{ev.taskTitle}</span>
        <span className={cn('shrink-0 font-bold', styles.accent)}>{ev.id}</span>
      </div>
      <p className="mt-0.5 line-clamp-2 leading-snug text-slate-600">{ev.summary}</p>
      <div className="mt-0.5 flex items-center justify-between gap-1 text-[9px] text-slate-700">
        <span className="truncate font-medium">{truncateText(ev.patientName, 12)}</span>
        <span className="shrink-0 text-slate-500">{ev.room}</span>
      </div>
    </div>
  )
}

/** Scrollable extra fields (no duplicate title row — compact row above covers that) */
function EventTooltipScrollBody({ ev }: { ev: ClinicCalendarEvent }) {
  const st = CATEGORY_CELL_STYLES[ev.category]
  return (
    <div className="space-y-2 text-xs">
      <p className="leading-relaxed text-slate-700">{ev.summary}</p>
      <dl className="space-y-1 text-[11px] text-slate-600">
        <div className="flex gap-2">
          <dt className="shrink-0 font-medium text-slate-500">Patient</dt>
          <dd className="text-slate-800">{ev.patientName}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 font-medium text-slate-500">Room</dt>
          <dd className="text-slate-800">{ev.room}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 font-medium text-slate-500">Staff</dt>
          <dd className={cn('font-medium', st.accent)}>{ev.staffName}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 font-medium text-slate-500">Time</dt>
          <dd className="text-slate-800">{ev.time}</dd>
        </div>
      </dl>
    </div>
  )
}

/** Compact card inside a cell; hover shows same row preview first, full text below with scroll */
function CellEventCard({ ev }: { ev: ClinicCalendarEvent }) {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <div
          data-stop-calendar-drag
          data-stop-row-select
          className={cn(
            'min-w-0 cursor-pointer outline-none transition hover:brightness-[0.98]',
            'focus-visible:ring-2 focus-visible:ring-violet-500'
          )}
          tabIndex={0}
        >
          <EventCompactRow ev={ev} />
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="left"
        align="start"
        className={cn(
          'z-50 flex w-[min(22rem,calc(100vw-2rem))] max-h-[min(32rem,70vh)] flex-col overflow-hidden p-0',
          'border border-slate-200 bg-white text-slate-900 shadow-lg'
        )}
      >
        <div className="shrink-0 border-b border-slate-100 bg-white p-2">
          <EventCompactRow ev={ev} className="shadow-none" />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-2 [scrollbar-width:thin]">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Full details
          </p>
          <EventTooltipScrollBody ev={ev} />
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

interface CalendarViewProps {
  events: ClinicCalendarEvent[]
  searchValue: string
  onSearchChange: (value: string) => void
}

const viewOptions: { label: string; range: CalendarViewRange; period?: CalendarPeriod }[] = [
  { label: '7 days', range: 7 },
  { label: '10 days', range: 10 },
  { label: '15 days', range: 15 },
  { label: '30 days', range: 30 },
  { label: 'Prev 30 days', range: 30, period: 'previous' },
]

const CalendarView: React.FC<CalendarViewProps> = ({ events, searchValue, onSearchChange }) => {
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
      filtered = filtered.filter(
        (ev) =>
          ev.patientName.toLowerCase().includes(q) ||
          ev.taskTitle.toLowerCase().includes(q) ||
          ev.summary.toLowerCase().includes(q) ||
          ev.room.toLowerCase().includes(q) ||
          ev.staffName.toLowerCase().includes(q) ||
          ev.id.toLowerCase().includes(q)
      )
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
    

        <div className="inline-flex flex-wrap rounded-full bg-slate-100 p-1">
          {viewOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => handleViewChange(option)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                isActiveOption(option)
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <p className="border-b border-slate-100 bg-slate-50/80 px-3 py-2 text-center text-[11px] text-slate-500">
          <span className="font-medium text-slate-600">Sideways:</span> hold and drag the grey{' '}
          <span className="font-medium text-slate-600">time</span> cell on the left ·{' '}
          <span className="font-medium text-slate-600">Stacked visits:</span> scroll inside the cell
        </p>
        <div ref={horizontalScrollRef} className="overflow-x-auto overflow-y-visible">
          <div
            className="grid w-max border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600"
            style={{
              gridTemplateColumns: gridTemplateColumns(days.length, dayColWidthPx),
            }}
          >
            <div
              className="sticky left-0 z-10 flex shrink-0 items-center justify-center border-r border-slate-200 bg-slate-50 py-3"
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
                  'flex min-w-0 cursor-pointer flex-col items-center justify-center border-r border-slate-200 py-3 transition-colors',
                  day.date === selectedDate && 'bg-violet-50',
                  day.date !== selectedDate && day.date === todayISO && 'bg-sky-50/80',
                  day.date !== selectedDate && day.date === nextDayISO && 'bg-emerald-50/70'
                )}
                style={{
                  width: dayColWidthPx,
                  minWidth: dayColWidthPx,
                  maxWidth: dayColWidthPx,
                }}
              >
                <span className="text-[11px] uppercase tracking-wide text-slate-400">
                  {day.label}
                </span>
                <span className="mt-1 text-base font-semibold text-slate-900">
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
                  'grid w-max min-h-[7rem] items-stretch border-b border-slate-200 last:border-b-0',
                  selectedTime === time && 'bg-violet-50/40'
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
                    'sticky left-0 z-10 flex shrink-0 select-none items-start justify-center self-stretch border-r border-slate-200 bg-slate-50 px-2 py-4 text-xs font-medium text-slate-600',
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

                  return (
                    <div
                      key={day.date + time}
                      onClick={(e) => {
                        const t = e.target as HTMLElement
                        if (t.closest('[data-stop-row-select]')) return
                        onCellSelect(day)
                      }}
                      className={cn(
                        'relative flex min-h-0 min-w-0 flex-col border-r border-slate-100 p-1 transition-colors',
                        day.date === selectedDate && 'bg-violet-50/40',
                        // Keep "today/next day" coloring in header only (avoid mixed colors in each row).
                        day.date !== selectedDate && 'bg-transparent'
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
                            <p className="sticky top-0 z-[1] -mx-0.5 mb-0.5 rounded bg-violet-600/90 px-1.5 py-0.5 text-center text-[9px] font-semibold text-white shadow-sm">
                              {count} in slot — scroll
                            </p>
                          )}
                          {cellEvents.map((ev) => (
                            <CellEventCard key={ev.id} ev={ev} />
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
