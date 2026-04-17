import { motion } from 'framer-motion'
import { Download, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/formatters'
import type { ReportEntry } from '../types'
import { formatReportDate, statusLabel } from '../utils'

function statusPillClass(status: ReportEntry['status']) {
  switch (status) {
    case 'completed':
      return 'bg-green-600 text-white'
    case 'in_queue':
      return 'bg-amber-500 text-white'
    case 'assigned':
      return 'bg-slate-500 text-white'
    default:
      return 'bg-slate-500 text-white'
  }
}

interface ReportsTableProps {
  rows: ReportEntry[]
  onOpenDetails: (row: ReportEntry) => void
  onDownload: (row: ReportEntry) => void
}

export function ReportsTable({ rows, onOpenDetails, onDownload }: ReportsTableProps) {
  return (
    <div className="w-full overflow-auto rounded-b-xl">
      <table className="w-full min-w-[1400px]">
        <thead>
          <tr className="bg-[#E9ECEF] text-slate-900">
            <th className="px-4 py-4 text-left text-sm font-semibold first:rounded-tl-xl">
              R. No
            </th>
            <th className="px-4 py-4 text-left text-sm font-semibold">Service</th>
            <th className="px-4 py-4 text-left text-sm font-semibold">Patient Name</th>
            <th className="px-4 py-4 text-left text-sm font-semibold">Patient ID</th>
            <th className="px-4 py-4 text-left text-sm font-semibold">Contact No</th>
            <th className="px-4 py-4 text-left text-sm font-semibold">Report By</th>
            <th className="px-4 py-4 text-left text-sm font-semibold">ID no</th>
            <th className="px-4 py-4 text-left text-sm font-semibold">Issue Date</th>
            <th className="px-4 py-4 text-left text-sm font-semibold">Dateline</th>
            <th className="px-4 py-4 text-left text-sm font-semibold">Price</th>
            <th className="px-4 py-4 text-left text-sm font-semibold">Status</th>
            <th className="px-4 py-4 text-right text-sm font-semibold last:rounded-tr-xl">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={12} className="px-6 py-8 text-center text-slate-500">
                No reports found
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.02 * index }}
                className="transition-colors hover:bg-slate-50/90"
              >
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-slate-900">#{row.reportNo}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-slate-800">{row.service}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-slate-800">{row.patientName}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-slate-800">{row.patientId}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-slate-800 whitespace-nowrap">{row.contactNo}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-slate-800">{row.reportBy}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-slate-800">{row.internalDocId}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-slate-800 whitespace-nowrap">
                    {formatReportDate(row.issueDate)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-slate-800 whitespace-nowrap">
                    {formatReportDate(row.dateline)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-slate-900">
                    {formatCurrency(row.price)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={cn(
                      'inline-flex min-w-[92px] items-center justify-center rounded-full px-3 py-1 text-center text-xs font-medium',
                      statusPillClass(row.status)
                    )}
                  >
                    {statusLabel(row.status)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                      aria-label="Download report"
                      onClick={() => onDownload(row)}
                    >
                      <Download className="h-5 w-5" strokeWidth={2} />
                    </Button>
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
