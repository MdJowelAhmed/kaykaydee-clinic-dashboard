import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Info } from 'lucide-react'
import { formatInvoiceDate } from '../utils'
import type { SubscriptionInvoiceRow } from '../types'

interface SubscriptionInvoiceTableProps {
  rows: SubscriptionInvoiceRow[]
  onDownload: (row: SubscriptionInvoiceRow) => void
  onInfo: (row: SubscriptionInvoiceRow) => void
}

export function SubscriptionInvoiceTable({ rows, onDownload, onInfo }: SubscriptionInvoiceTableProps) {
  return (
    <div className="w-full overflow-auto rounded-xl">
      <table className="w-full min-w-[1200px]">
        <thead>
          <tr className="bg-primary text-white">
            <th className="px-6 py-4 text-left text-sm font-semibold first:rounded-tl-xl">Reg. ID</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Pac. ID</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">User Name</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Package</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">price</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Issue Date</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Dateline</th>
            <th className="px-6 py-4 text-right text-sm font-semibold last:rounded-tr-xl">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={10} className="px-6 py-10 text-center text-slate-500 text-sm">
                No subscription invoices found
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(0.04 * index, 0.4) }}
                className="hover:bg-slate-50/80 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-500">#{row.id}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-500">{row.pacId}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-800">{row.userName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{row.contact}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700 break-all">{row.email}</span>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant="outline"
                    className="rounded-full border-0 bg-slate-100 text-slate-700 font-medium px-3"
                  >
                    {row.package}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">${row.price}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{formatInvoiceDate(row.issueDate)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{formatInvoiceDate(row.dateline)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="h-9 w-9 rounded-full text-slate-500 hover:text-secondary hover:bg-slate-100"
                      onClick={() => onDownload(row)}
                      aria-label="Download invoice"
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="h-9 w-9 rounded-full text-slate-500 hover:text-secondary hover:bg-slate-100"
                      onClick={() => onInfo(row)}
                      aria-label="Invoice details"
                    >
                      <Info className="h-5 w-5" />
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
