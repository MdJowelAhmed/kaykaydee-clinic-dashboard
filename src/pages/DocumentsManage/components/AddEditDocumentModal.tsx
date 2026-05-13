import { type FormEvent, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ModalWrapper } from '@/components/common/ModalWrapper'
import { ImageUploader } from '@/components/common/ImageUploader'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { DocumentFormValues, DocumentRow } from '../types'

interface AddEditDocumentModalProps {
  open: boolean
  mode: 'create' | 'edit'
  row: DocumentRow | null
  onClose: () => void
  onSave: (payload: DocumentFormValues) => void
}

const initialForm: DocumentFormValues = {
  fileName: '',
  patientName: '',
  patientId: '',
  doctorName: '',
  doctorId: '',
  status: 'active',
  uploadFile: null,
}

export function AddEditDocumentModal({
  open,
  mode,
  row,
  onClose,
  onSave,
}: AddEditDocumentModalProps) {
  const [form, setForm] = useState<DocumentFormValues>(initialForm)

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && row) {
      setForm({
        fileName: row.fileName,
        patientName: row.patientName,
        patientId: row.patientId,
        doctorName: row.doctorName,
        doctorId: row.doctorId,
        status: row.status,
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
      description={mode === 'create' ? 'Create a new document record' : 'Update this document record'}
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
            <Label>Patient name</Label>
            <Input value={form.patientName} onChange={(e) => setField('patientName', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Patient ID</Label>
            <Input value={form.patientId} onChange={(e) => setField('patientId', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Doctor name</Label>
            <Input value={form.doctorName} onChange={(e) => setField('doctorName', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Doctor ID</Label>
            <Input value={form.doctorId} onChange={(e) => setField('doctorId', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(value: 'active' | 'archived') => setField('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Document Upload</Label>
            <ImageUploader
              value={form.uploadFile}
              onChange={(file) => setField('uploadFile', file)}
              emptyTitle="Drag & drop or click to upload document"
              emptyDescription={<span className="text-xs text-muted-foreground">Upload file for this document</span>}
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
