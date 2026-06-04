export type ContactStatus = 'active' | 'inactive'

export interface ContactEntry {
  id: string
  /** 6-digit style ref shown as PIDxxxx */
  idNo: string
  /** Person name — the only mandatory field */
  name: string

  // General Details
  type?: string
  title?: string
  occupation?: string
  company?: string

  // Contact Details
  email?: string
  mobile?: string
  workPhone?: string
  secondaryPhone?: string

  // Address Details
  address?: string
  city?: string
  state?: string
  postcode?: string
  country?: string

  // Free-text notes (preferred contact method, best times to call,
  // relationship to participant, invoicing instructions, referral info, etc.)
  notes?: string

  status?: ContactStatus
}
