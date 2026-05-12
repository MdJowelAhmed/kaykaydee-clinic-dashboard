import type { WaitingListEntry, WaitingListRole, WaitingListStatus } from './types'

const SERVICES = ['MSK', 'Cardiology', 'Dental', 'Physiotherapy', 'General']
const DOCTORS = [
  'Dr. Rahman',
  'Dr. Alam',
  'Dr. Chowdhury',
  'Dr. Sen',
  'Dr. Hoque',
  'Dr. APJ Kalam',
  'Dr. Sarah Smith',
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

/** Demo waitlist patients aligned with calendar `staffName` so cancel → notify works. */
const DEMO_WAITLIST: WaitingListEntry[] = [
  {
    id: 'wl-demo-q1',
    serialNo: '900001',
    service: 'Cardiology',
    patientName: 'Ayesha Khan',
    patientId: 'cl-demo-1',
    contactNo: '+8801711000001',
    doctor: 'Dr. Rahman',
    appointmentAt: new Date(2026, 9, 1, 10, 0).toISOString(),
    roomNo: 'Rm TBD',
    price: 600,
    status: 'pending',
    listRole: 'waitlist',
    waitlistJoinedAt: new Date(2026, 4, 1, 9, 0).toISOString(),
    slotOffer: null,
  },
  {
    id: 'wl-demo-q2',
    serialNo: '900002',
    service: 'General',
    patientName: 'Rafiq Hossain',
    patientId: 'cl-demo-2',
    contactNo: '+8801711000002',
    doctor: 'Dr. Rahman',
    appointmentAt: new Date(2026, 9, 5, 14, 0).toISOString(),
    roomNo: 'Rm TBD',
    price: 400,
    status: 'pending',
    listRole: 'waitlist',
    waitlistJoinedAt: new Date(2026, 4, 2, 11, 30).toISOString(),
    slotOffer: null,
  },
  {
    id: 'wl-demo-q3',
    serialNo: '900003',
    service: 'Follow-up',
    patientName: 'Nusrat Jahan',
    patientId: 'cl-demo-3',
    contactNo: '+8801711000003',
    doctor: 'Dr. Alam',
    appointmentAt: new Date(2026, 8, 20, 9, 0).toISOString(),
    roomNo: 'Rm TBD',
    price: 350,
    status: 'pending',
    listRole: 'waitlist',
    waitlistJoinedAt: new Date(2026, 4, 3, 8, 0).toISOString(),
    slotOffer: null,
  },
]

function buildRow(index: number): WaitingListEntry {
  const day = 1 + (index % 28)
  const hour = 9 + (index % 12)
  const minute = (index % 2) * 30
  const month = index % 3
  const appointmentAt = new Date(2026, month, day, hour, minute).toISOString()

  const listRole: WaitingListRole = 'booked'

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
    listRole,
    waitlistJoinedAt: null,
    slotOffer: null,
  }
}

const generated: WaitingListEntry[] = Array.from({ length: 150 }, (_, i) => buildRow(i))

/** Deterministic mock list for pagination + waitlist demos */
export const INITIAL_WAITING_LIST: WaitingListEntry[] = [...DEMO_WAITLIST, ...generated]

export const WAITING_LIST_STATUS_OPTIONS = [
  { value: 'all', label: 'Status' },
  { value: 'completed', label: 'Confirmed' },
  { value: 'pending', label: 'Pending' },
  { value: 'cancelled', label: 'Cancel' },
]

export const WAITING_LIST_ROLE_OPTIONS = [
  { value: 'all', label: 'All types' },
  { value: 'booked', label: 'Booked' },
  { value: 'waitlist', label: 'Waitlist' },
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
