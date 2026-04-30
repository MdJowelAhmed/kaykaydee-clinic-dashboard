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
import { formatWaitingListAppointment, statusLabel } from '../utils'

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
  return (
    <div className="w-full overflow-x-auto scrollbar-thin rounded-b-2xl">
      <table className="w-full min-w-[1080px]">
        <thead>
          <tr className="bg-primary text-accent-foreground ">
            <th className="px-4 py-3 text-left text-sm font-semibold  first:rounded-tl-xl sm:px-6 sm:py-4">
              S. No
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold  sm:px-6 sm:py-4">
              Service
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold  sm:px-6 sm:py-4">
              Patient Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold  sm:px-6 sm:py-4">
              Patient ID
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold  sm:px-6 sm:py-4">
              Contact No
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold  sm:px-6 sm:py-4">
              Doctor
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold  sm:px-6 sm:py-4">
              Appoint Date
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold  sm:px-6 sm:py-4">
              Price
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold  sm:px-6 sm:py-4">
              Status
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold  last:rounded-tr-xl sm:px-6 sm:py-4">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={10} className="px-6 py-8 text-center text-sm text-muted-foreground">
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
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <span className="text-sm font-medium text-accent">#{row.serialNo}</span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <span className="text-sm text-accent">{row.service}</span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <span className="text-sm text-accent">{row.patientName}</span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <span className="text-sm text-accent">{row.patientId}</span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <span className="text-sm text-accent">{row.contactNo}</span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <span className="text-sm text-accent">{row.doctor}</span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <span className="whitespace-nowrap text-sm text-accent">
                    {formatWaitingListAppointment(row.appointmentAt)}
                  </span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <span className={cn('text-sm font-medium', priceClass(row))}>
                    {formatCurrency(row.price)}
                  </span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <Select
                    value={row.status}
                    onValueChange={(v) => onChangeStatus(row.id, v as WaitingListEntry['status'])}
                  >
                    <SelectTrigger
                      className={cn(
                        'h-7 w-[122px] justify-between rounded-full border-0 px-3 text-xs font-medium shadow-none focus:ring-0',
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
                <td className="px-4 py-3 sm:px-6 sm:py-4">
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
