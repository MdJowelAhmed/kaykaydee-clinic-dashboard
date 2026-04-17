import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import type { ExerciseEntry } from '../types'

interface ExercisesTableProps {
  rows: ExerciseEntry[]
  onOpenDetails: (row: ExerciseEntry) => void
  onToggleEnabled: (id: string, enabled: boolean) => void
}

export function ExercisesTable({ rows, onOpenDetails, onToggleEnabled }: ExercisesTableProps) {
  return (
    <div className="w-full overflow-auto rounded-b-xl">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="bg-primary text-white">
            <th className="px-6 py-4 text-left text-sm font-semibold first:rounded-tl-xl">
              Exercise Name
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Category Name</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Description</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
            <th className="px-6 py-4 text-right text-sm font-semibold last:rounded-tr-xl">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                No exercises found
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
                  <span className="text-sm font-medium text-slate-900">{row.exerciseName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-800">{row.categoryName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-800">{row.description}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={row.enabled}
                      onCheckedChange={(checked) => onToggleEnabled(row.id, checked)}
                      className="data-[state=unchecked]:bg-[#1A2B4C] data-[state=checked]:bg-green-600"
                      aria-label={row.enabled ? 'Disable exercise' : 'Enable exercise'}
                    />
                    <span className="text-sm text-slate-800">
                      {row.enabled ? 'Enable' : 'Disable'}
                    </span>
                  </div>
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
