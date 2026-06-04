import React, { useMemo } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  advanceScheduleWindow,
  goToToday,
  retreatScheduleWindow,
  setSelectedDate,
  setSelectedTime,
  setViewRange,
} from '@/redux/slices/calendarSlice'
import type { CalendarDay, CalendarInterval, CalendarViewRange } from '@/types'
import {
  CATEGORY_CELL_STYLES,
  CATEGORY_LABEL,
  type ClinicCalendarEvent,
} from '../clinicCalendarData'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/utils/cn'
import DayAggregatedCalendarView from './DayAggregatedCalendarView'

export interface SelectedSlot {
  dayIndex: number
  time: string
}

const generateTimeSlots = (interval: CalendarInterval): string[] => {
  const slots: string[] = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const date = new Date()
      date.setHours(hour, minute, 0, 0)
      slots.push(
        date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      )
    }
  }
  return slots
}

/** Time column fixed; day columns share remaining width — no horizontal scroll */
const TIME_COL_WIDTH_PX = 84

const gridTemplateColumns = (dayCount: number) =>
  `${TIME_COL_WIDTH_PX}px repeat(${dayCount}, minmax(0, 1fr))`

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '…'
}

const EVENT_DRAG_MIME = 'application/x-clinic-event'

/** Compact block inside a cell — only Client Name + Appointment Type (everything else in Item Details). */
function CellEventCard({
  ev,
  isActive,
  onSelect,
  onDragStart,
}: {
  ev: ClinicCalendarEvent
  isActive: boolean
  onSelect: () => void
  onDragStart: (e: React.DragEvent) => void
}) {
  const styles = CATEGORY_CELL_STYLES[ev.category]
  const clientLabel = ev.patientName ? truncateText(ev.patientName, 16) : 'No client'
  return (
    <button
      type="button"
      draggable
      onDragStart={onDragStart}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      title={`${ev.patientName ?? 'No client'} · ${CATEGORY_LABEL[ev.category]}`}
      className={cn(
        'flex min-w-0 flex-1 cursor-pointer flex-col gap-0.5 rounded-md border px-1.5 py-1 text-left shadow-sm outline-none transition',
        'hover:brightness-[0.98] focus-visible:ring-2 focus-visible:ring-violet-500 active:cursor-grabbing',
        styles.card,
        isActive && 'ring-2 ring-primary/70'
      )}
    >
      <span
        className={cn(
          'truncate text-[11px] font-semibold leading-tight text-accent',
          !ev.patientName && 'italic text-muted-foreground/70'
        )}
      >
        {clientLabel}
      </span>
      <span className={cn('truncate text-[10px] font-medium leading-tight', styles.accent)}>
        {CATEGORY_LABEL[ev.category]}
      </span>
    </button>
  )
}

interface CalendarViewProps {
  events: ClinicCalendarEvent[]
  searchValue: string
  onSearchChange: (value: string) => void
  interval: CalendarInterval
  onIntervalChange: (interval: CalendarInterval) => void
  selectedSlot: SelectedSlot | null
  onSlotSelect: (slot: SelectedSlot | null) => void
  selectedDayIso: string | null
  onDaySelect: (iso: string | null) => void
  /** Click an empty slot to create a new schedule item there. */
  onCreateAt: (dateISO: string, time: string) => void
  /** Drag-and-drop reschedule. */
  onEventMove: (eventId: string, dateISO: string, time: string) => void
}

const viewRangeOptions: { value: string; label: string; range: CalendarViewRange }[] = [
  { value: '1', label: '1 Day', range: 1 },
  { value: '5', label: '5 Days', range: 5 },
  { value: '7', label: '7 Days', range: 7 },
  { value: '14', label: '14 Days', range: 14 },
  { value: '30', label: '30 Days', range: 30 },
]

const intervalOptions: { value: string; label: string; interval: CalendarInterval }[] = [
  { value: '15', label: '15-minute slots', interval: 15 },
  { value: '30', label: '30-minute slots', interval: 30 },
  { value: '60', label: '60-minute slots', interval: 60 },
]

