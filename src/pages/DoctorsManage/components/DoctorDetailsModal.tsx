import { ModalWrapper } from '@/components/common/ModalWrapper'
import type { DoctorEntry } from '../types'
import { formatDoctorJoinDate } from '../utils'

interface DoctorDetailsModalProps {
  entry: DoctorEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DoctorDetailsModal({ entry, open, onOpenChange }: DoctorDetailsModalProps) {
  if (!entry) return null

  return (
    <ModalWrapper
      open={open}
      onClose={() => onOpenChange(false)}
      title="Doctor details"
      description={entry.designation}
      size="md"
      className="bg-white rounded-2xl"
    >
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Clinic name</dt>
          <dd className="font-medium text-slate-900">{entry.clinicName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Join date</dt>
          <dd className="font-medium text-slate-900">{formatDoctorJoinDate(entry.joinDate)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Branch</dt>
          <dd className="font-medium text-slate-900">{entry.branch}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Designation</dt>
          <dd className="font-medium text-slate-900">{entry.designation}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Status</dt>
          <dd className="font-medium text-slate-900 capitalize">{entry.status}</dd>
        </div>
      </dl>
    </ModalWrapper>
  )
}

