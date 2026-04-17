import { ModalWrapper } from '@/components/common/ModalWrapper'
import { formatCurrency } from '@/utils/formatters'
import type { ReportEntry } from '../types'
import { formatReportDate, statusLabel } from '../utils'

interface ReportDetailsModalProps {
  entry: ReportEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportDetailsModal({ entry, open, onOpenChange }: ReportDetailsModalProps) {
  if (!entry) return null

  return (
    <ModalWrapper
      open={open}
      onClose={() => onOpenChange(false)}
      title="Report details"
      description={`Reference #${entry.reportNo}`}
      size="md"
      className="bg-white max-w-2xl"

    >
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Service</dt>
          <dd className="font-medium text-slate-900">{entry.service}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Status</dt>
          <dd className="font-medium text-slate-900">{statusLabel(entry.status)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Patient name</dt>
          <dd className="font-medium text-slate-900">{entry.patientName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Patient ID</dt>
          <dd className="font-medium text-slate-900">{entry.patientId}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Contact</dt>
          <dd className="font-medium text-slate-900">{entry.contactNo}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Report by</dt>
          <dd className="font-medium text-slate-900">{entry.reportBy}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">ID no</dt>
          <dd className="font-medium text-slate-900">{entry.internalDocId}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Price</dt>
          <dd className="font-medium text-slate-900">{formatCurrency(entry.price)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Issue date</dt>
          <dd className="font-medium text-slate-900">{formatReportDate(entry.issueDate)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Dateline</dt>
          <dd className="font-medium text-slate-900">{formatReportDate(entry.dateline)}</dd>
        </div>
      </dl>
    </ModalWrapper>
  )
}
