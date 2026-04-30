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
        isActive
          ? 'bg-secondary text-white'
          : 'bg-muted text-muted-foreground'
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
    <div className="w-full overflow-x-auto scrollbar-thin rounded-b-2xl">
      <table className="w-full min-w-[920px]">
        <thead>
          <tr className="bg-muted/35 dark:bg-muted/25">
            <th className="px-4 py-3 text-left text-sm font-semibold text-accent first:rounded-tl-xl sm:px-6 sm:py-4">
              Branch Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-accent sm:px-6 sm:py-4">
              Join Date
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-accent sm:px-6 sm:py-4">
              Email
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-accent sm:px-6 sm:py-4">
              Status
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-accent last:rounded-tr-xl sm:px-6 sm:py-4">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground text-sm">
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
                className="transition-colors hover:bg-muted/15"
              >
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <span className="text-sm text-accent">{row.branchName}</span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <span className="text-sm text-accent whitespace-nowrap">
                    {formatBranchJoinDate(row.joinDate)}
                  </span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <span className="text-sm text-accent break-all">{row.email}</span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <StatusPill status={row.status} />
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-accent hover:bg-muted"
                      aria-label="View details"
                      onClick={() => onInfo(row)}
                    >
                      <Info className="h-5 w-5" strokeWidth={2} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-accent hover:bg-muted"
                      aria-label="Edit branch"
                      onClick={() => onEdit(row)}
                    >
                      <Pencil className="h-5 w-5" strokeWidth={2} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-destructive hover:bg-destructive/10"
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

