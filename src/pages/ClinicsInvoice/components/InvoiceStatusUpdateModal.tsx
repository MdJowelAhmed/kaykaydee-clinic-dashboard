import { useEffect, useState } from 'react'
import { ModalWrapper } from '@/components/common/ModalWrapper'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { ClinicsInvoiceEntry, ClinicsInvoiceStatus } from '../types'
import { invoiceStatusLabel } from '../utils'

interface InvoiceStatusUpdateModalProps {
  entry: ClinicsInvoiceEntry | null
  open: boolean
  onClose: () => void
  onSave: (id: string, nextStatus: ClinicsInvoiceStatus) => void
}

const STATUS_OPTIONS: ClinicsInvoiceStatus[] = ['completed', 'processing', 'cancel']

export function InvoiceStatusUpdateModal({
  entry,
  open,
  onClose,
  onSave,
}: InvoiceStatusUpdateModalProps) {
  const [status, setStatus] = useState<ClinicsInvoiceStatus>('completed')

  useEffect(() => {
    if (!open || !entry) return
    setStatus(entry.status)
  }, [open, entry])

  if (!entry) return null

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Update status"
      description={`Invoice #${entry.serialNo}`}
      size="sm"
      className="bg-card"
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground">Status</label>
          <Select value={status} onValueChange={(v) => setStatus(v as ClinicsInvoiceStatus)}>
            <SelectTrigger className="h-11 rounded-xl border-border bg-background text-accent">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {invoiceStatusLabel(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-secondary text-white hover:bg-secondary/90"
            onClick={() => {
              onSave(entry.id, status)
              onClose()
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </ModalWrapper>
  )
}

