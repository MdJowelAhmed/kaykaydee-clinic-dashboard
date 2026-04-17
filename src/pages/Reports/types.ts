export type ReportStatus = 'completed' | 'in_queue' | 'assigned'

export interface ReportEntry {
  id: string
  /** Display ref e.g. 265853 shown as #265853 */
  reportNo: string
  service: string
  patientName: string
  patientId: string
  contactNo: string
  reportBy: string
  /** Labeled "ID no" in the table */
  internalDocId: string
  issueDate: string
  dateline: string
  price: number
  status: ReportStatus
}
