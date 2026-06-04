import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import CalendarView, { type SelectedSlot } from './components/CalendarView'
import EventDetailsPanel from './components/EventDetailsPanel'
import CreateScheduleItemDialog, { type NewScheduleItem } from './components/CreateScheduleItemDialog'
import { resolveClinicCalendarEvents, type ClinicCalendarEvent } from './clinicCalendarData'
import { Card, CardContent } from '@/components/ui/card'
import type { CalendarInterval } from '@/types'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  patientCalendarCancelled,
  selectCancelledCalendarKeys,
  selectWaitlistEntries,
} from '@/redux/slices/waitlistSlice'
import {
  cancellationCompositeKey,
  firstWaitlistPatientForDoctor,
} from '@/pages/WaitingList/waitlistFlow'

const todayISOString = () => new Date().toISOString().split('T')[0]

const Calender: React.FC = () => {
  const dispatch = useAppDispatch()
  const { days, viewRange } = useAppSelector((state) => state.calendar)
  const waitingListEntries = useAppSelector(selectWaitlistEntries)
  const cancelledCalendarKeys = useAppSelector(selectCancelledCalendarKeys)

  // Events live in local state so they can be created (click a slot / the + button)
  // and rescheduled (drag-and-drop) directly on the calendar.
  const [events, setEvents] = useState<ClinicCalendarEvent[]>(() =>
    resolveClinicCalendarEvents(todayISOString())
  )
  const [intervalMinutes, setIntervalMinutes] = useState<CalendarInterval>(60)
  const [searchValue, setSearchValue] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null)
  const [selectedDayIso, setSelectedDayIso] = useState<string | null>(null)
  const [createState, setCreateState] = useState<{ dateISO: string; time: string } | null>(null)

  const cancelledKeySet = useMemo(() => new Set(cancelledCalendarKeys), [cancelledCalendarKeys])
  const visibleDateSet = useMemo(() => new Set(days.map((d) => d.date)), [days])

  const eventsInWindow = useMemo(
    () =>
      events
        .filter((e) => visibleDateSet.has(e.dateISO))
        .filter((e) => !cancelledKeySet.has(cancellationCompositeKey(e.id, e.dateISO))),
    [events, visibleDateSet, cancelledKeySet]
  )

  // Clear a stale day selection when it scrolls out of the visible window.
  useEffect(() => {
    if (selectedDayIso && !visibleDateSet.has(selectedDayIso)) {
      setSelectedDayIso(null)
    }
  }, [visibleDateSet, selectedDayIso])

  // Reset selection when switching between the hourly grid and the aggregated overview.
  useEffect(() => {
    setSelectedSlot(null)
    setSelectedDayIso(null)
  }, [viewRange])

  const slotEvents = useMemo(() => {
    if (!selectedSlot) return []
    const slotDay = days[selectedSlot.dayIndex]
    if (!slotDay) return []
    return eventsInWindow.filter(
      (e) => e.dateISO === slotDay.date && e.time === selectedSlot.time
    )
  }, [eventsInWindow, selectedSlot, days])

  const dayPanelEvents = useMemo(() => {
    if (!selectedDayIso) return []
    return eventsInWindow.filter((e) => e.dateISO === selectedDayIso)
  }, [selectedDayIso, eventsInWindow])

  const daySummaryTitle = useMemo(() => {
    if (!selectedDayIso) return undefined
    const d = days.find((x) => x.date === selectedDayIso)
    if (!d) return undefined
    return `${d.label} ${String(d.dayNumber).padStart(2, '0')}`
  }, [selectedDayIso, days])

  const panelVariant = selectedDayIso ? 'day' : 'slot'
  const panelEvents = selectedDayIso ? dayPanelEvents : slotEvents

  const handleSlotSelect = useCallback((slot: SelectedSlot | null) => {
    setSelectedSlot(slot)
    if (slot) setSelectedDayIso(null)
  }, [])

  const handleDaySelect = useCallback((iso: string | null) => {
    setSelectedDayIso(iso)
    if (iso) setSelectedSlot(null)
  }, [])

  // Drag-and-drop reschedule: move an event to a new date + time.
  const handleEventMove = useCallback(
    (eventId: string, dateISO: string, time: string) => {
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, dateISO, time } : e))
      )
      toast.success('Appointment rescheduled')
    },
    []
  )

  const handleCreateAt = useCallback((dateISO: string, time: string) => {
    setCreateState({ dateISO, time })
  }, [])

  const openFloatingCreate = useCallback(() => {
    const dateISO = days[0]?.date ?? todayISOString()
    setCreateState({ dateISO, time: '9:00 AM' })
  }, [days])

  const handleCreate = useCallback(
    (item: NewScheduleItem) => {
      if (!createState) return
      const newEvent: ClinicCalendarEvent = {
        id: `NEW-${Date.now()}`,
        dayIndex: 0,
        time: createState.time,
        dateISO: createState.dateISO,
        category: item.category,
        taskTitle: item.taskTitle,
        patientName: item.patientName,
        staffName: item.staffName,
      }
      setEvents((prev) => [...prev, newEvent])
      toast.success('Schedule item added')
    },
    [createState]
  )

  const handlePatientCancelFromCalendar = useCallback(
    (ev: ClinicCalendarEvent) => {
      const doctor = ev.staffName?.trim() ?? ''
      const hadQueue = doctor ? !!firstWaitlistPatientForDoctor(waitingListEntries, doctor) : false
      dispatch(
        patientCalendarCancelled({
          eventId: ev.id,
          dateISO: ev.dateISO,
          time: ev.time,
          staffName: ev.staffName,
        })
      )
      if (doctor && hadQueue) {
        toast.success(
          'Waitlist: an earlier-slot message was sent to the first patient in queue (demo).'
        )
      } else if (doctor) {
        toast.message('No waitlisted patients for this doctor.')
      }
      setSelectedSlot(null)
      setSelectedDayIso(null)
    },
    [dispatch, waitingListEntries]
  )

  // If the picked slot becomes empty (e.g. its only event was moved away), close the panel.
  useEffect(() => {
    if (selectedSlot && slotEvents.length === 0) {
      setSelectedSlot(null)
    }
  }, [selectedSlot, slotEvents.length])

  const selectedSlotDay = selectedSlot ? days[selectedSlot.dayIndex] : null
  const slotDayLabel = selectedSlotDay
    ? `${selectedSlotDay.label} ${selectedSlotDay.dayNumber.toString().padStart(2, '0')}`
    : undefined

  const createDateLabel = useMemo(() => {
    if (!createState) return undefined
    const d = new Date(createState.dateISO + 'T12:00:00')
    if (Number.isNaN(d.getTime())) return undefined
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }, [createState])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-[calc(100vh-6rem)] min-h-[560px] w-full flex-col gap-4 xl:flex-row"
    >
      <Card className="flex min-h-0 min-w-0 flex-1 flex-col rounded-2xl border border-border bg-card shadow-sm">
        <CardContent className="flex min-h-0 flex-1 flex-col p-3 sm:p-4">
          <CalendarView
            events={eventsInWindow}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            interval={intervalMinutes}
            onIntervalChange={setIntervalMinutes}
            selectedSlot={selectedSlot}
            onSlotSelect={handleSlotSelect}
            selectedDayIso={selectedDayIso}
            onDaySelect={handleDaySelect}
            onCreateAt={handleCreateAt}
            onEventMove={handleEventMove}
          />
        </CardContent>
      </Card>

      <div className="h-[420px] shrink-0 xl:h-auto xl:w-[360px]">
        <EventDetailsPanel
          variant={panelVariant}
          events={panelEvents}
          slotLabel={selectedSlot?.time}
          dayLabel={slotDayLabel}
          daySummaryTitle={daySummaryTitle}
          onPatientCancel={handlePatientCancelFromCalendar}
          onClose={() => {
            setSelectedSlot(null)
            setSelectedDayIso(null)
          }}
        />
      </div>

      {/* Floating quick-create — fallback to clicking an empty slot. */}
      <button
        type="button"
        onClick={openFloatingCreate}
        aria-label="Add schedule item"
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-white shadow-lg transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Plus className="h-6 w-6" />
      </button>

      <CreateScheduleItemDialog
        open={createState !== null}
        dateLabel={createDateLabel}
        time={createState?.time}
        onClose={() => setCreateState(null)}
        onCreate={handleCreate}
      />
    </motion.div>
  )
}

export default Calender
