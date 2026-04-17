import { useCallback, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUrlParams } from '@/hooks/useUrlState'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { INITIAL_DOCTORS, DOCTOR_STATUS_OPTIONS } from './doctorsData'
import type { DoctorEntry, DoctorStatus } from './types'
import { DoctorsTable } from './components/DoctorsTable'
import { DoctorDetailsModal } from './components/DoctorDetailsModal'
import { AddEditDoctorModal } from './components/AddEditDoctorModal'

export default function DoctorsManagePage() {
  const { getParam, getNumberParam, setParams } = useUrlParams()

  const search = getParam('search', '')
  const status = getParam('status', 'all')
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 15)

  const [entries, setEntries] = useState<DoctorEntry[]>(INITIAL_DOCTORS)
  const [detailsEntry, setDetailsEntry] = useState<DoctorEntry | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [addEditOpen, setAddEditOpen] = useState(false)
  const [addEditMode, setAddEditMode] = useState<'create' | 'edit'>('create')
  const [editingEntry, setEditingEntry] = useState<DoctorEntry | null>(null)
  const [deleteEntry, setDeleteEntry] = useState<DoctorEntry | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase()
    return entries.filter((row) => {
      if (status !== 'all' && row.status !== status) return false
      if (!q) return true
      const hay = [row.clinicName, row.branch, row.designation].join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [entries, search, status])

  const totalPages = Math.max(1, Math.ceil(filteredList.length / limit))

  const paginatedData = useMemo(() => {
    const safePage = Math.min(page, totalPages)
    const startIndex = (safePage - 1) * limit
    return filteredList.slice(startIndex, startIndex + limit)
  }, [filteredList, page, limit, totalPages])

  const handleSearch = (value: string) => setParams({ search: value, page: 1 })
  const handleStatusFilter = (value: string) => setParams({ status: value, page: 1 })
  const handlePageChange = (newPage: number) => setParams({ page: newPage })
  const handleItemsPerPageChange = (newLimit: number) => setParams({ limit: newLimit, page: 1 })

  const handleOpenDetails = useCallback((row: DoctorEntry) => {
    setDetailsEntry(row)
    setDetailsOpen(true)
  }, [])

  const handleOpenCreate = () => {
    setAddEditMode('create')
    setEditingEntry(null)
    setAddEditOpen(true)
  }

  const handleOpenEdit = useCallback((row: DoctorEntry) => {
    setAddEditMode('edit')
    setEditingEntry(row)
    setAddEditOpen(true)
  }, [])

  const handleSave = useCallback(
    (payload: { clinicName: string; branch: string; designation: string; status: DoctorStatus }) => {
      if (addEditMode === 'create') {
        const now = new Date().toISOString()
        const entry: DoctorEntry = {
          id: `dr-${Date.now()}`,
          clinicName: payload.clinicName,
          branch: payload.branch,
          designation: payload.designation,
          status: payload.status,
          joinDate: now,
        }
        setEntries((prev) => [entry, ...prev])
        return
      }

      if (!editingEntry) return
      setEntries((prev) =>
        prev.map((e) =>
          e.id === editingEntry.id
            ? {
                ...e,
                clinicName: payload.clinicName,
                branch: payload.branch,
                designation: payload.designation,
                status: payload.status,
              }
            : e
        )
      )
    },
    [addEditMode, editingEntry]
  )

  const handleAskDelete = useCallback((row: DoctorEntry) => {
    setDeleteEntry(row)
    setDeleteOpen(true)
  }, [])

  const handleConfirmDelete = async () => {
    if (!deleteEntry) return
    setDeleting(true)
    try {
      await new Promise((r) => setTimeout(r, 350))
      setEntries((prev) => prev.filter((e) => e.id !== deleteEntry.id))
    } finally {
      setDeleting(false)
    }
  }

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
            <h1 className="text-xl font-bold text-slate-800 shrink-0">Doctors manage</h1>
            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
              <SearchInput
                value={search}
                onChange={handleSearch}
                placeholder="Search here"
                className="w-full min-w-0 sm:max-w-md lg:max-w-xl"
                inputClassName="h-11 rounded-xl border-slate-200 bg-white shadow-sm"
              />
              <Select value={status} onValueChange={handleStatusFilter}>
                <SelectTrigger className="h-11 w-full shrink-0 rounded-xl border-slate-200 bg-white shadow-sm sm:w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {DOCTOR_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                className="h-11 shrink-0 rounded-xl bg-[#1A2B4C] px-4 text-white hover:bg-[#152238]"
                onClick={handleOpenCreate}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Doctor
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <CardContent className="p-0">
          <DoctorsTable rows={paginatedData} onInfo={handleOpenDetails} onEdit={handleOpenEdit} onDelete={handleAskDelete} />

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

      <DoctorDetailsModal
        entry={detailsEntry}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setDetailsEntry(null)
        }}
      />

      <AddEditDoctorModal
        open={addEditOpen}
        onClose={() => setAddEditOpen(false)}
        mode={addEditMode}
        entry={editingEntry}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete doctor"
        description={
          deleteEntry
            ? `Are you sure you want to delete ${deleteEntry.designation} (${deleteEntry.clinicName})?`
            : 'Are you sure you want to delete this doctor?'
        }
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onSuccess={() => {
          setDeleteOpen(false)
          setDeleteEntry(null)
        }}
      />
    </motion.div>
  )
}

