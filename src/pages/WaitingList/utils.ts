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

export function statusLabel(status: 'completed' | 'pending' | 'cancelled'): string {
  switch (status) {
    case 'completed':
      return 'Completed'
    case 'pending':
      return 'Pending'
    case 'cancelled':
      return 'Cancel'
    default:
      return status
  }
}
