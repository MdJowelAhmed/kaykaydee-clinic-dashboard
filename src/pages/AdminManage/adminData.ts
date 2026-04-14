import type { AdminRow } from './types'

const CLINICS = [
  'Alex Sadman',
  'Zoya Clinic',
  'Bright Smile Dental',
  'Harbor Wellness',
  'Northside Physio',
  'City Care Center',
  'GreenLeaf Medical',
]

function makeAdmin(i: number): AdminRow {
  const day = 1 + (i % 28)
  const month = 1 + (i % 12)
  const year = 2025 + (i % 2)
  const join = new Date(year, month - 1, day).toISOString()

  return {
    id: String(23598 + i),
    clinicName: CLINICS[i % CLINICS.length],
    joinDate: join,
    role: i % 9 === 0 ? 'head-admin' : 'admin',
    status: i % 7 === 0 ? 'inactive' : 'active',
    email: `admin${i + 1}@demo.mail`,
    phone: `+61 ${2000 + (i % 7999)} ${1000 + (i % 8999)}`,
  }
}

export const mockAdmins: AdminRow[] = Array.from({ length: 150 }, (_, i) => makeAdmin(i))

