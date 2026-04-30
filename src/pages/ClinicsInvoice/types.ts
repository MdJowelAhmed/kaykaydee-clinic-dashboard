export type ClinicsInvoiceStatus = 'completed' | 'cancel' | 'processing'

export interface ClinicsInvoiceEntry {
  id: string
  /** Display ref e.g. 265853 → shown as #265853 */
  serialNo: string
  service: string
  patientName: string
  patientId: string
  contactNo: string
  doctor: string
  /** ISO date string */
  dateIso: string
  price: number
  due: number
  paid: number
  status: ClinicsInvoiceStatus
}

