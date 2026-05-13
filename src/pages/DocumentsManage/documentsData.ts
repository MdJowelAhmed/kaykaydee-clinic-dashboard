import type { DocumentRow } from './types'

export const DATE_FILTER_OPTIONS = [
  { value: 'all', label: 'Date' },
  { value: '2026-01', label: 'Jan 2026' },
  { value: '2025-12', label: 'Dec 2025' },
] as const

const BASE_ROW: Omit<DocumentRow, 'id' | 'fileName'> = {
  patientName: 'Zoya Clinic',
  patientId: '256874',
  doctorName: 'Dr.APJ Kalam',
  doctorId: '256874',
  dateIso: '2026-01-02T09:00:00.000Z',
  moderator: 'Doctor Dr.APJ Kalam',
  status: 'active',
}

export const INITIAL_DOCUMENTS: DocumentRow[] = Array.from({ length: 30 }).map((_, index) => ({
  id: `doc-${index + 1}`,
  fileName: 'Docname.doc',
  ...BASE_ROW,
  moderator: index % 3 === 1 ? 'Admin Asad' : BASE_ROW.moderator,
}))
