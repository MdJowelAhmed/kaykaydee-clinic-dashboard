import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/formatters'
import type { WaitingListEntry } from '../types'
import { formatWaitingListAppointment, statusLabel } from '../utils'

function statusPillClass(status: WaitingListEntry['status']) {
  switch (status) {
    case 'completed':
      return 'bg-teal-600 text-white'
    case 'pending':
      return 'bg-orange-500 text-white'
    case 'cancelled':
      return 'bg-red-600 text-white'
    default:
      return 'bg-slate-500 text-white'
  }
}

interface WaitingListTableProps {
  rows: WaitingListEntry[]
  onOpenDetails: (row: WaitingListEntry) => void
}

export function WaitingListTable({ rows, onOpenDetails }: WaitingListTableProps) {
  return (
    <div className="w-full overflow-auto rounded-b-xl">
      <table className="w-full min-w-[1200px]">
        <thead>
          <tr className="bg-primary text-white">
            <th className="px-6 py-4 text-left text-sm font-semibold">S. No</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Service</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Patient Name</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Patient ID</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Contact No</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Doctor</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Appoint Date</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Room No</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
            <th className="px-6 py-4 text-right text-sm font-semibold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={11} className="px-6 py-8 text-center text-slate-500">
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
                className="transition-colors hover:bg-slate-50/80"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-800">#{row.serialNo}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{row.service}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{row.patientName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{row.patientId}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{row.contactNo}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{row.doctor}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700 whitespace-nowrap">
                    {formatWaitingListAppointment(row.appointmentAt)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{row.roomNo}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-800">
                    {formatCurrency(row.price)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      'inline-flex min-w-[90px] items-center justify-center rounded-full px-3 py-1 text-center text-xs font-medium',
                      statusPillClass(row.status)
                    )}
                  >
                    {statusLabel(row.status)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
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
