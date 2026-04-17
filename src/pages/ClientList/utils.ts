import { format, parseISO } from 'date-fns'

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
