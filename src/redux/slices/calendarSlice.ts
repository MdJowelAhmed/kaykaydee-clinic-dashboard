import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CalendarDay, CalendarViewRange } from '@/types'

interface CalendarState {
  viewRange: CalendarViewRange
  /** First visible day (ISO). Forward navigation only; never before today for new ranges. */
  startDate: string
  days: CalendarDay[]
  /** ISO date string the user selected (defaults to today). */
  selectedDate: string
  /** Selected time-row label (e.g. "8:00 AM"). Empty means none. */
  selectedTime: string
}

const toISODate = (date: Date) => date.toISOString().split('T')[0]

const generateDays = (start: Date, totalDays: number): CalendarDay[] => {
  const days: CalendarDay[] = []
  const current = new Date(start)

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(current)
    const label = date.toLocaleDateString(undefined, { weekday: 'short' })
    const dayNumber = date.getDate()

    days.push({
      date: toISODate(date),
      label,
      dayNumber,
    })

    current.setDate(current.getDate() + 1)
  }

  return days
}

const buildInitialState = (): CalendarState => {
  const today = new Date()
  const startDate = toISODate(today)

  return {
    viewRange: 7,
    startDate,
    days: generateDays(today, 7),
    selectedDate: startDate,
    selectedTime: '',
  }
}

const recalculateDays = (state: CalendarState) => {
  const base = new Date(state.startDate + 'T12:00:00')
  if (Number.isNaN(base.getTime())) {
    const t = new Date()
    state.startDate = toISODate(t)
    state.days = generateDays(t, state.viewRange)
  } else {
    state.days = generateDays(base, state.viewRange)
  }

  const selectedInWindow = state.days.some((d) => d.date === state.selectedDate)
  if (!selectedInWindow) {
    state.selectedDate = state.startDate
  }
}

const initialState: CalendarState = buildInitialState()

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setViewRange: (state, action: PayloadAction<CalendarViewRange>) => {
      state.viewRange = action.payload
      state.startDate = toISODate(new Date())
      recalculateDays(state)
    },
    advanceScheduleWindow: (state) => {
      const d = new Date(state.startDate + 'T12:00:00')
      d.setDate(d.getDate() + state.viewRange)
      state.startDate = toISODate(d)
      recalculateDays(state)
    },
    retreatScheduleWindow: (state) => {
      const todayISO = toISODate(new Date())
      const d = new Date(state.startDate + 'T12:00:00')
      d.setDate(d.getDate() - state.viewRange)
      const nextStart = toISODate(d)
      state.startDate = nextStart < todayISO ? todayISO : nextStart
      recalculateDays(state)
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      if (!action.payload) {
        state.selectedDate = ''
        return
      }
      const todayISO = toISODate(new Date())
      const chosen = action.payload < todayISO ? todayISO : action.payload
      state.selectedDate = chosen
      const selectedInWindow = state.days.some((d) => d.date === state.selectedDate)
      if (!selectedInWindow) {
        const base = new Date(state.selectedDate + 'T12:00:00')
        if (!Number.isNaN(base.getTime())) {
          state.startDate = toISODate(base)
          state.days = generateDays(base, state.viewRange)
        }
      }
    },
    setSelectedTime: (state, action: PayloadAction<string>) => {
      state.selectedTime = action.payload
    },
    goToToday: (state) => {
      const t = new Date()
      state.startDate = toISODate(t)
      state.days = generateDays(t, state.viewRange)
      state.selectedDate = state.startDate
      state.selectedTime = ''
    },
  },
})

export const {
  setViewRange,
  advanceScheduleWindow,
  retreatScheduleWindow,
  setSelectedDate,
  setSelectedTime,
  goToToday,
} = calendarSlice.actions

export default calendarSlice.reducer


