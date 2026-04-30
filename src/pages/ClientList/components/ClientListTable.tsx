import { motion } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { truncateText } from '@/utils/formatters'
import type { ClientListEntry } from '../types'

interface ClientListTableProps {
  rows: ClientListEntry[]
  onOpenProfile: (row: ClientListEntry) => void
  onEdit: (row: ClientListEntry) => void
  onDelete: (row: ClientListEntry) => void
}

export function ClientListTable({ rows, onOpenProfile, onEdit, onDelete }: ClientListTableProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-thin rounded-b-2xl">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="bg-muted/35 dark:bg-muted/25">
            <th className="px-4 py-3 text-left text-sm font-semibold text-accent first:rounded-tl-xl sm:px-6 sm:py-4">
              Patient Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-accent sm:px-6 sm:py-4">
              Contact No
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-accent sm:px-6 sm:py-4">
              Email
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-accent sm:px-6 sm:py-4">
              Address
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-accent last:rounded-tr-xl sm:px-6 sm:py-4">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-8 text-center text-sm text-muted-foreground"
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
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <button
                    type="button"
                    onClick={() => onOpenProfile(row)}
                    className="text-left text-sm font-medium text-accent underline-offset-2 hover:underline"
                  >
                    {row.patientName}
                  </button>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <span className="whitespace-nowrap text-sm text-accent">{row.contactNo}</span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <span className="break-all text-sm text-accent">{row.email}</span>
                </td>
                <td className="max-w-[220px] px-4 py-3 sm:px-6 sm:py-4">
                  <span className="text-sm text-accent" title={row.address}>
                    {truncateText(row.address, 36)}
                  </span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <div className="flex justify-end gap-1">
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
                      className="h-9 w-9 rounded-full text-destructive hover:bg-destructive/10"
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
