export type WaitingListStatus = 'completed' | 'pending' | 'cancelled'

export interface WaitingListEntry {
  id: string
  /** Display ref e.g. 265853 → shown as #265853 */
  serialNo: string
  service: string
  patientName: string
  patientId: string
  contactNo: string
  doctor: string
  appointmentAt: string
  roomNo: string
  price: number
  status: WaitingListStatus
}
