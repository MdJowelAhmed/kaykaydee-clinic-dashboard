export type AdminRole = 'head-admin' | 'admin'

export type AdminStatus = 'active' | 'inactive'

export interface AdminRow {
  id: string
  clinicName: string
  joinDate: string
  role: AdminRole
  status: AdminStatus
  email: string
  phone: string
}

