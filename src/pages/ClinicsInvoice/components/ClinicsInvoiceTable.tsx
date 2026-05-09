import { motion } from 'framer-motion'
import { ArrowDownToLine, Info, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/formatters'
import type { ClinicsInvoiceEntry } from '../types'
import { formatInvoiceDate, invoiceStatusLabel } from '../utils'

function statusPillClass(status: ClinicsInvoiceEntry['status']) {
  switch (status) {
    case 'completed':
      return 'bg-teal-600 text-white'
    case 'processing':
      return 'bg-orange-500 text-white'
    case 'cancel':
      return 'bg-red-600 text-white'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

function moneyClass(kind: 'due' | 'paid', value: number) {
  if (value <= 0) return 'text-muted-foreground'
  return kind === 'due' ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400'
}

interface ClinicsInvoiceTableProps {
  rows: ClinicsInvoiceEntry[]
  onDownload: (row: ClinicsInvoiceEntry) => void
  onEditStatus: (row: ClinicsInvoiceEntry) => void
  onOpenDetails: (row: ClinicsInvoiceEntry) => void
}

export function ClinicsInvoiceTable({
  rows,
  onDownload,
  onEditStatus,
  onOpenDetails,
}: ClinicsInvoiceTableProps) {
  const headerBg = 'bg-[#E9EBF0] dark:bg-background'

  const headerCell =
    'border-x-0 border-t-0  px-4 text-sm font-semibold text-accent sm:px-6 sm:py-4 align-middle '
  
  const bodyCell = 'border-b border-border px-4 py-3 text-sm text-accent sm:px-6 sm:py-4'
  return (
    <div className="w-full overflow-x-auto scrollbar-thin rounded-b-2xl">
      <table className="w-full min-w-[1200px]">
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
              Doctor
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>
              Date
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>
              Price
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>
              Due
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>
              Paid
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
              <td colSpan={11} className="px-6 py-8 text-center text-sm text-muted-foreground">
                No invoices found
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.02 * index }}
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
                  <span className="text-sm text-accent">{row.doctor}</span>
                </td>
                <td className={bodyCell}>
                  <span className="whitespace-nowrap text-sm text-accent">
                    {formatInvoiceDate(row.dateIso)}
                  </span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm font-medium text-accent">{formatCurrency(row.price)}</span>
                </td>
                <td className={bodyCell}>
                  <span className={cn('text-sm font-medium', moneyClass('due', row.due))}>
                    {row.due > 0 ? formatCurrency(row.due) : '---'}
                  </span>
                </td>
                <td className={bodyCell}>
                  <span className={cn('text-sm font-medium', moneyClass('paid', row.paid))}>
                    {row.paid > 0 ? formatCurrency(row.paid) : '---'}
                  </span>
                </td>
                <td className={bodyCell}>
                  <span
                    className={cn(
                      'inline-flex min-w-[92px] items-center justify-center rounded-full px-3 py-1 text-center text-xs font-medium',
                      statusPillClass(row.status)
                    )}
                  >
                    {invoiceStatusLabel(row.status)}
                  </span>
                </td>
                <td className={bodyCell}>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-accent hover:bg-muted"
                      aria-label="Download invoice"
                      onClick={() => onDownload(row)}
                    >
                      <ArrowDownToLine className="h-4 w-4" strokeWidth={2} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-accent hover:bg-muted"
                      aria-label="Edit status"
                      onClick={() => onEditStatus(row)}
                    >
                      <Pencil className="h-4 w-4" strokeWidth={2} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-accent hover:bg-muted"
                      aria-label="View details"
                      onClick={() => onOpenDetails(row)}
                    >
                      <Info className="h-4 w-4" strokeWidth={2} />
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

