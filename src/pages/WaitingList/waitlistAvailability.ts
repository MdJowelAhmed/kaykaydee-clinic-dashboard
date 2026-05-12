import { addDays, format, parseISO } from 'date-fns'
import type { ClinicCalendarEvent } from '@/pages/calender/clinicCalendarData'
import { resolveClinicCalendarEvents } from '@/pages/calender/clinicCalendarData'

export const WAITLIST_WINDOW_DAYS = 90

/**
 * Demo threshold: many patient-facing bookings in 90 days ⇒ treat as "no openings"
 * for new appointments (patient goes on waitlist).
 */
export const FULL_BOOKING_THRESHOLD = 22

function doctorKey(s?: string) {
  return (s ?? '').trim().toLowerCase()
}

function isPatientFacing(ev: ClinicCalendarEvent): boolean {
  if (!ev.patientName?.trim() || ev.patientName.startsWith('—')) return false
  return ['consultation', 'follow_up', 'procedure', 'diagnostics'].includes(ev.category)
}

/** Pull resolved demo events across ~90 days by stepping the calendar anchor. */
export function collectResolvedEventsApproxWindow(
  fromDateIso: string,
  spanDays: number = WAITLIST_WINDOW_DAYS
): ClinicCalendarEvent[] {
  const out: ClinicCalendarEvent[] = []
  const base = fromDateIso.slice(0, 10)
  for (let chunk = 0; chunk < spanDays; chunk += 10) {
    const anchor = format(addDays(parseISO(`${base}T12:00:00`), chunk), 'yyyy-MM-dd')
    out.push(...resolveClinicCalendarEvents(anchor))
  }
  return out
}

export function countDoctorPatientBookingsInWindow(
  events: ClinicCalendarEvent[],
  doctorDisplayName: string,
  fromDateIso: string,
  windowDays: number
): number {
  const from = fromDateIso.slice(0, 10)
  const end = format(addDays(parseISO(`${from}T12:00:00`), windowDays), 'yyyy-MM-dd')
  const dk = doctorKey(doctorDisplayName)
  return events.filter(
    (ev) =>
      doctorKey(ev.staffName) === dk &&
      isPatientFacing(ev) &&
      ev.dateISO >= from &&
      ev.dateISO <= end
  ).length
}

export function shouldPlacePatientOnWaitlist(
  resolvedEvents: ClinicCalendarEvent[],
  doctorDisplayName: string,
  fromDateIso: string
): boolean {
  const evs =
    resolvedEvents.length > 0
      ? resolvedEvents
      : collectResolvedEventsApproxWindow(fromDateIso, WAITLIST_WINDOW_DAYS)
  return (
    countDoctorPatientBookingsInWindow(evs, doctorDisplayName, fromDateIso, WAITLIST_WINDOW_DAYS) >=
    FULL_BOOKING_THRESHOLD
  )
}
