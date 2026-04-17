import { useMemo, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { useUrlParams } from '@/hooks/useUrlState'
import { ClientListTable } from './components/ClientListTable'
import { ClientListDetailsModal } from './components/ClientListDetailsModal'
import { IncludePatientModal } from './components/IncludePatientModal'
import { INITIAL_CLIENT_LIST, CLIENT_LIST_DATE_OPTIONS } from './clientListData'
import { clientJoinMonthKey } from './utils'
import type { ClientListEntry } from './types'

export default function ClientListPage() {
  const { getParam, getNumberParam, setParams } = useUrlParams()

  const search = getParam('search', '')
  const dateMonth = getParam('date', 'all')
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 15)

  const [entries, setEntries] = useState<ClientListEntry[]>(INITIAL_CLIENT_LIST)
  const [detailsEntry, setDetailsEntry] = useState<ClientListEntry | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [includeOpen, setIncludeOpen] = useState(false)

  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase()
    return entries.filter((row) => {
      if (dateMonth !== 'all' && clientJoinMonthKey(row.joinDate) !== dateMonth) {
        return false
      }
      if (!q) return true
      const hay = [row.idNo, row.patientName, row.contactNo, row.email, row.address]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [entries, search, dateMonth])

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

  const handleOpenDetails = useCallback((row: ClientListEntry) => {
    setDetailsEntry(row)
    setDetailsOpen(true)
  }, [])

  const handleCreated = useCallback((entry: ClientListEntry) => {
    setEntries((prev) => [entry, ...prev])
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-xl font-bold text-slate-800 shrink-0">Client list</h1>
            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
              <SearchInput
                value={search}
                onChange={handleSearch}
                placeholder="Search here"
                className="w-full min-w-0 sm:max-w-md lg:max-w-xl"
                inputClassName="h-11 rounded-xl border-slate-200 bg-white shadow-sm"
              />
              <Select value={dateMonth} onValueChange={(v) => setParams({ date: v, page: 1 })}>
                <SelectTrigger className="h-11 w-full shrink-0 rounded-xl border-slate-200 bg-white shadow-sm sm:w-[140px]">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  {CLIENT_LIST_DATE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                className="h-11 shrink-0 rounded-xl bg-[#1A2B4C] px-4 text-white hover:bg-[#152238]"
                onClick={() => setIncludeOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Include Patient
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <CardContent className="p-0">
          <ClientListTable rows={paginatedData} onOpenDetails={handleOpenDetails} />

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

      <ClientListDetailsModal
        entry={detailsEntry}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setDetailsEntry(null)
        }}
      />

      <IncludePatientModal
        open={includeOpen}
        onClose={() => setIncludeOpen(false)}
        existingEntries={entries}
        onCreated={handleCreated}
      />
    </motion.div>
  )
}
