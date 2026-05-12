import { ModalWrapper } from '@/components/common/ModalWrapper'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/formatters'
import type { WaitingListEntry } from '../types'
import { formatWaitingListAppointment, statusLabel } from '../utils'

interface WaitingListDetailsModalProps {
  entry: WaitingListEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRespondEarlierSlot?: (entryId: string, accept: boolean) => void
}

export function WaitingListDetailsModal({
  entry,
  open,
  onOpenChange,
  onRespondEarlierSlot,
}: WaitingListDetailsModalProps) {
  if (!entry) return null

  const pendingOffer = entry.slotOffer?.state === 'pending'

  return (
    <ModalWrapper
      open={open}
      onClose={() => onOpenChange(false)}
      title="Appointment details"
      description={`Reference #${entry.serialNo}`}
      size="md"
      className="bg-white"
    >
      {pendingOffer && entry.slotOffer ? (
        <div className="mb-5 space-y-3 rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm dark:bg-primary/10">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
            Notification (demo)
          </p>
          <p className="font-medium leading-relaxed text-accent">
            আপনি কি আপনার অ্যাপয়েন্টমেন্ট এগিয়ে এনে খালি হওয়া এই স্লটে নিতে চান?
          </p>
          <p className="text-xs text-muted-foreground">
            Offered slot:{' '}
            <span className="font-medium text-accent">
              {formatWaitingListAppointment(entry.slotOffer.offeredSlotAt)}
            </span>
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              type="button"
              size="sm"
              className="rounded-lg"
              onClick={() => {
                onRespondEarlierSlot?.(entry.id, true)
                onOpenChange(false)
              }}
            >
              Yes — reschedule
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-lg"
              onClick={() => {
                onRespondEarlierSlot?.(entry.id, false)
                onOpenChange(false)
              }}
            >
              No — keep my date
            </Button>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            হ্যাঁ বললে অ্যাপয়েন্টমেন্ট স্বয়ংক্রিয়ভাবে এগিয়ে আসবে; না বললে আগের সময়ই থাকবে এবং সুযোগটি
            কিউতে পরবর্তী ব্যক্তির কাছে চলে যাবে।
          </p>
        </div>
      ) : null}

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Type</dt>
          <dd className="font-medium text-slate-900">
            {entry.listRole === 'waitlist' ? 'Waitlist (no slot in ~90 days)' : 'Booked'}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Status</dt>
          <dd className="font-medium text-slate-900">{statusLabel(entry.status)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Service</dt>
          <dd className="font-medium text-slate-900">{entry.service}</dd>
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