const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  searchValue,
  onSearchChange,
  interval,
  onIntervalChange,
  selectedSlot,
  onSlotSelect,
  selectedDayIso,
  onDaySelect,
  onCreateAt,
  onEventMove,
}) => {
  const dispatch = useAppDispatch()
  const { days, viewRange, selectedDate, selectedTime, startDate } = useAppSelector(
    (state) => state.calendar
  )

  const timeSlots = useMemo(() => generateTimeSlots(interval), [interval])

  const todayISO = new Date().toISOString().split('T')[0]
  const nextDayISO = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  })()

  const canRetreatWindow = startDate > todayISO

  const isAggregatedView = viewRange >= 14

  const eventsFilteredBySearch = useMemo(() => {
    const q = searchValue.trim().toLowerCase()
    if (!q) return events
    return events.filter((ev) => {
      const haystacks = [
        ev.patientName, // Client name
        ev.staffName, // Practitioner name
        CATEGORY_LABEL[ev.category], // Appointment type
        ev.taskTitle,
        ev.diagnosis, // Diagnosis
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

  const getEventsForCell = (dayDate: string, time: string) =>
    eventsFilteredBySearch.filter((ev) => ev.dateISO === dayDate && ev.time === time)

  const dayCount = days.length

  // Month / Year label for the header (e.g. "June 2026" or "Jun – Jul 2026").
  const monthYearLabel = useMemo(() => {
    if (!days.length) return ''
    const first = new Date(days[0].date + 'T12:00:00')
    const last = new Date(days[days.length - 1].date + 'T12:00:00')
    const sameMonth =
      first.getMonth() === last.getMonth() && first.getFullYear() === last.getFullYear()
    if (sameMonth) {
      return first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }
    const sameYear = first.getFullYear() === last.getFullYear()
    const left = first.toLocaleDateString('en-US', { month: 'short' })
    const right = last.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
    return sameYear ? `${left} – ${right}` : `${left} ${first.getFullYear()} – ${right}`
  }, [days])

  const handleDrop = (e: React.DragEvent, dateISO: string, time: string) => {
    const eventId = e.dataTransfer.getData(EVENT_DRAG_MIME)
    if (!eventId) return
    e.preventDefault()
    onEventMove(eventId, dateISO, time)
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Toolbar: month/year + search + controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="whitespace-nowrap text-lg font-bold text-accent sm:text-xl">
            {monthYearLabel}
          </h2>
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
          <button
            type="button"
            onClick={() => dispatch(goToToday())}
            className={cn(
              'h-8 rounded-full border px-3 text-xs font-semibold transition-colors',
              selectedDate === todayISO
                ? 'border-primary/30 bg-primary/10 text-primary'
                : 'border-border bg-background text-accent hover:bg-muted/30'
            )}
          >
            Today
          </button>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search client, practitioner, type, diagnosis…"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-9 w-full rounded-full border border-border bg-background pl-9 pr-3 text-sm text-accent placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <Select
            value={String(viewRange)}
            onValueChange={(v) => dispatch(setViewRange(Number(v) as CalendarViewRange))}
          >
            <SelectTrigger className="w-full shrink-0 sm:w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {viewRangeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(interval)}
            onValueChange={(v) => onIntervalChange(Number(v) as CalendarInterval)}
          >
            <SelectTrigger className="w-full shrink-0 sm:w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {intervalOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {isAggregatedView ? (
          <div className="h-full overflow-y-auto [scrollbar-width:thin]">
            <DayAggregatedCalendarView
              days={days}
              events={eventsFilteredBySearch}
              selectedDayIso={selectedDayIso}
              onDaySelect={onDaySelect}
              todayIso={todayISO}
            />
          </div>
        ) : (
          <div className="flex h-full min-h-0 w-full min-w-0 flex-col">
            {/* Sticky day header */}
            <div
              className="grid w-full min-w-0 border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground"
              style={{ gridTemplateColumns: gridTemplateColumns(dayCount) }}
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

            {/* Scrollable time rows */}
            <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className={cn(
                    'grid w-full min-w-0 items-stretch border-b border-border last:border-b-0',
                    interval === 60 ? 'min-h-[4.5rem]' : 'min-h-[3rem]',
                    selectedTime === time && 'bg-primary/5'
                  )}
                  style={{ gridTemplateColumns: gridTemplateColumns(dayCount) }}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    className="flex shrink-0 select-none items-start justify-center self-stretch border-r border-border bg-muted/20 px-2 py-2 text-xs font-medium text-accent"
                    onClick={() => onRowSelect(time)}
                  >
                    {time}
                  </div>

                  {days.map((day: CalendarDay, dayIndex: number) => {
                    const cellEvents = getEventsForCell(day.date, time)
                    const count = cellEvents.length
                    const isSlotSelected =
                      selectedSlot?.dayIndex === dayIndex && selectedSlot?.time === time

                    const handleSlotPick = () => {
                      if (isSlotSelected) onSlotSelect(null)
                      else onSlotSelect({ dayIndex, time })
                    }

                    const handleCellClick = () => {
                      // Empty slot → create a new item; occupied slot → open Item Details.
                      if (count === 0) onCreateAt(day.date, time)
                      else handleSlotPick()
                    }

                    return (
                      <div
                        key={day.date + time}
                        onClick={handleCellClick}
                        onDragOver={(e) => {
                          if (e.dataTransfer.types.includes(EVENT_DRAG_MIME)) e.preventDefault()
                        }}
                        onDrop={(e) => handleDrop(e, day.date, time)}
                        className={cn(
                          'group relative flex min-h-0 min-w-0 cursor-pointer border-r border-border p-0.5 transition-colors last:border-r-0',
                          isSlotSelected
                            ? 'bg-primary/10 ring-1 ring-inset ring-primary/40'
                            : day.date === selectedDate
                              ? 'bg-primary/5'
                              : 'hover:bg-muted/20'
                        )}
                      >
                        {count > 0 ? (
                          /* Overlapping appointments sit side-by-side — no horizontal scroll. */
                          <div className="flex min-w-0 flex-1 gap-1">
                            {cellEvents.map((ev) => (
                              <CellEventCard
                                key={ev.id}
                                ev={ev}
                                isActive={isSlotSelected}
                                onSelect={() => onSlotSelect({ dayIndex, time })}
                                onDragStart={(e) => {
                                  e.dataTransfer.setData(EVENT_DRAG_MIME, ev.id)
                                  e.dataTransfer.effectAllowed = 'move'
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="pointer-events-none m-auto text-base font-semibold text-muted-foreground opacity-0 transition-opacity group-hover:opacity-60">
                            +
                          </span>
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
