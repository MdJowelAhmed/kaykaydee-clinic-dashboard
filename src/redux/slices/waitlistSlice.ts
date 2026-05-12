import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { WaitingListEntry, WaitingListStatus } from '@/pages/WaitingList/types'
import { INITIAL_WAITING_LIST } from '@/pages/WaitingList/waitingListData'
import {
  acceptEarlierSlot,
  cancellationCompositeKey,
  combineDateAndTime12h,
  declineEarlierSlot,
  offerEarlierSlot,
} from '@/pages/WaitingList/waitlistFlow'

export interface WaitlistState {
  entries: WaitingListEntry[]
  /** Composite keys `${eventId}|${dateISO}` for patient-visible calendar blocks removed after cancel. */
  cancelledCalendarKeys: string[]
}

const initialState: WaitlistState = {
  entries: INITIAL_WAITING_LIST,
  cancelledCalendarKeys: [],
}

export type PatientCalendarCancelPayload = {
  eventId: string
  dateISO: string
  time: string
  staffName?: string
}

const waitlistSlice = createSlice({
  name: 'waitlist',
  initialState,
  reducers: {
    setWaitlistEntries: (state, action: PayloadAction<WaitingListEntry[]>) => {
      state.entries = action.payload
    },
    addWaitlistEntry: (state, action: PayloadAction<WaitingListEntry>) => {
      state.entries = [action.payload, ...state.entries]
    },
    updateWaitlistEntryStatus: (
      state,
      action: PayloadAction<{ id: string; status: WaitingListStatus }>
    ) => {
      const { id, status } = action.payload
      const idx = state.entries.findIndex((e) => e.id === id)
      if (idx === -1) return
      state.entries[idx] = { ...state.entries[idx], status }
    },
    patientCalendarCancelled: (state, action: PayloadAction<PatientCalendarCancelPayload>) => {
      const { eventId, dateISO, time, staffName } = action.payload
      const key = cancellationCompositeKey(eventId, dateISO)
      if (!state.cancelledCalendarKeys.includes(key)) {
        state.cancelledCalendarKeys.push(key)
      }
      const doctor = staffName?.trim()
      if (!doctor) return
      const offeredSlotAt = combineDateAndTime12h(dateISO, time)
      state.entries = offerEarlierSlot(state.entries, doctor, offeredSlotAt)
    },
    respondEarlierSlotOffer: (state, action: PayloadAction<{ entryId: string; accept: boolean }>) => {
      const { entryId, accept } = action.payload
      state.entries = accept
        ? acceptEarlierSlot(state.entries, entryId)
        : declineEarlierSlot(state.entries, entryId, new Date().toISOString())
    },
  },
})

export const {
  setWaitlistEntries,
  addWaitlistEntry,
  updateWaitlistEntryStatus,
  patientCalendarCancelled,
  respondEarlierSlotOffer,
} = waitlistSlice.actions

export const selectCancelledCalendarKeys = (state: { waitlist: WaitlistState }) =>
  state.waitlist.cancelledCalendarKeys

export const selectWaitlistEntries = (state: { waitlist: WaitlistState }) => state.waitlist.entries

export default waitlistSlice.reducer
