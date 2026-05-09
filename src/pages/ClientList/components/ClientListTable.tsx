import { motion } from 'framer-motion'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { truncateText } from '@/utils/formatters'
import type { ClientListEntry } from '../types'
import { cn } from '@/utils/cn'

interface ClientListTableProps {
  rows: ClientListEntry[]
  onOpenProfile: (row: ClientListEntry) => void
  onEdit: (row: ClientListEntry) => void
  onDelete: (row: ClientListEntry) => void
}

export function ClientListTable({ rows, onOpenProfile, onEdit, onDelete }: ClientListTableProps) {
  const headerBg = 'bg-[#E9EBF0] dark:bg-background'
  const headerCell = 'border-x-0 border-t-0 px-4 text-sm font-semibold text-accent sm:px-6 sm:py-4 align-middle'
  const bodyCell = 'border-b border-border px-4 py-3 text-sm text-accent sm:px-6 sm:py-4'
  return (
    <div className="w-full overflow-x-auto scrollbar-thin rounded-b-2xl">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="">
            <th className={cn(headerCell, headerBg, 'text-left rounded-l-full')}>
              Patient Name
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>
              Contact No
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>
              Email
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>
              Address
            </th>
            <th className={cn(headerCell, headerBg, 'text-right rounded-r-full')}>
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-card text-accent-foreground">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-8 text-center text-sm text-accent"
              >
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
                className="transition-colors hover:bg-muted/15"
              >
                <td className={bodyCell}>
                  <button
                    type="button"
                    onClick={() => onOpenProfile(row)}
                    className="text-left text-sm font-medium text-accent underline-offset-2 hover:underline"
                  >
                    {row.patientName}
                  </button>
                </td>
                <td className={bodyCell}>
                  <span className="whitespace-nowrap text-sm text-accent">{row.contactNo}</span>
                </td>
                <td className={bodyCell}>
                  <span className="break-all text-sm text-accent">{row.email}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-accent" title={row.address}>
                    {truncateText(row.address, 36)}
                  </span>
                </td>
                  <td className={bodyCell}>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-accent hover:bg-muted"
                      aria-label="View details"
                      onClick={() => onOpenProfile(row)}
                    >
                      <Eye className="h-4 w-4" strokeWidth={2} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-accent hover:bg-muted"
                      aria-label="Edit client"
                      onClick={() => onEdit(row)}
                    >
                      <Pencil className="h-4 w-4" strokeWidth={2} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-accent hover:bg-destructive/10"
                      aria-label="Delete client"
                      onClick={() => onDelete(row)}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={2} />
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
