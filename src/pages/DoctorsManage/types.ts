export type DoctorStatus = 'active' | 'inactive'

export interface DoctorEntry {
  id: string
  clinicName: string
  joinDate: string // ISO
  branch: string
  designation: string
  status: DoctorStatus
}

