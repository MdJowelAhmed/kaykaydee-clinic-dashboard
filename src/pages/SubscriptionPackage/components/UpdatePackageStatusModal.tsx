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

export type PackageStatus = 'active' | 'inactive'

interface UpdatePackageStatusModalProps {
  open: boolean
  onClose: () => void
  packageName: string
  currentStatus: PackageStatus
  onSave: (next: PackageStatus) => void
}

export function UpdatePackageStatusModal({
  open,
  onClose,
  packageName,
  currentStatus,
  onSave,
}: UpdatePackageStatusModalProps) {
  const [status, setStatus] = useState<PackageStatus>(currentStatus)

  useEffect(() => {
    if (!open) return
    setStatus(currentStatus)
  }, [open, currentStatus])

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Update status"
      description={packageName}
      size="sm"
      className="bg-card"
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground">Status</label>
          <Select value={status} onValueChange={(v) => setStatus(v as PackageStatus)}>
            <SelectTrigger className="h-11 rounded-xl border-border bg-background text-accent">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
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
              onSave(status)
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

