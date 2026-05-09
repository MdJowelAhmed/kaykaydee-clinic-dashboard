import { motion } from 'framer-motion'
import { Info, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import type { DoctorEntry } from '../types'
import { formatDoctorJoinDate } from '../utils'

function StatusPill({ status }: { status: DoctorEntry['status'] }) {
  const isActive = status === 'active'
  return (
    <span
      className={cn(
        'inline-flex min-w-[84px] justify-center rounded-md px-3 py-1 text-xs font-semibold',
        isActive ? 'bg-secondary text-white' : 'bg-muted text-muted-foreground'
      )}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}

function DesignationPill({ value }: { value: string }) {
  return (
    <span className="inline-flex rounded-md bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
      {value}
    </span>
  )
}

interface DoctorsTableProps {
  rows: DoctorEntry[]
  onInfo: (row: DoctorEntry) => void
  onEdit: (row: DoctorEntry) => void
  onDelete: (row: DoctorEntry) => void
}

export function DoctorsTable({ rows, onInfo, onEdit, onDelete }: DoctorsTableProps) {
  const headerBg = 'bg-[#E9EBF0] dark:bg-background'
  const headerCell = 'border-x-0 border-t-0 px-4 text-sm font-semibold text-accent sm:px-6 sm:py-4 align-middle'
  const bodyCell = 'border-b border-border px-4 py-3 text-sm text-accent sm:px-6 sm:py-4'
  return (
    <div className="w-full overflow-x-auto scrollbar-thin rounded-b-2xl">
      <table className="w-full min-w-[980px]">
        <thead>
          <tr className="">
            <th className={cn(headerCell, headerBg, 'text-left rounded-l-full')}>
              clinic Name
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Join Date</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Branch</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Designation</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Status</th>
            <th className={cn(headerCell, headerBg, 'text-right rounded-r-full')}>
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-card text-accent-foreground">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className={bodyCell}>
                No doctors found
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
                  <td className={bodyCell}>
                  <span className="text-sm text-accent">{row.clinicName}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-accent whitespace-nowrap">
                    {formatDoctorJoinDate(row.joinDate)}
                  </span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-accent">{row.branch}</span>
                </td>
                <td className={bodyCell}>
                  <DesignationPill value={row.designation} />
                </td>
                <td className={bodyCell}>
                  <StatusPill status={row.status} />
                </td>
                <td className={bodyCell}>
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
                      aria-label="Edit doctor"
                      onClick={() => onEdit(row)}
                    >
                      <Pencil className="h-5 w-5" strokeWidth={2} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-destructive hover:bg-destructive/10"
                      aria-label="Delete doctor"
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

