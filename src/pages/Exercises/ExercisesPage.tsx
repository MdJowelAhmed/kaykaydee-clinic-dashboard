import { useMemo, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { useUrlParams } from '@/hooks/useUrlState'
import { cn } from '@/utils/cn'
import { ExercisesTable } from './components/ExercisesTable'
import { ExerciseDetailsModal } from './components/ExerciseDetailsModal'
import {
  INITIAL_EXERCISES,
  EXERCISE_ENABLE_FILTER_OPTIONS,
  getCategoryOptionsFromExercises,
} from './exercisesData'
import type { ExerciseEntry } from './types'

export default function ExercisesPage() {
  const { getParam, getNumberParam, setParams } = useUrlParams()

  const search = getParam('search', '')
  const enableFilter = getParam('enable', 'all')
  const category = getParam('category', 'all')
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 15)

  const [entries, setEntries] = useState<ExerciseEntry[]>(INITIAL_EXERCISES)
  const [detailsEntry, setDetailsEntry] = useState<ExerciseEntry | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const categoryOptions = useMemo(() => getCategoryOptionsFromExercises(entries), [entries])

  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase()
    return entries.filter((row) => {
      if (category !== 'all' && row.categoryName !== category) return false
      if (enableFilter === 'enabled' && !row.enabled) return false
      if (enableFilter === 'disabled' && row.enabled) return false
      if (!q) return true
      const hay = [row.exerciseName, row.categoryName, row.description].join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [entries, search, enableFilter, category])

  const totalPages = Math.max(1, Math.ceil(filteredList.length / limit))

  const paginatedData = useMemo(() => {
    const safePage = Math.min(page, totalPages)
    const startIndex = (safePage - 1) * limit
    return filteredList.slice(startIndex, startIndex + limit)
  }, [filteredList, page, limit, totalPages])

  const handleSearch = (value: string) => {
    setParams({ search: value, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    setParams({ page: newPage })
  }

  const handleItemsPerPageChange = (newLimit: number) => {
    setParams({ limit: newLimit, page: 1 })
  }

  const handleOpenDetails = useCallback((row: ExerciseEntry) => {
    setDetailsEntry(row)
    setDetailsOpen(true)
  }, [])

  const handleToggleEnabled = useCallback((id: string, enabled: boolean) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, enabled } : e)))
    setDetailsEntry((d) => (d?.id === id ? { ...d, enabled } : d))
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div
        className={cn(
          'rounded-2xl border border-red-200/80 bg-red-50 px-4 py-3 sm:px-5',
          'text-sm font-medium text-red-700 sm:text-base'
        )}
        role="status"
      >
        Connect to Physitrack to view and follow your prescribed exercises
      </div>

      <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-xl font-bold text-slate-800 shrink-0">Exercises</h1>
            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
              <SearchInput
                value={search}
                onChange={handleSearch}
                placeholder="Search here"
                className="w-full min-w-0 sm:max-w-md lg:max-w-xl"
                inputClassName="h-11 rounded-xl border-slate-200 bg-white shadow-sm"
              />
              <Select
                value={enableFilter}
                onValueChange={(v) => setParams({ enable: v, page: 1 })}
              >
                <SelectTrigger className="h-11 w-full shrink-0 rounded-xl border-slate-200 bg-white shadow-sm sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {EXERCISE_ENABLE_FILTER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={category}
                onValueChange={(v) => setParams({ category: v, page: 1 })}
              >
                <SelectTrigger className="h-11 w-full shrink-0 rounded-xl border-slate-200 bg-white shadow-sm sm:w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <CardContent className="p-0">
          <ExercisesTable
            rows={paginatedData}
            onOpenDetails={handleOpenDetails}
            onToggleEnabled={handleToggleEnabled}
          />

          <div className="border-t border-slate-100 px-4 sm:px-6">
            <Pagination
              variant="minimal"
              currentPage={Math.min(page, totalPages)}
              totalPages={totalPages}
              totalItems={filteredList.length}
              itemsPerPage={limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              showItemsPerPage={false}
            />
          </div>
        </CardContent>
      </Card>

      <ExerciseDetailsModal
        entry={detailsEntry}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setDetailsEntry(null)
        }}
      />
    </motion.div>
  )
}
