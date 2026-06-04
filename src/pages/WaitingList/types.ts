export type WaitingListStatus = 'waiting' | 'contacted' | 'booked' | 'cancelled' | 'declined'

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
  /** Client / patient name. */
  patientName: string
  /** Date of birth (ISO date). */
  dob: string
  /** Postal / home address. */
  address: string
  contactNo: string
  /** Preferred practitioner — may be "Any Practitioner". Held in `doctor` for the waitlist flow. */
  doctor: string
  /** Appointment type: Initial Assessment, Follow-Up, NDIS Review, Hydrotherapy, Telehealth, Other. */
  appointmentType: string
  /** When the client was added to the waitlist (ISO). */
  dateAddedAt: string
  /** Preferred appointment date (ISO) — optional. */
  preferredAppointmentDate: string | null
  status: WaitingListStatus
  listRole: WaitingListRole
  /** When the patient joined the doctor waitlist (ISO). Null when not waitlisted. */
  waitlistJoinedAt: string | null
  /** Earlier-slot notification / response (demo SMS-style flow). */
  slotOffer: WaitingListSlotOffer | null

  // ---- Internal / retained for the calendar-cancellation demo flow ----
  /** Concrete appointment slot (ISO) used by the earlier-slot offer flow. */
  appointmentAt: string
  /** Clinical service category (kept for the availability demo; not shown in the table). */
  service: string
  /** Patient reference id (kept internally; not shown in the table). */
  patientId: string
  /** Room (kept internally; not shown in the table). */
  roomNo: string
  /** Price (kept internally; not shown in the table). */
  price: number
}
