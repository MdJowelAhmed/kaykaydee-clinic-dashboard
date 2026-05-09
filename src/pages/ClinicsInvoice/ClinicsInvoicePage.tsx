import { useCallback, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
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
import type { ClinicsInvoiceEntry, ClinicsInvoiceStatus } from './types'
import {
  CLINICS_INVOICE_DATE_OPTIONS,
  CLINICS_INVOICE_STATUS_OPTIONS,
  INITIAL_CLINICS_INVOICES,
  getDoctorOptionsFromInvoices,
  getServiceOptionsFromInvoices,
} from './clinicsInvoiceData'
import { invoiceMonthKey } from './utils'
import { ClinicsInvoiceTable } from './components/ClinicsInvoiceTable'
import { InvoiceDetailsModal } from './components/InvoiceDetailsModal'
import { InvoiceStatusUpdateModal } from './components/InvoiceStatusUpdateModal'

export default function ClinicsInvoicePage() {
  const { getParam, getNumberParam, setParams } = useUrlParams()

  const search = getParam('search', '')
  const service = getParam('service', 'all')
  const status = getParam('status', 'all')
  const doctor = getParam('doctor', 'all')
  const dateMonth = getParam('date', 'all')
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 15)

  const [entries, setEntries] = useState<ClinicsInvoiceEntry[]>(INITIAL_CLINICS_INVOICES)
  const [detailsEntry, setDetailsEntry] = useState<ClinicsInvoiceEntry | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [statusEntry, setStatusEntry] = useState<ClinicsInvoiceEntry | null>(null)
  const [statusOpen, setStatusOpen] = useState(false)

  const serviceOptions = useMemo(() => getServiceOptionsFromInvoices(entries), [entries])
  const doctorOptions = useMemo(() => getDoctorOptionsFromInvoices(entries), [entries])

  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase()
    return entries.filter((row) => {
      if (service !== 'all' && row.service !== service) return false
      if (status !== 'all' && row.status !== status) return false
      if (doctor !== 'all' && row.doctor !== doctor) return false
      if (dateMonth !== 'all' && invoiceMonthKey(row.dateIso) !== dateMonth) return false
      if (!q) return true
      const hay = [
        row.serialNo,
        row.service,
        row.patientName,
        row.patientId,
        row.doctor,
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

  const handleSearch = (value: string) => setParams({ search: value, page: 1 })
  const handlePageChange = (newPage: number) => setParams({ page: newPage })
  const handleItemsPerPageChange = (newLimit: number) => setParams({ limit: newLimit, page: 1 })

  const handleDownload = useCallback((row: ClinicsInvoiceEntry) => {
    toast.success(`Downloading invoice #${row.serialNo}…`)
  }, [])

  const handleOpenDetails = useCallback((row: ClinicsInvoiceEntry) => {
    setDetailsEntry(row)
    setDetailsOpen(true)
  }, [])

  const handleEditStatus = useCallback((row: ClinicsInvoiceEntry) => {
    setStatusEntry(row)
    setStatusOpen(true)
  }, [])

  const handleSaveStatus = useCallback((id: string, nextStatus: ClinicsInvoiceStatus) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: nextStatus } : e)))
    toast.success('Status updated')
  }, [])

  const filterInputClass =
    'h-11 rounded-xl border-border bg-background text-accent shadow-sm placeholder:text-muted-foreground'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <Card className="overflow-hidden rounded-2xl border border-border shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="shrink-0 space-y-1">
              <h1 className="text-xl font-bold text-accent sm:text-2xl">Clinics Invoice</h1>
              <p className="text-sm text-muted-foreground">Manage clinics on the platform</p>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
              <SearchInput
                value={search}
                onChange={handleSearch}
                placeholder="Search here"
                className="w-full min-w-0 sm:max-w-md lg:max-w-xl"
                inputClassName={filterInputClass}
              />
              <Select value={service} onValueChange={(v) => setParams({ service: v, page: 1 })}>
                <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[140px] ${filterInputClass}`}>
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  {serviceOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={(v) => setParams({ status: v, page: 1 })}>
                <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[140px] ${filterInputClass}`}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {CLINICS_INVOICE_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={doctor} onValueChange={(v) => setParams({ doctor: v, page: 1 })}>
                <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[150px] ${filterInputClass}`}>
                  <SelectValue placeholder="Doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctorOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dateMonth} onValueChange={(v) => setParams({ date: v, page: 1 })}>
                <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[140px] ${filterInputClass}`}>
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  {CLINICS_INVOICE_DATE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-2xl  shadow-sm">
        <CardContent className="p-4">
          <ClinicsInvoiceTable
            rows={paginatedData}
            onDownload={handleDownload}
            onEditStatus={handleEditStatus}
            onOpenDetails={handleOpenDetails}
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

      <InvoiceDetailsModal
        entry={detailsEntry}
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false)
          setDetailsEntry(null)
        }}
      />

      <InvoiceStatusUpdateModal
        entry={statusEntry}
        open={statusOpen}
        onClose={() => {
          setStatusOpen(false)
          setStatusEntry(null)
        }}
        onSave={handleSaveStatus}
      />
    </motion.div>
  )
}

