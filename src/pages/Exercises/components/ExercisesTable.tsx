import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import type { ExerciseEntry } from '../types'
import { cn } from '@/utils/cn'

interface ExercisesTableProps {
  rows: ExerciseEntry[]
  onOpenDetails: (row: ExerciseEntry) => void
  onToggleEnabled: (id: string, enabled: boolean) => void
}

export function ExercisesTable({ rows, onOpenDetails, onToggleEnabled }: ExercisesTableProps) {
  const headerBg = 'bg-[#E9EBF0] dark:bg-background'
  const headerCell = 'border-x-0 border-t-0 px-4 text-sm font-semibold text-accent sm:px-6 sm:py-4 align-middle'
  const bodyCell = 'border-b border-border px-4 py-3 text-sm text-accent sm:px-6 sm:py-4'
  return (
    <div className="w-full overflow-auto rounded-b-xl">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="">
            <th className={cn(headerCell, headerBg, 'text-left rounded-l-full')}>
              Exercise Name
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Category Name</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Description</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Status</th>
            <th className={cn(headerCell, headerBg, 'text-right rounded-r-full')}>
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-card text-accent-foreground">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className={bodyCell}>
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
                className=" "
              >
                <td className={bodyCell}>
                  <span className="text-sm font-medium text-accent">{row.exerciseName}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-accent">{row.categoryName}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-accent">{row.description}</span>
                </td>
                <td className={bodyCell}>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={row.enabled}
                      onCheckedChange={(checked) => onToggleEnabled(row.id, checked)}
                      className="data-[state=unchecked]:bg-[#1A2B4C] data-[state=checked]:bg-green-600"
                      aria-label={row.enabled ? 'Disable exercise' : 'Enable exercise'}
                    />
                    <span className="text-sm text-accent">
                      {row.enabled ? 'Enable' : 'Disable'}
                    </span>
                  </div>
                </td>
                <td className={bodyCell}>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-accent hover:bg-slate-200/80 hover:text-accent"
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
