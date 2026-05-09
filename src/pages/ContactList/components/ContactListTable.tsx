import { motion } from 'framer-motion'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ContactEntry } from '../types'
import { cn } from '@/utils/cn'

interface ContactListTableProps {
  rows: ContactEntry[]
  onView: (row: ContactEntry) => void
  onEdit: (row: ContactEntry) => void
  onDelete: (row: ContactEntry) => void
}

export function ContactListTable({ rows, onView, onEdit, onDelete }: ContactListTableProps) {
  const headerBg = 'bg-[#E9EBF0] dark:bg-background'
  const headerCell = 'border-x-0 border-t-0 px-4 text-sm font-semibold text-accent sm:px-6 sm:py-4 align-middle'
  const bodyCell = 'border-b border-border px-4 py-3 text-sm text-accent sm:px-6 sm:py-4'
  return (
    <div className="w-full overflow-x-auto scrollbar-thin rounded-b-2xl">
      <table className="w-full min-w-[920px]">
        <thead>
          <tr className="">
            <th className={cn(headerCell, headerBg, 'text-left rounded-l-full')}>
              Name
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>
              Type
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>
              Company
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>
              Email
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>
              Contact No
            </th>
            <th className={cn(headerCell, headerBg, 'text-right rounded-r-full')}>
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-card text-accent-foreground">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-sm text-accent">
                No contacts found
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
                  <span className="text-sm font-medium text-accent">{row.name}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-accent">{row.type}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-accent">{row.company}</span>
                </td>
                <td className={bodyCell}>
                  <a
                    href={`mailto:${row.email}`}
                    className="text-sm text-accent underline-offset-2 hover:underline"
                  >
                    {row.email}
                  </a>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-accent">{row.contactNo}</span>
                </td>
                <td className={bodyCell}>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-accent hover:bg-muted"
                      aria-label="View details"
                      onClick={() => onView(row)}
                    >
                      <Eye className="h-4 w-4" strokeWidth={2} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-accent hover:bg-muted"
                      aria-label="Edit provider"
                      onClick={() => onEdit(row)}
                    >
                      <Pencil className="h-4 w-4" strokeWidth={2} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-destructive hover:bg-destructive/10"
                      aria-label="Delete provider"
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

