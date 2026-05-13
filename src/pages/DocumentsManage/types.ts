export type DocumentRowStatus = 'active' | 'archived'

export interface DocumentRow {
  id: string
  fileName: string
  patientName: string
  patientId: string
  doctorName: string
  doctorId: string
  dateIso: string
  moderator: string
  status: DocumentRowStatus
}

export interface DocumentFormValues {
  fileName: string
  patientName: string
  patientId: string
  doctorName: string
  doctorId: string
  status: DocumentRowStatus
  uploadFile: File | null
}
