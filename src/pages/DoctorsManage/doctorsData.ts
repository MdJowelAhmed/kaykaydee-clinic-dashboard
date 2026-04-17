import type { DoctorEntry, DoctorStatus } from './types'

const CLINICS = ['Alex Sadman', 'Zoya Clinic', 'Bright Smile Dental', 'Harbor Wellness']
const BRANCHES = ['Alex Sadman', 'Downtown', 'Northside', 'Riverdale']
const DESIGNATIONS = ['Physiotherapist', 'Dentist', 'Cardiologist', 'Radiologist', 'Therapist']

function makeDoctor(i: number): DoctorEntry {
  const day = 1 + (i % 28)
  const joinDate = new Date(2025, 0, day, 12, 0).toISOString()
  return {
    id: `dr-${i + 1}`,
    clinicName: CLINICS[i % CLINICS.length],
    joinDate,
    branch: BRANCHES[i % BRANCHES.length],
    designation: DESIGNATIONS[i % DESIGNATIONS.length],
    status: i % 9 === 0 ? 'inactive' : 'active',
  }
}

export const INITIAL_DOCTORS: DoctorEntry[] = Array.from({ length: 150 }, (_, i) => makeDoctor(i))

export const DOCTOR_STATUS_OPTIONS: { value: DoctorStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

