import type { WaitingListEntry, WaitingListStatus } from './types'

const SERVICES = ['MSK', 'Cardiology', 'Dental', 'Physiotherapy', 'General']

const PRACTITIONERS = [
  'Dr. Rahman',
  'Dr. Alam',
  'Dr. Chowdhury',
  'Dr. Sen',
  'Dr. Hoque',
  'Dr. APJ Kalam',
  'Dr. Sarah Smith',
]

/** Appointment types created by clinics. */
export const APPOINTMENT_TYPES = [
  'Initial Assessment',
  'Follow-Up',
  'NDIS Review',
  'Hydrotherapy',
  'Telehealth',
  'Other',
] as const

/** "Any Practitioner" lets clients who are happy to see anyone be matched flexibly. */
export const ANY_PRACTITIONER = 'Any Practitioner'

const CLIENT_NAMES = [
  'Ayesha Khan',
  'Rafiq Hossain',
  'Nusrat Jahan',
  'Daniel Carter',
  'Maria Garcia',
  'Liam Walker',
  'Sofia Rossi',
  'Noah Bennett',
]

const ADDRESSES = [
  '12 Oxford St, Bondi NSW 2026',
  '88 King William Rd, Adelaide SA 5000',
  '5 Collins St, Melbourne VIC 3000',
  '210 George St, Sydney NSW 2000',
  '47 Queen St, Brisbane QLD 4000',
  '9 Hay St, Perth WA 6000',
]

const STATUSES: WaitingListStatus[] = ['waiting', 'contacted', 'booked']

function isoDate(year: number, month: number, day: number, hour = 9, minute = 0): string {
  return new Date(year, month, day, hour, minute).toISOString()
}

/** Demo waitlist clients aligned with calendar `staffName` so cancel → notify works. */
const DEMO_WAITLIST: WaitingListEntry[] = [
  {
    id: 'wl-demo-q1',
    serialNo: '900001',
    patientName: 'Ayesha Khan',
    dob: isoDate(1989, 2, 14),
    address: '12 Oxford St, Bondi NSW 2026',
    contactNo: '+8801711000001',
    doctor: 'Dr. Rahman',
    appointmentType: 'Initial Assessment',
    dateAddedAt: isoDate(2026, 4, 1, 9, 0),
    preferredAppointmentDate: isoDate(2026, 9, 1, 10, 0),
    status: 'waiting',
    listRole: 'waitlist',
    waitlistJoinedAt: isoDate(2026, 4, 1, 9, 0),
    slotOffer: null,
    appointmentAt: isoDate(2026, 9, 1, 10, 0),
    service: 'Cardiology',
    patientId: 'cl-demo-1',
    roomNo: 'Rm TBD',
    price: 600,
  },
  {
    id: 'wl-demo-q2',
    serialNo: '900002',
    patientName: 'Rafiq Hossain',
    dob: isoDate(1975, 6, 30),
    address: '210 George St, Sydney NSW 2000',
    contactNo: '+8801711000002',
    doctor: 'Dr. Rahman',
    appointmentType: 'Follow-Up',
    dateAddedAt: isoDate(2026, 4, 2, 11, 30),
    preferredAppointmentDate: null,
    status: 'waiting',
    listRole: 'waitlist',
    waitlistJoinedAt: isoDate(2026, 4, 2, 11, 30),
    slotOffer: null,
    appointmentAt: isoDate(2026, 9, 5, 14, 0),
    service: 'General',
    patientId: 'cl-demo-2',
    roomNo: 'Rm TBD',
    price: 400,
  },
  {
    id: 'wl-demo-q3',
    serialNo: '900003',
    patientName: 'Nusrat Jahan',
    dob: isoDate(1998, 10, 5),
    address: '5 Collins St, Melbourne VIC 3000',
    contactNo: '+8801711000003',
    doctor: 'Dr. Alam',
    appointmentType: 'NDIS Review',
    dateAddedAt: isoDate(2026, 4, 3, 8, 0),
    preferredAppointmentDate: isoDate(2026, 8, 20, 9, 0),
    status: 'contacted',
    listRole: 'waitlist',
    waitlistJoinedAt: isoDate(2026, 4, 3, 8, 0),
    slotOffer: null,
    appointmentAt: isoDate(2026, 8, 20, 9, 0),
    service: 'Follow-up',
    patientId: 'cl-demo-3',
    roomNo: 'Rm TBD',
    price: 350,
  },
]

function buildRow(index: number): WaitingListEntry {
  const day = 1 + (index % 28)
  const hour = 9 + (index % 12)
  const minute = (index % 2) * 30
  const month = index % 3
  const appointmentAt = isoDate(2026, month, day, hour, minute)

  // ~1 in 4 clients are happy to see any available clinician.
  const practitioner = index % 4 === 0 ? ANY_PRACTITIONER : PRACTITIONERS[index % PRACTITIONERS.length]
  // ~1 in 3 has no specific preferred date.
  const preferred = index % 3 === 0 ? null : appointmentAt

  return {
    id: `wl-${index + 1}`,
    serialNo: String(265800 + index),
    patientName: CLIENT_NAMES[index % CLIENT_NAMES.length],
    dob: isoDate(1965 + (index % 45), index % 12, 1 + (index % 27)),
    address: ADDRESSES[index % ADDRESSES.length],
    contactNo: `+9965416${String(5654 + (index % 10000)).padStart(4, '0').slice(-4)}`,
    doctor: practitioner,
    appointmentType: APPOINTMENT_TYPES[index % APPOINTMENT_TYPES.length],
    dateAddedAt: isoDate(2026, (index % 3), 1 + (index % 27)),
    preferredAppointmentDate: preferred,
    status: STATUSES[index % STATUSES.length],
    listRole: 'booked',
    waitlistJoinedAt: null,
    slotOffer: null,
    appointmentAt,
    service: SERVICES[index % SERVICES.length],
    patientId: String(256800 + index),
    roomNo: `f${(index % 5) + 1}2 ${1200 + index}`,
    price: 200 + (index % 5) * 100,
  }
}

const generated: WaitingListEntry[] = Array.from({ length: 150 }, (_, i) => buildRow(i))

/** Deterministic mock list for pagination + waitlist demos */
export const INITIAL_WAITING_LIST: WaitingListEntry[] = [...DEMO_WAITLIST, ...generated]

export const WAITING_LIST_STATUS_OPTIONS = [
  { value: 'all', label: 'Status' },
  { value: 'waiting', label: 'Waiting' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'booked', label: 'Booked' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'declined', label: 'Declined' },
]

export const WAITING_LIST_APPT_TYPE_OPTIONS = [
  { value: 'all', label: 'Appointment type' },
  ...APPOINTMENT_TYPES.map((t) => ({ value: t, label: t })),
]

/** Preferred practitioner choices for the add form (includes "Any Practitioner"). */
export const PREFERRED_PRACTITIONER_OPTIONS = [
  { value: ANY_PRACTITIONER, label: ANY_PRACTITIONER },
  ...PRACTITIONERS.map((d) => ({ value: d, label: d })),
]

export function getDoctorOptionsFromEntries(entries: WaitingListEntry[]) {
  const uniq = [...new Set(entries.map((e) => e.doctor))].sort()
  return [{ value: 'all', label: 'Practitioner' }, ...uniq.map((d) => ({ value: d, label: d }))]
}

export function getServiceOptionsFromEntries(entries: WaitingListEntry[]) {
  const uniq = [...new Set(entries.map((e) => e.service))].sort()
  return [{ value: 'all', label: 'Service' }, ...uniq.map((s) => ({ value: s, label: s }))]
}
