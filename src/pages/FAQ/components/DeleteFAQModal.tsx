import { AlertTriangle } from 'lucide-react'
import { ModalWrapper } from '@/components/common'
import { Button } from '@/components/ui/button'
import type { FAQ } from '@/types'

interface DeleteFAQModalProps {
  open: boolean
  onClose: () => void
  faq: FAQ | null
  onConfirm: () => void
}

export function DeleteFAQModal({
  open,
  onClose,
  faq,
  onConfirm,
}: DeleteFAQModalProps) {
  if (!faq) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Delete FAQ"
      size="md"
      className="max-w-md bg-card"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-accent mb-1">
              Are you sure?
            </h3>
            <p className="text-sm text-muted-foreground">
              This will permanently delete the FAQ: <strong>{faq.question}</strong>
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            Delete
          </Button>
        </div>
      </div>
    </ModalWrapper>
  )
}

