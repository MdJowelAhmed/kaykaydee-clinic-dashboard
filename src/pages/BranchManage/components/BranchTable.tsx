import { motion } from 'framer-motion'
import { Info, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import type { BranchEntry } from '../types'
import { formatBranchJoinDate } from '../utils'

function StatusPill({ status }: { status: BranchEntry['status'] }) {
  const isActive = status === 'active'
  return (
    <span
      className={cn(
        'inline-flex min-w-[110px] justify-center rounded-md px-3 py-1 text-xs font-semibold',
        isActive ? 'bg-[#0F1F44] text-white' : 'bg-slate-200 text-slate-700'
      )}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}

interface BranchTableProps {
  rows: BranchEntry[]
  onInfo: (row: BranchEntry) => void
  onEdit: (row: BranchEntry) => void
  onDelete: (row: BranchEntry) => void
}

export function BranchTable({ rows, onInfo, onEdit, onDelete }: BranchTableProps) {
  return (
    <div className="w-full overflow-auto rounded-b-xl">
      <table className="w-full min-w-[920px]">
        <thead>
          <tr className="bg-primary text-white">
            <th className="px-6 py-4 text-left text-sm font-semibold first:rounded-tl-xl">
              Branch Name
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Join Date</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
            <th className="px-6 py-4 text-right text-sm font-semibold last:rounded-tr-xl">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-slate-500 text-sm">
                No branches found
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(0.02 * index, 0.25) }}
                className="transition-colors hover:bg-slate-50/90"
              >
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-800">{row.branchName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-800 whitespace-nowrap">
                    {formatBranchJoinDate(row.joinDate)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-800 break-all">{row.email}</span>
                </td>
                <td className="px-6 py-4">
                  <StatusPill status={row.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                      aria-label="View details"
                      onClick={() => onInfo(row)}
                    >
                      <Info className="h-5 w-5" strokeWidth={2} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                      aria-label="Edit branch"
                      onClick={() => onEdit(row)}
                    >
                      <Pencil className="h-5 w-5" strokeWidth={2} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-slate-600 hover:bg-slate-200/80 hover:text-rose-700"
                      aria-label="Delete branch"
                      onClick={() => onDelete(row)}
                    >
                      <Trash2 className="h-5 w-5" strokeWidth={2} />
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

