import type { ContactEntry } from './types'

const NAMES = [
  'Asad',
  'Nadir',
  'Asadujjaman Mahfuz',
  'Zoya Clinic',
  'Metro Care',
  'Wellness Hub',
  'Sarah Smith',
  'John Lee',
]

const TYPES = ['Ndis provider', 'provider', 'Therapist', 'Nurse', 'Doctor']
const COMPANIES = ['Sub Point', 'Care Plus', 'Wellness Point', 'City Hub']

const ADDRESSES = [
  '284 Daffodil Dr, Mount Frere, Eastern Cape -5088 South Africa',
  '2972 Westheimer Rd. Santa Ana, IL 85486',
  '4140 Parker Rd. Allentown, New Mexico 31134',
]

function emailFromName(name: string, index: number): string {
  const slug = name.toLowerCase().replace(/\s+/g, '')
  return `${slug}${index % 100}@gmail.com`
}

function buildRow(index: number): ContactEntry {
  return {
    id: `ct-${index + 1}`,
    idNo: String(646 + index),
    name: NAMES[index % NAMES.length],
    type: TYPES[index % TYPES.length],
    company: COMPANIES[index % COMPANIES.length],
    email: emailFromName(NAMES[index % NAMES.length], index),
    contactNo: `+9931654${String(1000 + (index % 9000)).padStart(4, '0')}`,
    gender: index % 2 === 0 ? 'Male' : 'Female',
    address: ADDRESSES[index % ADDRESSES.length],
    status: 'active',
  }
}

export const INITIAL_CONTACT_LIST: ContactEntry[] = Array.from({ length: 150 }, (_, i) =>
  buildRow(i)
)

export function getTypeOptionsFromEntries(entries: ContactEntry[]) {
  const uniq = [...new Set(entries.map((e) => e.type))].sort()
  return [{ value: 'all', label: 'Type' }, ...uniq.map((t) => ({ value: t, label: t }))]
}

export function getCompanyOptionsFromEntries(entries: ContactEntry[]) {
  const uniq = [...new Set(entries.map((e) => e.company))].sort()
  return [{ value: 'all', label: 'Company' }, ...uniq.map((c) => ({ value: c, label: c }))]
}

