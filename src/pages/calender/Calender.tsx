import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import CalendarView, { type SelectedSlot } from './components/CalendarView'
import EventDetailsPanel from './components/EventDetailsPanel'
import {
  resolveClinicCalendarEvents,
  CATEGORY_FILTER_OPTIONS,
  type ClinicEventCategory,
} from './clinicCalendarData'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { goToToday, setSelectedDate } from '@/redux/slices/calendarSlice'
import { cn } from '@/utils/cn'
import { AddAppointmentModal } from '@/pages/WaitingList/components/AddAppointmentModal'
import {
  INITIAL_WAITING_LIST,
  getDoctorOptionsFromEntries,
  getServiceOptionsFromEntries,
} from '@/pages/WaitingList/waitingListData'
import type { WaitingListEntry } from '@/pages/WaitingList/types'

const Calender: React.FC = () => {
  const [category, setCategory] = useState<ClinicEventCategory | 'all'>('all')
  const [searchValue, setSearchValue] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null)
  const [addAppointmentOpen, setAddAppointmentOpen] = useState(false)
  const [waitingListEntries, setWaitingListEntries] =
    useState<WaitingListEntry[]>(INITIAL_WAITING_LIST)
  const dispatch = useAppDispatch()
  const { days, selectedDate, viewRange } = useAppSelector((state) => state.calendar)

  const todayISO = new Date().toISOString().split('T')[0]

  const [selectedDayIso, setSelectedDayIso] = useState<string | null>(null)

  useEffect(() => {
    if (viewRange === 15 || viewRange === 30) {
      setSelectedSlot(null)
    } else {
      setSelectedDayIso(null)
    }
  }, [viewRange])

  const visibleDateSet = useMemo(() => new Set(days.map((d) => d.date)), [days])

  useEffect(() => {
    if (selectedDayIso && !visibleDateSet.has(selectedDayIso)) {
      setSelectedDayIso(null)
    }
  }, [visibleDateSet, selectedDayIso])

  const anchorDay = days[0]?.date ?? todayISO

  const resolvedEvents = useMemo(
    () => resolveClinicCalendarEvents(anchorDay),
    [anchorDay]
  )

  const eventsInWindow = useMemo(
    () => resolvedEvents.filter((e) => visibleDateSet.has(e.dateISO)),
    [resolvedEvents, visibleDateSet]
  )

  const serviceOptions = useMemo(
    () => getServiceOptionsFromEntries(waitingListEntries),
    [waitingListEntries]
  )
  const doctorOptions = useMemo(
    () => getDoctorOptionsFromEntries(waitingListEntries),
    [waitingListEntries]
  )

  const calendarEvents = useMemo(() => {
    if (category === 'all') return eventsInWindow
    return eventsInWindow.filter((e) => e.category === category)
  }, [eventsInWindow, category])

  const slotEvents = useMemo(() => {
    if (!selectedSlot) return []
    const slotDay = days[selectedSlot.dayIndex]
    if (!slotDay) return []
    return calendarEvents.filter(
      (e) => e.dateISO === slotDay.date && e.time === selectedSlot.time
    )
  }, [calendarEvents, selectedSlot, days])

  const daySummaryTitle = useMemo(() => {
    if (!selectedDayIso) return undefined
    const d = days.find((x) => x.date === selectedDayIso)
    if (!d) return undefined
    return `${d.label} ${String(d.dayNumber).padStart(2, '0')}`
  }, [selectedDayIso, days])

  const dayPanelEvents = useMemo(() => {
    if (!selectedDayIso) return []
    return calendarEvents.filter((e) => e.dateISO === selectedDayIso)
  }, [selectedDayIso, calendarEvents])

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

  // If active filters/search remove every event in the picked slot, close the panel.
  useEffect(() => {
    if (selectedSlot && slotEvents.length === 0) {
      setSelectedSlot(null)
    }
  }, [selectedSlot, slotEvents.length])

  const selectedSlotDay = selectedSlot ? days[selectedSlot.dayIndex] : null
  const slotDayLabel = selectedSlotDay
    ? `${selectedSlotDay.label} ${selectedSlotDay.dayNumber.toString().padStart(2, '0')}`
    : undefined

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-accent">Clinic schedule</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Hospital and clinic operations at a glance: patient appointments, diagnostics, procedures,
          and supporting tasks—each block includes a short summary for your team.
        </p>
      </div>

      {/* <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Card className={cn('rounded-2xl border shadow-sm', card.className)}>
                <CardContent className="flex items-start gap-3 p-5">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/80 shadow-sm',
                      card.iconClass
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-600">{card.title}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{card.value}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{card.hint}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div> */}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-6">
        <Card className="min-w-0 rounded-2xl border border-border bg-card shadow-sm">
          <CardContent className="space-y-4 p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-accent">Schedule grid</h2>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
                <Button
                  type="button"
                  className="h-10 shrink-0 rounded-xl bg-primary px-4 text-primary-foreground hover:bg-primary/90"
                  onClick={() => setAddAppointmentOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add appointment
                </Button>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => dispatch(goToToday())}
                    className={cn(
                      'h-9 rounded-full border px-3 text-xs font-semibold transition-colors',
                      selectedDate === todayISO
                        ? 'border-primary/30 bg-primary/10 text-primary'
                        : 'border-border bg-background text-accent hover:bg-muted/30'
                    )}
                  >
                    Today
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-muted-foreground">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={todayISO}
                    onChange={(e) => dispatch(setSelectedDate(e.target.value))}
                    className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-accent outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="w-full sm:w-[220px]">
                  <Select
                    value={category}
                    onValueChange={(v) => setCategory(v as ClinicEventCategory | 'all')}
                  >
                    <SelectTrigger className="h-10 rounded-xl border-border bg-background text-accent">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_FILTER_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <CalendarView
              events={calendarEvents}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              selectedSlot={selectedSlot}
              onSlotSelect={handleSlotSelect}
              selectedDayIso={selectedDayIso}
              onDaySelect={handleDaySelect}
            />
          </CardContent>
        </Card>

        <div className="h-[640px] xl:sticky xl:top-4 xl:h-[calc(100vh-6rem)]">
          <EventDetailsPanel
            variant={panelVariant}
            events={panelEvents}
            slotLabel={selectedSlot?.time}
            dayLabel={slotDayLabel}
            daySummaryTitle={daySummaryTitle}
            onClose={() => {
              setSelectedSlot(null)
              setSelectedDayIso(null)
            }}
          />
        </div>
      </div>

      <AddAppointmentModal
        open={addAppointmentOpen}
        onClose={() => setAddAppointmentOpen(false)}
        serviceOptions={serviceOptions}
        doctorOptions={doctorOptions}
        existingEntries={waitingListEntries}
        onCreated={(entry) => setWaitingListEntries((prev) => [entry, ...prev])}
      />
    </motion.div>
  )
}

export default Calender
