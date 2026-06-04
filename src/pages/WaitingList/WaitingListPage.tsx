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
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  addWaitlistEntry,
  respondEarlierSlotOffer,
  selectWaitlistEntries,
  updateWaitlistEntryStatus,
} from '@/redux/slices/waitlistSlice'
import { WaitingListTable } from './components/WaitingListTable'
import { WaitingListDetailsModal } from './components/WaitingListDetailsModal'
import { AddAppointmentModal } from './components/AddAppointmentModal'
import {
  WAITING_LIST_STATUS_OPTIONS,
  WAITING_LIST_APPT_TYPE_OPTIONS,
} from './waitingListData'
import type { WaitingListEntry } from './types'

export default function WaitingListPage() {
  const dispatch = useAppDispatch()
  const entries = useAppSelector(selectWaitlistEntries)
  const { getParam, getNumberParam, setParams } = useUrlParams()

  const search = getParam('search', '')
  const status = getParam('status', 'all')
  const apptType = getParam('type', 'all')
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 15)

  const [detailsEntry, setDetailsEntry] = useState<WaitingListEntry | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase()
    return entries.filter((row) => {
      if (status !== 'all' && row.status !== status) return false
      if (apptType !== 'all' && row.appointmentType !== apptType) return false
      if (!q) return true
      const hay = [row.patientName, row.contactNo, row.doctor, row.appointmentType, row.address]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [entries, search, status, apptType])

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

  const handleChangeStatus = useCallback(
    (id: string, next: WaitingListEntry['status']) => {
      dispatch(updateWaitlistEntryStatus({ id, status: next }))
    },
    [dispatch]
  )

  const handleAddCreated = useCallback(
    (entry: WaitingListEntry) => {
      dispatch(addWaitlistEntry(entry))
    },
    [dispatch]
  )

  const handleRespondEarlierSlot = useCallback(
    (entryId: string, accept: boolean) => {
      dispatch(respondEarlierSlotOffer({ entryId, accept }))
      toast.success(
        accept
          ? 'Appointment moved to the earlier slot (demo).'
          : 'Original appointment kept; the slot was offered to the next person on the waitlist (demo).'
      )
    },
    [dispatch]
  )

  const filterInputClass =
    'h-11 rounded-xl border-border bg-white dark:bg-background text-accent shadow-sm placeholder:text-accent'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder="Search client, contact, practitioner…"
          className="w-full min-w-0 sm:max-w-md lg:max-w-xl"
          inputClassName={filterInputClass}
        />

        <Select value={apptType} onValueChange={(v) => setParams({ type: v, page: 1 })}>
          <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[180px] ${filterInputClass}`}>
            <SelectValue placeholder="Appointment type" />
          </SelectTrigger>
          <SelectContent>
            {WAITING_LIST_APPT_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={(v) => setParams({ status: v, page: 1 })}>
          <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[140px] ${filterInputClass}`}>
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

        <Button
          type="button"
          aria-label="Add client to waitlist"
          className="h-11 w-11 shrink-0 rounded-xl bg-secondary p-0 text-white hover:bg-secondary/90"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-border shadow-sm">
        <CardContent className="bg-card p-4 text-card-foreground">
          <WaitingListTable
            rows={paginatedData}
            onOpenDetails={handleOpenDetails}
            onChangeStatus={handleChangeStatus}
          />

          <div className="border-t border-border px-4 sm:px-6">
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
        onRespondEarlierSlot={handleRespondEarlierSlot}
      />

      <AddAppointmentModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        existingEntries={entries}
        onCreated={handleAddCreated}
      />
    </motion.div>
  )
}
