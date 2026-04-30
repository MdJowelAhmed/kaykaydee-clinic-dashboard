import { format, parseISO } from 'date-fns'
import type { ClientListEntry } from './types'

/** e.g. `PID265800` from list row */
export function clientPatientIdRef(entry: ClientListEntry): string {
  return `PID${entry.idNo}`
}

/** e.g. `25 jan, 2000` to match profile mocks */
export function formatClientDobDisplay(iso: string | undefined): string {
  if (!iso) return '—'
  try {
    const d = parseISO(iso.length <= 10 ? `${iso}T12:00:00` : iso)
    const day = format(d, 'd')
    const mon = format(d, 'MMM').toLowerCase()
    const yr = format(d, 'yyyy')
    return `${day} ${mon}, ${yr}`
  } catch {
    return '—'
  }
}

/** e.g. `2,jan 2026` to match the reference mock */
export function formatClientJoinDate(iso: string): string {
  const d = parseISO(iso)
  const day = format(d, 'd')
  const mon = format(d, 'MMM').toLowerCase()
  const yr = format(d, 'yyyy')
  return `${day},${mon} ${yr}`
}

export function clientJoinMonthKey(iso: string): string {
  return format(parseISO(iso), 'yyyy-MM')
}
