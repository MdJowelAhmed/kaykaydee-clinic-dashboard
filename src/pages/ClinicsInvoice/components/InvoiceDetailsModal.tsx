import type { ClinicsInvoiceEntry } from '../types'
import { ModalWrapper } from '@/components/common/ModalWrapper'
import { formatCurrency } from '@/utils/formatters'
import { formatInvoiceDate, invoiceStatusLabel } from '../utils'

interface InvoiceDetailsModalProps {
  entry: ClinicsInvoiceEntry | null
  open: boolean
  onClose: () => void
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-accent">{value}</dd>
    </div>
  )
}

export function InvoiceDetailsModal({ entry, open, onClose }: InvoiceDetailsModalProps) {
  if (!entry) return null

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Invoice details"
      description="View invoice information"
      size="lg"
      className="bg-card"
    >
      <dl className="space-y-3">
        <DetailRow label="S. No" value={`#${entry.serialNo}`} />
        <DetailRow label="Service" value={entry.service} />
        <DetailRow label="Patient name" value={entry.patientName} />
        <DetailRow label="Patient ID" value={entry.patientId} />
        <DetailRow label="Contact no" value={entry.contactNo} />
        <DetailRow label="Doctor" value={entry.doctor} />
        <DetailRow label="Date" value={formatInvoiceDate(entry.dateIso)} />
        <DetailRow label="Price" value={formatCurrency(entry.price)} />
        <DetailRow label="Due" value={entry.due === 0 ? '---' : formatCurrency(entry.due)} />
        <DetailRow label="Paid" value={entry.paid === 0 ? '---' : formatCurrency(entry.paid)} />
        <DetailRow label="Status" value={invoiceStatusLabel(entry.status)} />
      </dl>
    </ModalWrapper>
  )
}

