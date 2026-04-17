import { ModalWrapper } from '@/components/common/ModalWrapper'
import { formatCurrency } from '@/utils/formatters'
import type { WaitingListEntry } from '../types'
import { formatWaitingListAppointment, statusLabel } from '../utils'

interface WaitingListDetailsModalProps {
  entry: WaitingListEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WaitingListDetailsModal({
  entry,
  open,
  onOpenChange,
}: WaitingListDetailsModalProps) {
  if (!entry) return null

  return (
    <ModalWrapper
      open={open}
      onClose={() => onOpenChange(false)}
      title="Appointment details"
      description={`Reference #${entry.serialNo}`}
      size="md"
      className="bg-white"
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
          <dt className="text-muted-foreground">Doctor</dt>
          <dd className="font-medium text-slate-900">{entry.doctor}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-muted-foreground">Appointment</dt>
          <dd className="font-medium text-slate-900">
            {formatWaitingListAppointment(entry.appointmentAt)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Room</dt>
          <dd className="font-medium text-slate-900">{entry.roomNo}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Price</dt>
          <dd className="font-medium text-slate-900">{formatCurrency(entry.price)}</dd>
        </div>
      </dl>
    </ModalWrapper>
  )
}
