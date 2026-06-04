import { format, parseISO } from 'date-fns'

export function formatWaitingListAppointment(dateIso: string): string {
  const d = parseISO(dateIso)
  const datePart = format(d, 'd MMM yyyy')
  const timePart = format(d, 'h:mm a').toLowerCase()
  return `${datePart}, ${timePart}`
}

export function appointmentMonthKey(dateIso: string): string {
  return format(parseISO(dateIso), 'yyyy-MM')
}

/** Short date (e.g. "5 Jun 2026") for DOB / date-added / preferred-date columns. */
export function formatWaitlistDate(dateIso: string | null | undefined): string {
  if (!dateIso) return '—'
  const d = parseISO(dateIso)
  if (Number.isNaN(d.getTime())) return '—'
  return format(d, 'd MMM yyyy')
}

export function statusLabel(
  status: 'waiting' | 'contacted' | 'booked' | 'cancelled' | 'declined'
): string {
  switch (status) {
    case 'waiting':
      return 'Waiting'
    case 'contacted':
      return 'Contacted'
    case 'booked':
      return 'Booked'
    case 'cancelled':
      return 'Cancelled'
    case 'declined':
      return 'Declined'
    default:
      return status
  }
}

export function listRoleLabel(role: 'booked' | 'waitlist'): string {
  return role === 'waitlist' ? 'Waitlist' : 'Booked'
}
