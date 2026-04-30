import type { ClinicsInvoiceEntry, ClinicsInvoiceStatus } from './types'

const SERVICES = ['MSK', 'MSK Report', 'Dental', 'Physiotherapy']
const DOCTORS = ['Dr.APJ Kalam', 'Dr. Sarah Smith', 'Dr. John Lee', 'Dr. Maria Garcia']
const PATIENT_NAMES = ['Zoya Clinic', 'Asadujjaman Mahfuz', 'Nadir', 'Metro Care', 'Wellness Hub']
const STATUSES: ClinicsInvoiceStatus[] = ['completed', 'cancel', 'processing']

function buildRow(index: number): ClinicsInvoiceEntry {
  const day = 1 + (index % 28)
  const month = index % 3
  const dateIso = new Date(2026, month, day, 12, 0).toISOString()
  const status = STATUSES[index % STATUSES.length]
  const price = 500
  const due = status === 'cancel' ? 500 : index % 5 === 0 ? 50 : 0
  const paid = status === 'cancel' ? 0 : Math.max(0, price - due)

  return {
    id: `inv-${index + 1}`,
    serialNo: String(265800 + index),
    service: SERVICES[index % SERVICES.length],
    patientName: PATIENT_NAMES[index % PATIENT_NAMES.length],
    patientId: String(256800 + index),
    contactNo: `+9965416${String(5654 + (index % 10000)).padStart(4, '0').slice(-4)}`,
    doctor: DOCTORS[index % DOCTORS.length],
    dateIso,
    price,
    due,
    paid,
    status,
  }
}

/** Deterministic mock list (150 rows) for pagination demos */
export const INITIAL_CLINICS_INVOICES: ClinicsInvoiceEntry[] = Array.from(
  { length: 150 },
  (_, i) => buildRow(i)
)

export const CLINICS_INVOICE_STATUS_OPTIONS = [
  { value: 'all', label: 'Status' },
  { value: 'completed', label: 'Completed' },
  { value: 'processing', label: 'Processing' },
  { value: 'cancel', label: 'Cancel' },
]

/** Month keys aligned with mock data (2026-01 …) */
export const CLINICS_INVOICE_DATE_OPTIONS = [
  { value: 'all', label: 'Date' },
  { value: '2026-01', label: 'January 2026' },
  { value: '2026-02', label: 'February 2026' },
  { value: '2026-03', label: 'March 2026' },
]

export function getServiceOptionsFromInvoices(entries: ClinicsInvoiceEntry[]) {
  const uniq = [...new Set(entries.map((e) => e.service))].sort()
  return [{ value: 'all', label: 'Service' }, ...uniq.map((s) => ({ value: s, label: s }))]
}

export function getDoctorOptionsFromInvoices(entries: ClinicsInvoiceEntry[]) {
  const uniq = [...new Set(entries.map((e) => e.doctor))].sort()
  return [{ value: 'all', label: 'Doctor' }, ...uniq.map((d) => ({ value: d, label: d }))]
}

