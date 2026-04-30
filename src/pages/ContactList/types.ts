export type ContactStatus = 'active' | 'inactive'

export interface ContactEntry {
  id: string
  /** 6-digit style ref shown as PIDxxxx */
  idNo: string
  name: string
  type: string
  company: string
  email: string
  contactNo: string
  gender?: string
  address?: string
  status?: ContactStatus
}

