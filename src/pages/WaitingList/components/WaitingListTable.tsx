import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/formatters'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { WaitingListEntry } from '../types'
import { formatWaitingListAppointment, listRoleLabel, statusLabel } from '../utils'

function statusPillClass(status: WaitingListEntry['status']) {
  switch (status) {
    case 'completed':
      return 'bg-teal-600 text-white'
    case 'pending':
      return 'bg-orange-500 text-white'
    case 'cancelled':
      return 'bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-100'
    default:
      return 'bg-slate-500 text-white'
  }
}

interface WaitingListTableProps {
  rows: WaitingListEntry[]
  onOpenDetails: (row: WaitingListEntry) => void
  onChangeStatus: (id: string, next: WaitingListEntry['status']) => void
}

function priceClass(row: WaitingListEntry) {
  if (row.status === 'cancelled') return 'text-destructive'
  return 'text-emerald-600 dark:text-emerald-400'
}

export function WaitingListTable({ rows, onOpenDetails, onChangeStatus }: WaitingListTableProps) {
  const headerBg = 'bg-[#E9EBF0] dark:bg-background'
  const headerCell = 'border-x-0 border-t-0 px-4 text-sm font-semibold text-accent sm:px-6 sm:py-4 align-middle'
  const bodyCell = 'border-b border-border px-4 py-3 text-sm text-accent sm:px-6 sm:py-4'
  return (
    <div className="w-full overflow-x-auto scrollbar-thin rounded-b-2xl">
      <table className="w-full min-w-[1160px]">
        <thead>
          <tr className="">
            <th className={cn(headerCell, headerBg, 'text-left rounded-l-full')}>
              S. No
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>
              Service
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>
              Patient Name
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>
              Patient ID
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>
              Contact No
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>
              Doctor
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>
              Type
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>
              Appoint Date
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>
              Price
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>
              Status
            </th>
            <th className={cn(headerCell, headerBg, 'text-right rounded-r-full')}>
              Action
            </th>
          </tr>
        </thead>
          <tbody className="bg-card text-accent-foreground">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={11} className={bodyCell}>
                No appointments found
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
                <td className={bodyCell}>
                  <span className="text-sm font-medium text-accent">#{row.serialNo}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-accent">{row.service}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-accent">{row.patientName}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-accent">{row.patientId}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-accent">{row.contactNo}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-accent">{row.doctor}</span>
                </td>
                <td className={bodyCell}>
                  <div className="flex flex-col gap-1">
                    <span
                      className={cn(
                        'inline-flex w-fit rounded-full px-2 py-0.5 text-xs font-semibold',
                        row.listRole === 'waitlist'
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-200'
                          : 'bg-slate-100 text-slate-700 dark:bg-muted dark:text-foreground'
                      )}
                    >
                      {listRoleLabel(row.listRole)}
                    </span>
                    {row.slotOffer?.state === 'pending' ? (
                      <span className="text-[11px] font-medium text-primary">Earlier slot offer</span>
                    ) : null}
                  </div>
                </td>
                <td className={bodyCell}>
                  <span className="whitespace-nowrap text-sm text-accent">
                    {formatWaitingListAppointment(row.appointmentAt)}
                  </span>
                </td>
                <td className={bodyCell}>
                  <span className={cn('text-sm font-medium', priceClass(row))}>
                    {formatCurrency(row.price)}
                  </span>
                </td>
                <td className={bodyCell}>
                  <Select
                    value={row.status}
                    onValueChange={(v) => onChangeStatus(row.id, v as WaitingListEntry['status'])}
                  >
                    <SelectTrigger
                      className={cn(
                        'h-11 w-full shrink-0 sm:w-[140px] bg-white dark:bg-background text-accent shadow-sm placeholder:text-muted-foreground',
                        statusPillClass(row.status)
                      )}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">{statusLabel('completed')}</SelectItem>
                      <SelectItem value="pending">{statusLabel('pending')}</SelectItem>
                      <SelectItem value="cancelled">{statusLabel('cancelled')}</SelectItem>
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
