import { motion } from 'framer-motion'
import type { ClientListEntry } from '../types'
import { cn } from '@/utils/cn'
import { formatClientDobDisplay } from '../utils'
import { ClientTags } from './ClientTags'

interface ClientListTableProps {
  rows: ClientListEntry[]
  onOpenProfile: (row: ClientListEntry) => void
}

export function ClientListTable({ rows, onOpenProfile }: ClientListTableProps) {
  const headerBg = 'bg-[#E9EBF0] dark:bg-background'
  const headerCell =
    'border-x-0 border-t-0 px-4 text-sm font-semibold text-accent sm:px-6 sm:py-4 align-middle'
  const bodyCell = 'border-b border-border px-4 py-3 text-sm text-accent sm:px-6 sm:py-4'
  const nameCell = 'bg-[#F3F1FA] dark:bg-muted/20'
  return (
    <div className="w-full overflow-x-auto scrollbar-thin rounded-b-2xl">
      <table className="w-full min-w-[720px]">
        <thead>
          <tr className="">
            <th className={cn(headerCell, headerBg, 'text-left rounded-l-full')}>Client Name</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Date of Birth</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Contact Number</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Email</th>
            <th className={cn(headerCell, headerBg, 'text-left rounded-r-full')}>Tags</th>
          </tr>
        </thead>
        <tbody className="bg-card text-accent-foreground">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-sm text-accent">
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
                <td className={cn(bodyCell, nameCell)}>
                  <button
                    type="button"
                    onClick={() => onOpenProfile(row)}
                    className="text-left text-sm font-medium text-accent underline-offset-2 hover:underline"
                  >
                    {row.patientName}
                  </button>
                </td>
                <td className={bodyCell}>
                  <span className="whitespace-nowrap text-sm text-accent">
                    {formatClientDobDisplay(row.dateOfBirth)}
                  </span>
                </td>
                <td className={bodyCell}>
                  <span className="whitespace-nowrap text-sm text-accent">{row.contactNo}</span>
                </td>
                <td className={bodyCell}>
                  <span className="break-all text-sm text-accent">{row.email}</span>
                </td>
                <td className={bodyCell}>
                  <ClientTags tags={row.tags} />
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
