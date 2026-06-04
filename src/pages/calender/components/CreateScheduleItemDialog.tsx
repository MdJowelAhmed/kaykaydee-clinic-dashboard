import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CREATABLE_ITEM_TYPES,
  type ClinicEventCategory,
} from '../clinicCalendarData'

export interface NewScheduleItem {
  category: ClinicEventCategory
  taskTitle: string
  patientName?: string
  staffName?: string
}

interface CreateScheduleItemDialogProps {
  open: boolean
  /** Target slot, e.g. { dateLabel: 'Wed, Jun 4', time: '9:00 AM' } */
  dateLabel?: string
  time?: string
  onClose: () => void
  onCreate: (item: NewScheduleItem) => void
}

const inputClass =
  'rounded-xl text-accent placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary'

const CreateScheduleItemDialog: React.FC<CreateScheduleItemDialogProps> = ({
  open,
  dateLabel,
  time,
  onClose,
  onCreate,
}) => {
  const [category, setCategory] = useState<ClinicEventCategory>('consultation')
  const [title, setTitle] = useState('')
  const [client, setClient] = useState('')
  const [staff, setStaff] = useState('')

  // Reset the form each time the dialog opens for a new slot.
  useEffect(() => {
    if (open) {
      setCategory('consultation')
      setTitle('')
      setClient('')
      setStaff('')
    }
  }, [open])

  const typeLabel =
    CREATABLE_ITEM_TYPES.find((t) => t.value === category)?.label ?? 'Schedule item'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreate({
      category,
      taskTitle: title.trim() || typeLabel,
      patientName: client.trim() || undefined,
      staffName: staff.trim() || undefined,
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New schedule item</DialogTitle>
          <DialogDescription>
            {dateLabel && time ? `${dateLabel} · ${time}` : 'Add an item to the schedule.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Item type</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as ClinicEventCategory)}>
              <SelectTrigger className={inputClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CREATABLE_ITEM_TYPES.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ci-title" className="text-xs text-muted-foreground">
              Title
            </Label>
            <Input
              id="ci-title"
              placeholder={typeLabel}
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ci-client" className="text-xs text-muted-foreground">
              Client name
            </Label>
            <Input
              id="ci-client"
              placeholder="Optional"
              className={inputClass}
              value={client}
              onChange={(e) => setClient(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ci-staff" className="text-xs text-muted-foreground">
              Practitioner
            </Label>
            <Input
              id="ci-staff"
              placeholder="Optional"
              className={inputClass}
              value={staff}
              onChange={(e) => setStaff(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-secondary text-white hover:bg-secondary/90"
            >
              Add to schedule
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateScheduleItemDialog
