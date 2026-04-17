import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import CalendarView from './components/CalendarView'
import {
  CLINIC_CALENDAR_EVENTS,
  CATEGORY_FILTER_OPTIONS,
  type ClinicEventCategory,
} from './clinicCalendarData'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setSelectedDate } from '@/redux/slices/calendarSlice'
import { cn } from '@/utils/cn'

const Calender: React.FC = () => {
  const [category, setCategory] = useState<ClinicEventCategory | 'all'>('all')
  const [searchValue, setSearchValue] = useState('')
  const dispatch = useAppDispatch()
  const { days, selectedDate } = useAppSelector((state) => state.calendar)

  const todayISO = new Date().toISOString().split('T')[0]
  const nextDayISO = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  })()

  const maxDay = days.length

  const eventsInWindow = useMemo(
    () => CLINIC_CALENDAR_EVENTS.filter((e) => e.dayIndex < maxDay),
    [maxDay]
  )

  const calendarEvents = useMemo(() => {
    if (category === 'all') return eventsInWindow
    return eventsInWindow.filter((e) => e.category === category)
  }, [eventsInWindow, category])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Clinic schedule</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
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

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="space-y-4 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Weekly grid</h2>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => dispatch(setSelectedDate(todayISO))}
                  className={cn(
                    'h-9 rounded-full border px-3 text-xs font-semibold transition-colors',
                    selectedDate === todayISO
                      ? 'border-violet-200 bg-violet-50 text-violet-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  )}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(setSelectedDate(nextDayISO))}
                  className={cn(
                    'h-9 rounded-full border px-3 text-xs font-semibold transition-colors',
                    selectedDate === nextDayISO
                      ? 'border-violet-200 bg-violet-50 text-violet-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  )}
                >
                  Next day
                </button>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-600">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => dispatch(setSelectedDate(e.target.value))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div className="w-full sm:w-[220px]">
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as ClinicEventCategory | 'all')}
                >
                  <SelectTrigger className="h-10 rounded-xl border-slate-200">
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
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default Calender
