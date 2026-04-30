import { motion } from 'framer-motion'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ContactEntry } from '../types'

interface ContactListTableProps {
  rows: ContactEntry[]
  onView: (row: ContactEntry) => void
  onEdit: (row: ContactEntry) => void
  onDelete: (row: ContactEntry) => void
}

export function ContactListTable({ rows, onView, onEdit, onDelete }: ContactListTableProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-thin rounded-b-2xl">
      <table className="w-full min-w-[920px]">
        <thead>
          <tr className="bg-primary text-accent-foreground">
            <th className="px-4 py-3 text-left text-sm font-semibold  first:rounded-tl-xl sm:px-6 sm:py-4">
              Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold  sm:px-6 sm:py-4">
              Type
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold  sm:px-6 sm:py-4">
              Company
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold  sm:px-6 sm:py-4">
              Email
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold  sm:px-6 sm:py-4">
              Contact No
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold  last:rounded-tr-xl sm:px-6 sm:py-4">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
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
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <span className="text-sm font-medium text-accent">{row.name}</span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <span className="text-sm text-accent">{row.type}</span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <span className="text-sm text-accent">{row.company}</span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <a
                    href={`mailto:${row.email}`}
                    className="text-sm text-accent underline-offset-2 hover:underline"
                  >
                    {row.email}
                  </a>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <span className="text-sm text-accent">{row.contactNo}</span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <div className="flex justify-end gap-1">
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

