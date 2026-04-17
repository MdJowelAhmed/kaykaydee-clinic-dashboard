import { format, parseISO } from 'date-fns'
import type { ReportEntry } from './types'

/** e.g. `2, Jan 2026` */
export function formatReportDate(iso: string): string {
  return format(parseISO(iso), 'd, MMM yyyy')
}

export function reportIssueMonthKey(iso: string): string {
  return format(parseISO(iso), 'yyyy-MM')
}

export function statusLabel(status: ReportEntry['status']): string {
  switch (status) {
    case 'completed':
      return 'Completed'
    case 'in_queue':
      return 'In Queue'
    case 'assigned':
      return 'Assigned'
    default:
      return status
  }
}
