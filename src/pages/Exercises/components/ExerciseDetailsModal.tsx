import { ModalWrapper } from '@/components/common/ModalWrapper'
import type { ExerciseEntry } from '../types'

interface ExerciseDetailsModalProps {
  entry: ExerciseEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExerciseDetailsModal({
  entry,
  open,
  onOpenChange,
}: ExerciseDetailsModalProps) {
  if (!entry) return null

  return (
    <ModalWrapper
      open={open}
      onClose={() => onOpenChange(false)}
      title="Exercise details"
      description={entry.exerciseName}
      size="md"
      className="max-w-2xl bg-white"
    >
      <dl className="grid gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Exercise name</dt>
          <dd className="font-medium text-slate-900">{entry.exerciseName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Category</dt>
          <dd className="font-medium text-slate-900">{entry.categoryName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Description</dt>
          <dd className="font-medium text-slate-900">{entry.description}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Status</dt>
          <dd className="font-medium text-slate-900">{entry.enabled ? 'Enable' : 'Disable'}</dd>
        </div>
      </dl>
    </ModalWrapper>
  )
}
