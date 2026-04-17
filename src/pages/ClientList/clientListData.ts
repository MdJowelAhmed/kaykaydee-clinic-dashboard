import type { ClientListEntry } from './types'

const NAMES = [
  'Zoya Clinic',
  'Metro Care',
  'Wellness Point',
  'City Health Hub',
  'Riverdale Clinic',
  'Sunrise Medical',
  'Green Cross',
]

const ADDRESSES = [
  '2972 Westheimer Rd. Santa Ana, IL 85486',
  '4140 Parker Rd. Allentown, New Mexico 31134',
  '8502 Preston Rd. Inglewood, Maine 98380',
  '2464 Royal Ln. Mesa, New Jersey 45463',
  '3891 Ranchview Dr. Richardson, California 62639',
  '4517 Washington Ave. Manchester, Kentucky 39495',
]

function emailFromName(name: string, index: number): string {
  const slug = name.toLowerCase().replace(/\s+/g, '')
  return `${slug}${index % 100}@gmail.com`
}

function buildRow(index: number): ClientListEntry {
  const day = 1 + (index % 28)
  const month = index % 3
  const joinDate = new Date(2026, month, day, 12, 0).toISOString()

  return {
    id: `cl-${index + 1}`,
    idNo: String(265800 + index),
    patientName: NAMES[index % NAMES.length],
    contactNo: `+9965416${String(5654 + (index % 10000)).padStart(4, '0').slice(-4)}`,
    email: emailFromName(NAMES[index % NAMES.length], index),
    joinDate,
    address: ADDRESSES[index % ADDRESSES.length],
  }
}

export const INITIAL_CLIENT_LIST: ClientListEntry[] = Array.from({ length: 150 }, (_, i) =>
  buildRow(i)
)

export const CLIENT_LIST_DATE_OPTIONS = [
  { value: 'all', label: 'Date' },
  { value: '2026-01', label: 'January 2026' },
  { value: '2026-02', label: 'February 2026' },
  { value: '2026-03', label: 'March 2026' },
]
