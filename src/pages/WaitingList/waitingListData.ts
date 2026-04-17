import type { WaitingListEntry, WaitingListStatus } from './types'

const SERVICES = ['MSK', 'Cardiology', 'Dental', 'Physiotherapy', 'General']
const DOCTORS = [
  'Dr. APJ Kalam',
  'Dr. Sarah Smith',
  'Dr. John Lee',
  'Dr. Maria Garcia',
  'Dr. James Wilson',
]
const PATIENT_NAMES = [
  'Zoya Clinic',
  'City Care Center',
  'Wellness Hub',
  'Metro Health',
  'Riverdale Medical',
  'Sunrise Clinic',
]
const STATUSES: WaitingListStatus[] = ['completed', 'pending', 'cancelled']

function buildRow(index: number): WaitingListEntry {
  const day = 1 + (index % 28)
  const hour = 9 + (index % 12)
  const minute = (index % 2) * 30
  const month = index % 3
  const appointmentAt = new Date(2026, month, day, hour, minute).toISOString()

  return {
    id: `wl-${index + 1}`,
    serialNo: String(265800 + index),
    service: SERVICES[index % SERVICES.length],
    patientName: PATIENT_NAMES[index % PATIENT_NAMES.length],
    patientId: String(256800 + index),
    contactNo: `+9965416${String(5654 + (index % 10000)).padStart(4, '0').slice(-4)}`,
    doctor: DOCTORS[index % DOCTORS.length],
    appointmentAt,
    roomNo: `f${(index % 5) + 1}2 ${1200 + index}`,
    price: 200 + (index % 5) * 100,
    status: STATUSES[index % STATUSES.length],
  }
}

/** Deterministic mock list (150 rows) for pagination demos */
export const INITIAL_WAITING_LIST: WaitingListEntry[] = Array.from({ length: 150 }, (_, i) =>
  buildRow(i)
)

export const WAITING_LIST_STATUS_OPTIONS = [
  { value: 'all', label: 'Status' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'cancelled', label: 'Cancel' },
]

/** Month keys aligned with appointment dates in mock data (2026-01 …) */
export const WAITING_LIST_DATE_OPTIONS = [
  { value: 'all', label: 'Date' },
  { value: '2026-01', label: 'January 2026' },
  { value: '2026-02', label: 'February 2026' },
  { value: '2026-03', label: 'March 2026' },
]

export function getDoctorOptionsFromEntries(entries: WaitingListEntry[]) {
  const uniq = [...new Set(entries.map((e) => e.doctor))].sort()
  return [{ value: 'all', label: 'Doctor' }, ...uniq.map((d) => ({ value: d, label: d }))]
}

export function getServiceOptionsFromEntries(entries: WaitingListEntry[]) {
  const uniq = [...new Set(entries.map((e) => e.service))].sort()
  return [{ value: 'all', label: 'Service' }, ...uniq.map((s) => ({ value: s, label: s }))]
}
