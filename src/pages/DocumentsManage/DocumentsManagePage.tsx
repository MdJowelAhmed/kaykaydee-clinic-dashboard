import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useUrlParams } from '@/hooks/useUrlState'
import { useAppSelector } from '@/redux/hooks'
import { DATE_FILTER_OPTIONS, INITIAL_DOCUMENTS } from './documentsData'
import { DocumentsTable } from './components/DocumentsTable'
import { AddEditDocumentModal } from './components/AddEditDocumentModal'
import type { DocumentFormValues, DocumentRow } from './types'

export default function DocumentsManagePage() {
  const { getParam, getNumberParam, setParams } = useUrlParams()
  const { user } = useAppSelector((state) => state.auth)

  const search = getParam('search', '')
  const date = getParam('date', 'all')
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 15)

  const [rows, setRows] = useState<DocumentRow[]>(INITIAL_DOCUMENTS)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editing, setEditing] = useState<DocumentRow | null>(null)
  const [deleteRow, setDeleteRow] = useState<DocumentRow | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const uploadedBy = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email
    : 'Unknown User'

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter((row) => {
      if (date !== 'all' && !row.dateIso.startsWith(date)) return false
      if (!q) return true
      const hay = [
        row.fileName,
        row.patientName,
        row.patientId,
        row.doctorName,
        row.doctorId,
        row.moderator,
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [rows, search, date])

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
  const paginated = useMemo(() => {
    const safePage = Math.min(page, totalPages)
    const start = (safePage - 1) * limit
    return filtered.slice(start, start + limit)
  }, [filtered, page, limit, totalPages])

  const openCreate = () => {
    setModalMode('create')
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (row: DocumentRow) => {
    setModalMode('edit')
    setEditing(row)
    setModalOpen(true)
  }

  const handleSave = (payload: DocumentFormValues) => {
    const fileName = payload.uploadFile?.name?.trim() || payload.fileName

    if (modalMode === 'create') {
      const newRow: DocumentRow = {
        id: `doc-${Date.now()}`,
        fileName,
        patientName: payload.patientName,
        patientId: payload.patientId,
        doctorName: payload.doctorName,
        doctorId: payload.doctorId,
        status: payload.status,
        dateIso: new Date().toISOString(),
        moderator: `Upload by ${uploadedBy}`,
      }
      setRows((prev) => [newRow, ...prev])
      setParams({ page: 1 })
      toast.success('Document added')
      return
    }

    if (!editing) return
    setRows((prev) =>
      prev.map((row) =>
        row.id === editing.id
          ? {
              ...row,
              fileName,
              patientName: payload.patientName,
              patientId: payload.patientId,
              doctorName: payload.doctorName,
              doctorId: payload.doctorId,
              status: payload.status,
            }
          : row
      )
    )
    toast.success('Document updated')
  }

  const handleCopy = async (row: DocumentRow) => {
    const message = `${row.fileName} | ${row.patientName} (${row.patientId}) | ${row.doctorName} (${row.doctorId})`
    try {
      await navigator.clipboard.writeText(message)
      toast.success('Document details copied')
    } catch {
      toast.error('Copy failed')
    }
  }

  const handleDownload = (row: DocumentRow) => {
    toast.success(`Downloading ${row.fileName}...`)
  }

  const handleConfirmDelete = async () => {
    if (!deleteRow) return
    setRows((prev) => prev.filter((row) => row.id !== deleteRow.id))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-accent sm:text-2xl">Documents</h1>
          <p className="text-sm text-accent">record of all documents</p>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
          <SearchInput
            value={search}
            onChange={(value) => setParams({ search: value, page: 1 })}
            placeholder="Search here"
            className="w-full min-w-0 sm:max-w-md lg:max-w-xl"
            inputClassName="h-11 rounded-xl border-border bg-white dark:bg-background text-accent shadow-sm placeholder:text-muted-foreground"
          />
          <Select value={date} onValueChange={(value) => setParams({ date: value, page: 1 })}>
            <SelectTrigger className="h-11 w-full shrink-0 rounded-xl border-border bg-white text-accent shadow-sm sm:w-[130px]">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              {DATE_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            onClick={openCreate}
            className="h-11 shrink-0 rounded-xl bg-secondary px-4 text-white hover:bg-secondary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Document
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <CardContent className="p-4 text-card-foreground">
          <DocumentsTable
            rows={paginated}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onEdit={openEdit}
            onDelete={(row) => {
              setDeleteRow(row)
              setDeleteOpen(true)
            }}
          />
          <div className="border-t border-border px-4 sm:px-6">
            <Pagination
              variant="minimal"
              showItemsPerPage={false}
              currentPage={Math.min(page, totalPages)}
              totalPages={totalPages}
              totalItems={filtered.length}
              itemsPerPage={limit}
              onPageChange={(nextPage) => setParams({ page: nextPage })}
            />
          </div>
        </CardContent>
      </Card>

      <AddEditDocumentModal
        open={modalOpen}
        mode={modalMode}
        row={editing}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        onSuccess={() => {
          setDeleteOpen(false)
          setDeleteRow(null)
          toast.success('Document deleted')
        }}
        title="Delete document"
        description={
          deleteRow
            ? `Are you sure you want to delete ${deleteRow.fileName} for ${deleteRow.patientName}?`
            : 'Are you sure you want to delete this document?'
        }
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </motion.div>
  )
}
