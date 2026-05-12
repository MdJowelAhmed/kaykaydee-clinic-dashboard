export type WaitingListStatus = 'completed' | 'pending' | 'cancelled'

/** Booked = normal queue row; waitlist = no new-patient slot within ~90 days for this doctor. */
export type WaitingListRole = 'booked' | 'waitlist'

export type SlotOfferState = 'pending' | 'accepted' | 'declined'

export interface WaitingListSlotOffer {
  /** Freed slot (ISO) offered to move the patient earlier. */
  offeredSlotAt: string
  state: SlotOfferState
}

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
  listRole: WaitingListRole
  /** When the patient joined the doctor waitlist (ISO). Null when not waitlisted. */
  waitlistJoinedAt: string | null
  /** Earlier-slot notification / response (demo SMS-style flow). */
  slotOffer: WaitingListSlotOffer | null
}
