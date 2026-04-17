import type { ReportEntry, ReportStatus } from './types'

const SERVICES = ['MSK Report', 'Cardiology Report', 'Dental Report', 'General Report']
const REPORTERS = [
  'Dr. APJ Kalam',
  'Dr. Sarah Smith',
  'Dr. John Lee',
  'Dr. Maria Garcia',
]
const PATIENTS = [
  'Zoya Clinic',
  'Metro Care',
  'Wellness Point',
  'City Health Hub',
  'Riverdale Clinic',
]
const STATUSES: ReportStatus[] = ['completed', 'in_queue', 'assigned']

function buildRow(index: number): ReportEntry {
  const issueDay = 1 + (index % 20)
  const month = index % 3
  const issueDate = new Date(2026, month, issueDay, 12, 0).toISOString()
  const dateline = new Date(2026, month, issueDay + 8, 12, 0).toISOString()

  return {
    id: `rp-${index + 1}`,
    reportNo: String(265800 + index),
    service: SERVICES[index % SERVICES.length],
    patientName: PATIENTS[index % PATIENTS.length],
    patientId: String(256800 + index),
    contactNo: `+9965416${String(5654 + (index % 10000)).padStart(4, '0').slice(-4)}`,
    reportBy: REPORTERS[index % REPORTERS.length],
    internalDocId: String(6100 + (index % 200)),
    issueDate,
    dateline,
    price: 200 + (index % 5) * 100,
    status: STATUSES[index % STATUSES.length],
  }
}

export const INITIAL_REPORTS: ReportEntry[] = Array.from({ length: 150 }, (_, i) =>
  buildRow(i)
)

export const REPORT_STATUS_OPTIONS = [
  { value: 'all', label: 'Status' },
  { value: 'completed', label: 'Completed' },
  { value: 'in_queue', label: 'In Queue' },
  { value: 'assigned', label: 'Assigned' },
]

export const REPORT_DATE_OPTIONS = [
  { value: 'all', label: 'Date' },
  { value: '2026-01', label: 'January 2026' },
  { value: '2026-02', label: 'February 2026' },
  { value: '2026-03', label: 'March 2026' },
]

export function getServiceOptionsFromReports(entries: ReportEntry[]) {
  const uniq = [...new Set(entries.map((e) => e.service))].sort()
  return [{ value: 'all', label: 'Service' }, ...uniq.map((s) => ({ value: s, label: s }))]
}

export function getReportByOptionsFromReports(entries: ReportEntry[]) {
  const uniq = [...new Set(entries.map((e) => e.reportBy))].sort()
  return [{ value: 'all', label: 'Report By' }, ...uniq.map((r) => ({ value: r, label: r }))]
}
