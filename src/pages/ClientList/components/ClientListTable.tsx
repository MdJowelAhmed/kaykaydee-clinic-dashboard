import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { truncateText } from '@/utils/formatters'
import type { ClientListEntry } from '../types'
import { formatClientJoinDate } from '../utils'

interface ClientListTableProps {
  rows: ClientListEntry[]
  onOpenDetails: (row: ClientListEntry) => void
}

export function ClientListTable({ rows, onOpenDetails }: ClientListTableProps) {
  return (
    <div className="w-full overflow-auto rounded-b-xl">
      <table className="w-full min-w-[960px]">
        <thead>
          <tr className="bg-[#E9ECEF] text-slate-900">
            <th className="px-6 py-4 text-left text-sm font-semibold first:rounded-tl-xl">
              ID. No
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Patient Name</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Contact No</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Join date</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Address</th>
            <th className="px-6 py-4 text-right text-sm font-semibold last:rounded-tr-xl">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                No clients found
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
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-900">#{row.idNo}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-800">{row.patientName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-800 whitespace-nowrap">{row.contactNo}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-800 break-all">{row.email}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-800 whitespace-nowrap">
                    {formatClientJoinDate(row.joinDate)}
                  </span>
                </td>
                <td className="px-6 py-4 max-w-[220px]">
                  <span className="text-sm text-slate-800" title={row.address}>
                    {truncateText(row.address, 36)}
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
