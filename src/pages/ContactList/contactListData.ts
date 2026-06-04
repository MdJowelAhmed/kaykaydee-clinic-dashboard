import type { ContactEntry } from './types'

/** Allowed contact types for the General Details section. */
export const CONTACT_TYPE_OPTIONS = [
  'Support Coordinator',
  'Plan Manager',
  'Nominee',
  'Family Member',
  'Provider',
  'GP',
  'Specialist',
  'Other',
] as const

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

const TITLES = ['Mr', 'Ms', 'Dr', 'Mrs', '']
const OCCUPATIONS = ['Physiotherapist', 'Coordinator', 'Nurse', 'Administrator', '']
const COMPANIES = ['Sub Point', 'Care Plus', 'Wellness Point', 'City Hub']

const ADDRESSES = [
  '284 Daffodil Dr',
  '2972 Westheimer Rd',
  '4140 Parker Rd',
]
const CITIES = ['Mount Frere', 'Santa Ana', 'Allentown']
const STATES = ['Eastern Cape', 'Illinois', 'New Mexico']
const POSTCODES = ['5088', '85486', '31134']
const COUNTRIES = ['South Africa', 'United States', 'United States']

function emailFromName(name: string, index: number): string {
  const slug = name.toLowerCase().replace(/\s+/g, '')
  return `${slug}${index % 100}@gmail.com`
}

function buildRow(index: number): ContactEntry {
  return {
    id: `ct-${index + 1}`,
    idNo: String(646 + index),
    name: NAMES[index % NAMES.length],
    type: CONTACT_TYPE_OPTIONS[index % CONTACT_TYPE_OPTIONS.length],
    title: TITLES[index % TITLES.length] || undefined,
    occupation: OCCUPATIONS[index % OCCUPATIONS.length] || undefined,
    company: COMPANIES[index % COMPANIES.length],
    email: emailFromName(NAMES[index % NAMES.length], index),
    mobile: `+9931654${String(1000 + (index % 9000)).padStart(4, '0')}`,
    workPhone: index % 3 === 0 ? `+9931200${String(1000 + (index % 9000)).padStart(4, '0')}` : undefined,
    address: ADDRESSES[index % ADDRESSES.length],
    city: CITIES[index % CITIES.length],
    state: STATES[index % STATES.length],
    postcode: POSTCODES[index % POSTCODES.length],
    country: COUNTRIES[index % COUNTRIES.length],
    status: 'active',
  }
}

export const INITIAL_CONTACT_LIST: ContactEntry[] = Array.from({ length: 150 }, (_, i) =>
  buildRow(i)
)

export function getTypeOptionsFromEntries(entries: ContactEntry[]) {
  const uniq = [...new Set(entries.map((e) => e.type).filter(Boolean) as string[])].sort()
  return [{ value: 'all', label: 'Type' }, ...uniq.map((t) => ({ value: t, label: t }))]
}

export function getCompanyOptionsFromEntries(entries: ContactEntry[]) {
  const uniq = [...new Set(entries.map((e) => e.company).filter(Boolean) as string[])].sort()
  return [{ value: 'all', label: 'Company' }, ...uniq.map((c) => ({ value: c, label: c }))]
}
