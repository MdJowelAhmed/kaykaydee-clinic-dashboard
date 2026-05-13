import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Copy, Download, FileText, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { ModalWrapper } from '@/components/common/ModalWrapper'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { ImageUploader } from '@/components/common/ImageUploader'
import { useAppSelector } from '@/redux/hooks'
import { formatDate } from '@/utils/formatters'
import type { ClientListEntry } from '../types'

interface ClientDocumentRow {
  id: string
  fileName: string
  doctorName: string
  dateIso: string
  uploadBy: string
  uploadFile: File | null
}

interface DocumentFormValues {
  fileName: string
  doctorName: string
  uploadFile: File | null
}

const initialForm: DocumentFormValues = {
  fileName: '',
  doctorName: '',
  uploadFile: null,
}

function AddEditClientDocumentModal({
  open,
  mode,
  row,
  onClose,
  onSave,
}: {
  open: boolean
  mode: 'create' | 'edit'
  row: ClientDocumentRow | null
  onClose: () => void
  onSave: (payload: DocumentFormValues) => void
}) {
  const [form, setForm] = useState<DocumentFormValues>(initialForm)

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && row) {
      setForm({
        fileName: row.fileName,
        doctorName: row.doctorName,
        uploadFile: null,
      })
      return
    }
    setForm(initialForm)
  }, [mode, open, row])

  const setField = <K extends keyof DocumentFormValues>(key: K, value: DocumentFormValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSave(form)
    onClose()
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Add document' : 'Edit document'}
      description="Upload and manage client document"
      size="lg"
      className="bg-card"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Document name</Label>
            <Input value={form.fileName} onChange={(e) => setField('fileName', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Doctor name</Label>
            <Input value={form.doctorName} onChange={(e) => setField('doctorName', e.target.value)} required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Document Upload</Label>
            <ImageUploader
              value={form.uploadFile}
              onChange={(file) => setField('uploadFile', file)}
              emptyTitle="Drag & drop or click to upload document"
              emptyDescription={<span className="text-xs text-muted-foreground">Upload file for this client</span>}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-secondary text-white hover:bg-secondary/90">
            {mode === 'create' ? 'Add Document' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}

export function ClientDocumentsTab({ client }: { client: ClientListEntry }) {
  const { user } = useAppSelector((state) => state.auth)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 10
  const [rows, setRows] = useState<ClientDocumentRow[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editing, setEditing] = useState<ClientDocumentRow | null>(null)
  const [deleteRow, setDeleteRow] = useState<ClientDocumentRow | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const uploadedBy = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email
    : 'Unknown User'

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) =>
      [row.fileName, row.doctorName, row.uploadBy].join(' ').toLowerCase().includes(q)
    )
  }, [rows, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
  const paginated = useMemo(() => {
    const safePage = Math.min(page, totalPages)
    const start = (safePage - 1) * limit
    return filtered.slice(start, start + limit)
  }, [filtered, page, totalPages])

  const handleSave = (payload: DocumentFormValues) => {
    const fileName = payload.uploadFile?.name?.trim() || payload.fileName
    if (modalMode === 'create') {
      const row: ClientDocumentRow = {
        id: `client-doc-${Date.now()}`,
        fileName,
        doctorName: payload.doctorName,
        dateIso: new Date().toISOString(),
        uploadBy: `Upload by ${uploadedBy}`,
        uploadFile: payload.uploadFile,
      }
      setRows((prev) => [row, ...prev])
      setPage(1)
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
              doctorName: payload.doctorName,
              uploadFile: payload.uploadFile ?? row.uploadFile,
            }
          : row
      )
    )
    toast.success('Document updated')
  }

  return (
    <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <CardContent className="p-4 text-card-foreground">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-accent">Client Documents</h3>
            <p className="text-sm text-muted-foreground">{client.patientName}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value)
                setPage(1)
              }}
              placeholder="Search documents"
              className="w-full sm:w-[320px]"
            />
            <Button
              type="button"
              onClick={() => {
                setModalMode('create')
                setEditing(null)
                setModalOpen(true)
              }}
              className="h-11 rounded-xl bg-secondary px-4 text-white hover:bg-secondary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Document
            </Button>
          </div>
        </div>

        <div className="w-full overflow-x-auto scrollbar-thin rounded-b-2xl">
          <table className="w-full min-w-[840px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="rounded-l-full border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">
                  Document
                </th>
                <th className="border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">
                  Doctor
                </th>
                <th className="border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">
                  Date
                </th>
                <th className="border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">
                  Upload By
                </th>
                <th className="rounded-r-full border-b border-border bg-[#E9EBF0] px-4 py-3 text-right text-sm font-semibold text-accent">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-card text-accent-foreground">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="border-b border-border px-6 py-10 text-center text-sm text-accent">
                    No documents found
                  </td>
                </tr>
              ) : (
                paginated.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(0.02 * index, 0.25) }}
                    className="transition-colors hover:bg-muted/15"
                  >
                    <td className="border-b border-border px-4 py-3 text-sm text-accent">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span>{row.fileName}</span>
                      </div>
                    </td>
                    <td className="border-b border-border px-4 py-3 text-sm text-accent">{row.doctorName}</td>
                    <td className="border-b border-border px-4 py-3 text-sm text-accent">
                      {formatDate(row.dateIso, 'd MMM yyyy')}
                    </td>
                    <td className="border-b border-border px-4 py-3 text-sm text-accent">{row.uploadBy}</td>
                    <td className="border-b border-border px-4 py-3 text-sm text-accent">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full text-accent hover:bg-muted"
                          onClick={async () => {
                            await navigator.clipboard.writeText(row.fileName)
                            toast.success('Document name copied')
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full text-cyan-500 hover:bg-cyan-500/10"
                          onClick={() => toast.success(`Downloading ${row.fileName}...`)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full text-accent hover:bg-muted"
                          onClick={() => {
                            setModalMode('edit')
                            setEditing(row)
                            setModalOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted"
                          onClick={() => {
                            setDeleteRow(row)
                            setDeleteOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border px-4 sm:px-6">
          <Pagination
            variant="minimal"
            showItemsPerPage={false}
            currentPage={Math.min(page, totalPages)}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={limit}
            onPageChange={setPage}
          />
        </div>
      </CardContent>

      <AddEditClientDocumentModal
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
        onConfirm={async () => {
          if (!deleteRow) return
          setRows((prev) => prev.filter((row) => row.id !== deleteRow.id))
        }}
        onSuccess={() => {
          setDeleteOpen(false)
          setDeleteRow(null)
          toast.success('Document deleted')
        }}
        title="Delete document"
        description={
          deleteRow
            ? `Are you sure you want to delete ${deleteRow.fileName}?`
            : 'Are you sure you want to delete this document?'
        }
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </Card>
  )
}
