import { useMemo, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
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
import { ReportsTable } from './components/ReportsTable'
import { ReportDetailsModal } from './components/ReportDetailsModal'
import { AddReportModal } from './components/AddReportModal'
import {
  INITIAL_REPORTS,
  REPORT_STATUS_OPTIONS,
  REPORT_DATE_OPTIONS,
  getServiceOptionsFromReports,
  getReportByOptionsFromReports,
} from './reportsData'
import { reportIssueMonthKey } from './utils'
import type { ReportEntry } from './types'

export default function ReportsPage() {
  const { getParam, getNumberParam, setParams } = useUrlParams()

  const search = getParam('search', '')
  const service = getParam('service', 'all')
  const status = getParam('status', 'all')
  const reportBy = getParam('reportBy', 'all')
  const dateMonth = getParam('date', 'all')
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 15)

  const [entries, setEntries] = useState<ReportEntry[]>(INITIAL_REPORTS)
  const [detailsEntry, setDetailsEntry] = useState<ReportEntry | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  const serviceOptions = useMemo(() => getServiceOptionsFromReports(entries), [entries])
  const reportByOptions = useMemo(() => getReportByOptionsFromReports(entries), [entries])

  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase()
    return entries.filter((row) => {
      if (service !== 'all' && row.service !== service) return false
      if (status !== 'all' && row.status !== status) return false
      if (reportBy !== 'all' && row.reportBy !== reportBy) return false
      if (dateMonth !== 'all' && reportIssueMonthKey(row.issueDate) !== dateMonth) {
        return false
      }
      if (!q) return true
      const hay = [
        row.reportNo,
        row.service,
        row.patientName,
        row.patientId,
        row.contactNo,
        row.reportBy,
        row.internalDocId,
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [entries, search, service, status, reportBy, dateMonth])

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

  const handleOpenDetails = useCallback((row: ReportEntry) => {
    setDetailsEntry(row)
    setDetailsOpen(true)
  }, [])

  const handleDownload = useCallback((row: ReportEntry) => {
    toast.success(`Downloading report #${row.reportNo}…`)
  }, [])

  const handleAddCreated = useCallback((entry: ReportEntry) => {
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
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <h1 className="text-xl font-bold text-slate-800 shrink-0">Reports</h1>
              <div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:justify-end lg:gap-3">
                <SearchInput
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search here"
                  className="w-full min-w-0 lg:max-w-md xl:max-w-lg"
                  inputClassName="h-11 rounded-xl border-slate-200 bg-white shadow-sm"
                />
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <Select
                    value={service}
                    onValueChange={(v) => setParams({ service: v, page: 1 })}
                  >
                    <SelectTrigger className="h-11 w-full min-w-[120px] shrink-0 rounded-xl border-slate-200 bg-white shadow-sm sm:w-[130px]">
                      <SelectValue placeholder="Service" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={status}
                    onValueChange={(v) => setParams({ status: v, page: 1 })}
                  >
                    <SelectTrigger className="h-11 w-full min-w-[120px] shrink-0 rounded-xl border-slate-200 bg-white shadow-sm sm:w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {REPORT_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={reportBy}
                    onValueChange={(v) => setParams({ reportBy: v, page: 1 })}
                  >
                    <SelectTrigger className="h-11 w-full min-w-[120px] shrink-0 rounded-xl border-slate-200 bg-white shadow-sm sm:w-[130px]">
                      <SelectValue placeholder="Report By" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportByOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={dateMonth}
                    onValueChange={(v) => setParams({ date: v, page: 1 })}
                  >
                    <SelectTrigger className="h-11 w-full min-w-[120px] shrink-0 rounded-xl border-slate-200 bg-white shadow-sm sm:w-[130px]">
                      <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                      {REPORT_DATE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    className="h-11 shrink-0 rounded-xl bg-[#1A2B4C] px-4 text-white hover:bg-[#152238]"
                    onClick={() => setAddOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Report
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <CardContent className="p-0">
          <ReportsTable
            rows={paginatedData}
            onOpenDetails={handleOpenDetails}
            onDownload={handleDownload}
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

      <ReportDetailsModal
        entry={detailsEntry}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setDetailsEntry(null)
        }}
      />

      <AddReportModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        serviceOptions={serviceOptions}
        reportByOptions={reportByOptions}
        existingEntries={entries}
        onCreated={handleAddCreated}
      />
    </motion.div>
  )
}
