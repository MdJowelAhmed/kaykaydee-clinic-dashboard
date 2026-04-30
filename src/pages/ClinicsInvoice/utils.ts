import { format, parseISO } from 'date-fns'
import type { ClinicsInvoiceStatus } from './types'

export function formatInvoiceDate(iso: string): string {
  const d = parseISO(iso)
  const day = format(d, 'd')
  const mon = format(d, 'MMM').toLowerCase()
  const yr = format(d, 'yyyy')
  return `${day},${mon} ${yr}`
}

export function invoiceMonthKey(iso: string): string {
  return format(parseISO(iso), 'yyyy-MM')
}

export function invoiceStatusLabel(status: ClinicsInvoiceStatus): string {
  switch (status) {
    case 'completed':
      return 'Completed'
    case 'cancel':
      return 'Cancel'
    case 'processing':
      return 'Processing'
    default:
      return status
  }
}

