import { ModalWrapper } from '@/components/common/ModalWrapper'
import type { ClientListEntry } from '../types'
import { formatClientJoinDate } from '../utils'

interface ClientListDetailsModalProps {
  entry: ClientListEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientListDetailsModal({
  entry,
  open,
  onOpenChange,
}: ClientListDetailsModalProps) {
  if (!entry) return null

  return (
    <ModalWrapper
      open={open}
      onClose={() => onOpenChange(false)}
      title="Client details"
      description={`ID #${entry.idNo}`}
      size="md"
    >
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="sm:col-span-2">
          <dt className="text-muted-foreground">Patient name</dt>
          <dd className="font-medium text-slate-900">{entry.patientName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Contact</dt>
          <dd className="font-medium text-slate-900">{entry.contactNo}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Email</dt>
          <dd className="font-medium text-slate-900 break-all">{entry.email}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Join date</dt>
          <dd className="font-medium text-slate-900">{formatClientJoinDate(entry.joinDate)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-muted-foreground">Address</dt>
          <dd className="font-medium text-slate-900">{entry.address}</dd>
        </div>
      </dl>
    </ModalWrapper>
  )
}
