import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CalendarDay, CalendarPeriod, CalendarViewRange } from '@/types'

interface CalendarState {
  viewRange: CalendarViewRange
  period: CalendarPeriod
  startDate: string // ISO string for the first day in the range
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
    period: 'current',
    startDate,
    days: generateDays(today, 7),
    selectedDate: startDate,
    selectedTime: '',
  }
}

const recalculateDays = (state: CalendarState) => {
  const today = new Date()
  const baseDate = new Date(today)

  if (state.period === 'previous') {
    // Previous 30 days from today
    baseDate.setDate(baseDate.getDate() - 30)
  }

  state.startDate = toISODate(baseDate)
  state.days = generateDays(baseDate, state.viewRange)

  // Keep selected date inside the visible window; otherwise snap to the first day.
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
      // If user switches to anything other than 30 days, reset to current period
      if (action.payload !== 30 && state.period === 'previous') {
        state.period = 'current'
      }
      recalculateDays(state)
    },
    setPeriod: (state, action: PayloadAction<CalendarPeriod>) => {
      state.period = action.payload
      // Period only matters for 30 day view, force to 30
      if (action.payload === 'previous') {
        state.viewRange = 30
      }
      recalculateDays(state)
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload
      if (!action.payload) return
      // If the chosen date is outside the current window, shift the window to start there.
      const selectedInWindow = state.days.some((d) => d.date === state.selectedDate)
      if (!selectedInWindow) {
        const base = new Date(action.payload)
        if (!Number.isNaN(base.getTime())) {
          state.period = 'current'
          state.startDate = toISODate(base)
          state.days = generateDays(base, state.viewRange)
        }
      }
    },
    setSelectedTime: (state, action: PayloadAction<string>) => {
      state.selectedTime = action.payload
    },
    goToToday: (state) => {
      state.period = 'current'
      recalculateDays(state)
      state.selectedDate = state.startDate
      state.selectedTime = ''
    },
  },
})

export const { setViewRange, setPeriod, setSelectedDate, setSelectedTime, goToToday } =
  calendarSlice.actions

export default calendarSlice.reducer


