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
        isActive ? 'bg-[#0F1F44] text-white' : 'bg-slate-200 text-slate-700'
      )}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}

function DesignationPill({ value }: { value: string }) {
  return (
    <span className="inline-flex rounded-md bg-slate-200/70 px-3 py-1 text-xs font-medium text-slate-700">
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
  return (
    <div className="w-full overflow-auto rounded-b-xl">
      <table className="w-full min-w-[980px]">
        <thead>
          <tr className="bg-primary text-white">
            <th className="px-6 py-4 text-left text-sm font-semibold first:rounded-tl-xl">
              clinic Name
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Join Date</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Branch</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Designation</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
            <th className="px-6 py-4 text-right text-sm font-semibold last:rounded-tr-xl">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-slate-500 text-sm">
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
                className="transition-colors hover:bg-slate-50/90"
              >
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-800">{row.clinicName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-800 whitespace-nowrap">
                    {formatDoctorJoinDate(row.joinDate)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-800">{row.branch}</span>
                </td>
                <td className="px-6 py-4">
                  <DesignationPill value={row.designation} />
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
                      aria-label="Edit doctor"
                      onClick={() => onEdit(row)}
                    >
                      <Pencil className="h-5 w-5" strokeWidth={2} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-slate-600 hover:bg-slate-200/80 hover:text-rose-700"
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

