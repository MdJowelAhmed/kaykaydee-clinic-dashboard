import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { WaitingListEntry } from '../types'
import { formatWaitlistDate, statusLabel } from '../utils'

function statusPillClass(status: WaitingListEntry['status']) {
  switch (status) {
    case 'booked':
      return 'bg-teal-600 text-white'
    case 'contacted':
      return 'bg-sky-600 text-white'
    case 'waiting':
      return 'bg-amber-500 text-white'
    case 'cancelled':
      return 'bg-rose-500 text-white'
    case 'declined':
      return 'bg-slate-400 text-white dark:bg-slate-600'
    default:
      return 'bg-slate-500 text-white'
  }
}

const STATUS_VALUES: WaitingListEntry['status'][] = [
  'waiting',
  'contacted',
  'booked',
  'cancelled',
  'declined',
]

interface WaitingListTableProps {
  rows: WaitingListEntry[]
  onOpenDetails: (row: WaitingListEntry) => void
  onChangeStatus: (id: string, next: WaitingListEntry['status']) => void
}

export function WaitingListTable({ rows, onOpenDetails, onChangeStatus }: WaitingListTableProps) {
  const headerBg = 'bg-[#E9EBF0] dark:bg-background'
  const headerCell =
    'border-x-0 border-t-0 px-4 text-sm font-semibold text-accent sm:px-6 sm:py-4 align-middle'
  const bodyCell = 'border-b border-border px-4 py-3 text-sm text-accent sm:px-6 sm:py-4'
  const nameCell = 'bg-[#F3F1FA] dark:bg-muted/20'
  return (
    <div className="w-full overflow-x-auto scrollbar-thin rounded-b-2xl">
      <table className="w-full min-w-[1240px]">
        <thead>
          <tr className="">
            <th className={cn(headerCell, headerBg, 'text-left rounded-l-full')}>Client Name</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Date of Birth</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Address</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Contact Number</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Preferred Practitioner</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Appointment Type</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Date Added</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Preferred Date</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Status</th>
            <th className={cn(headerCell, headerBg, 'text-right rounded-r-full')}>Action</th>
          </tr>
        </thead>
        <tbody className="bg-card text-accent-foreground">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={10} className={bodyCell}>
                No clients on the waitlist
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * index }}
                className="transition-colors hover:bg-muted/15"
              >
                <td className={cn(bodyCell, nameCell)}>
                  <button
                    type="button"
                    onClick={() => onOpenDetails(row)}
                    className="text-left text-sm font-medium text-accent underline-offset-2 hover:underline"
                  >
                    {row.patientName}
                  </button>
                </td>
                <td className={bodyCell}>
                  <span className="whitespace-nowrap text-sm text-accent">
                    {formatWaitlistDate(row.dob)}
                  </span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-accent">{row.address || '—'}</span>
                </td>
                <td className={bodyCell}>
                  <span className="whitespace-nowrap text-sm text-accent">{row.contactNo}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-accent">{row.doctor}</span>
                </td>
                <td className={bodyCell}>
                  <span className="whitespace-nowrap text-sm text-accent">{row.appointmentType}</span>
                </td>
                <td className={bodyCell}>
                  <span className="whitespace-nowrap text-sm text-accent">
                    {formatWaitlistDate(row.dateAddedAt)}
                  </span>
                </td>
                <td className={bodyCell}>
                  <div className="flex flex-col gap-1">
                    <span className="whitespace-nowrap text-sm text-accent">
                      {formatWaitlistDate(row.preferredAppointmentDate)}
                    </span>
                    {row.slotOffer?.state === 'pending' ? (
                      <span className="text-[11px] font-medium text-primary">Earlier slot offer</span>
                    ) : null}
                  </div>
                </td>
                <td className={bodyCell}>
                  <Select
                    value={row.status}
                    onValueChange={(v) => onChangeStatus(row.id, v as WaitingListEntry['status'])}
                  >
                    <SelectTrigger
                      className={cn(
                        'h-11 w-full shrink-0 border-0 sm:w-[140px] shadow-sm',
                        statusPillClass(row.status)
                      )}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_VALUES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {statusLabel(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className={bodyCell}>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-accent hover:bg-muted"
                      aria-label="View details"
                      onClick={() => onOpenDetails(row)}
                    >
                      <Info className="h-5 w-5" strokeWidth={2} />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
