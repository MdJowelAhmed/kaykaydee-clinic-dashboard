import { parseISO } from 'date-fns'
import type { WaitingListEntry } from './types'

export function doctorNamesMatch(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}

export function cancellationCompositeKey(eventId: string, dateISO: string): string {
  return `${eventId}|${dateISO}`
}

export function combineDateAndTime12h(dateISO: string, time12h: string): string {
  const day = parseISO(`${dateISO.slice(0, 10)}T12:00:00`)
  const t = time12h.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!t) return day.toISOString()
  let h = parseInt(t[1], 10)
  const m = parseInt(t[2], 10)
  const ap = t[3].toUpperCase()
  if (ap === 'PM' && h !== 12) h += 12
  if (ap === 'AM' && h === 12) h = 0
  const out = new Date(day)
  out.setHours(h, m, 0, 0)
  return out.toISOString()
}

function queueEligible(e: WaitingListEntry): boolean {
  return e.listRole === 'waitlist' && e.status === 'pending' && !e.slotOffer
}

export function waitlistQueueForDoctor(entries: WaitingListEntry[], doctor: string): WaitingListEntry[] {
  return entries
    .filter((e) => queueEligible(e) && doctorNamesMatch(e.doctor, doctor))
    .sort((a, b) => {
      const ta = a.waitlistJoinedAt ? new Date(a.waitlistJoinedAt).getTime() : 0
      const tb = b.waitlistJoinedAt ? new Date(b.waitlistJoinedAt).getTime() : 0
      return ta - tb
    })
}

export function firstWaitlistPatientForDoctor(
  entries: WaitingListEntry[],
  doctor: string
): WaitingListEntry | undefined {
  return waitlistQueueForDoctor(entries, doctor)[0]
}

export function offerEarlierSlot(
  entries: WaitingListEntry[],
  doctor: string,
  offeredSlotAt: string,
  excludeEntryId?: string
): WaitingListEntry[] {
  const queue = waitlistQueueForDoctor(entries, doctor)
  const next = excludeEntryId
    ? queue.find((e) => e.id !== excludeEntryId)
    : queue[0]
  if (!next) return entries
  return entries.map((e) =>
    e.id === next.id ? { ...e, slotOffer: { offeredSlotAt, state: 'pending' as const } } : e
  )
}

export function acceptEarlierSlot(entries: WaitingListEntry[], entryId: string): WaitingListEntry[] {
  const entry = entries.find((e) => e.id === entryId)
  if (!entry?.slotOffer || entry.slotOffer.state !== 'pending') return entries
  const offered = entry.slotOffer.offeredSlotAt
  return entries.map((e) =>
    e.id === entryId
      ? {
          ...e,
          appointmentAt: offered,
          listRole: 'booked',
          waitlistJoinedAt: null,
          slotOffer: null,
          status: 'completed',
        }
      : e
  )
}

/** Calendar rows that represent a patient visit can be cancelled to free a slot for the waitlist. */
export function isPatientCancellableCalendarEvent(ev: {
  patientName?: string
  category: string
}): boolean {
  if (!ev.patientName?.trim() || ev.patientName.startsWith('—')) return false
  return ['consultation', 'follow_up', 'procedure', 'diagnostics'].includes(ev.category)
}

export function declineEarlierSlot(
  entries: WaitingListEntry[],
  entryId: string,
  requeueAtIso: string
): WaitingListEntry[] {
  const entry = entries.find((e) => e.id === entryId)
  if (!entry?.slotOffer || entry.slotOffer.state !== 'pending') return entries
  const { offeredSlotAt } = entry.slotOffer
  const doctor = entry.doctor
  const cleared = entries.map((e) =>
    e.id === entryId
      ? {
          ...e,
          slotOffer: null,
          waitlistJoinedAt: requeueAtIso,
        }
      : e
  )
  return offerEarlierSlot(cleared, doctor, offeredSlotAt, entryId)
}
