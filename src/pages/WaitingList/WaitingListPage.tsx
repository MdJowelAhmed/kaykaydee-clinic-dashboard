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
import { WaitingListTable } from './components/WaitingListTable'
import { WaitingListDetailsModal } from './components/WaitingListDetailsModal'
import { AddAppointmentModal } from './components/AddAppointmentModal'
import {
  INITIAL_WAITING_LIST,
  WAITING_LIST_STATUS_OPTIONS,
  WAITING_LIST_DATE_OPTIONS,
  getDoctorOptionsFromEntries,
  getServiceOptionsFromEntries,
} from './waitingListData'
import { appointmentMonthKey } from './utils'
import type { WaitingListEntry } from './types'

export default function WaitingListPage() {
  const { getParam, getNumberParam, setParams } = useUrlParams()

  const search = getParam('search', '')
  const service = getParam('service', 'all')
  const status = getParam('status', 'all')
  const doctor = getParam('doctor', 'all')
  const dateMonth = getParam('date', 'all')
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 15)

  const [entries, setEntries] = useState<WaitingListEntry[]>(INITIAL_WAITING_LIST)
  const [detailsEntry, setDetailsEntry] = useState<WaitingListEntry | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  const serviceOptions = useMemo(() => getServiceOptionsFromEntries(entries), [entries])
  const doctorOptions = useMemo(() => getDoctorOptionsFromEntries(entries), [entries])

  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase()
    return entries.filter((row) => {
      if (service !== 'all' && row.service !== service) return false
      if (status !== 'all' && row.status !== status) return false
      if (doctor !== 'all' && row.doctor !== doctor) return false
      if (dateMonth !== 'all' && appointmentMonthKey(row.appointmentAt) !== dateMonth) {
        return false
      }
      if (!q) return true
      const hay = [
        row.serialNo,
        row.service,
        row.patientName,
        row.patientId,
        row.contactNo,
        row.doctor,
        row.roomNo,
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [entries, search, service, status, doctor, dateMonth])

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

  const handleOpenDetails = useCallback((row: WaitingListEntry) => {
    setDetailsEntry(row)
    setDetailsOpen(true)
  }, [])

  const handleAddCreated = useCallback((entry: WaitingListEntry) => {
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
              <h1 className="text-xl font-bold text-slate-800 shrink-0">Waiting list</h1>
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
                      {WAITING_LIST_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={doctor}
                    onValueChange={(v) => setParams({ doctor: v, page: 1 })}
                  >
                    <SelectTrigger className="h-11 w-full min-w-[120px] shrink-0 rounded-xl border-slate-200 bg-white shadow-sm sm:w-[130px]">
                      <SelectValue placeholder="Doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctorOptions.map((option) => (
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
                      {WAITING_LIST_DATE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    className="h-11 shrink-0 rounded-xl bg-slate-900 px-4 text-white hover:bg-slate-800"
                    onClick={() => setAddOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Appointment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <CardContent className="p-0">
          <WaitingListTable rows={paginatedData} onOpenDetails={handleOpenDetails} />

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

      <WaitingListDetailsModal
        entry={detailsEntry}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setDetailsEntry(null)
        }}
      />

      <AddAppointmentModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        serviceOptions={serviceOptions}
        doctorOptions={doctorOptions}
        existingEntries={entries}
        onCreated={handleAddCreated}
      />
    </motion.div>
  )
}
