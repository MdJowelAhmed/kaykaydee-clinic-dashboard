import { ModalWrapper } from '@/components/common/ModalWrapper'
import type { BranchEntry } from '../types'
import { formatBranchJoinDate } from '../utils'

interface BranchDetailsModalProps {
  entry: BranchEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BranchDetailsModal({ entry, open, onOpenChange }: BranchDetailsModalProps) {
  if (!entry) return null

  return (
    <ModalWrapper
      open={open}
      onClose={() => onOpenChange(false)}
      title="Branch details"
      description={entry.branchName}
      size="md"
      className="bg-white rounded-2xl"
    >
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="sm:col-span-2">
          <dt className="text-muted-foreground">Branch name</dt>
          <dd className="font-medium text-slate-900">{entry.branchName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Join date</dt>
          <dd className="font-medium text-slate-900">{formatBranchJoinDate(entry.joinDate)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Email</dt>
          <dd className="font-medium text-slate-900 break-all">{entry.email}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Status</dt>
          <dd className="font-medium text-slate-900 capitalize">{entry.status}</dd>
        </div>
      </dl>
    </ModalWrapper>
  )
}

