import { useMemo, useState, type FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { ModalWrapper } from '@/components/common/ModalWrapper'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { formatDate } from '@/utils/formatters'
import type { ClientListEntry } from '../types'

type CommonStatus = 'pending' | 'scheduled' | 'completed'

interface AppointmentRow {
  id: string
  dateIso: string
  doctor: string
  slot: string
  reason: string
  status: CommonStatus
}

interface ReportRow {
  id: string
  dateIso: string
  doctor: string
  reportType: string
  summary: string
  status: CommonStatus
}

interface ExerciseRow {
  id: string
  assignedDateIso: string
  exerciseName: string
  setsReps: string
  assignedBy: string
  status: CommonStatus
}

interface InvoiceRow {
  id: string
  dateIso: string
  invoiceNo: string
  service: string
  amount: string
  status: 'pending' | 'paid' | 'partial'
}

const limit = 8

function statusSelect<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: Array<{ value: T; label: string }>
}) {
  return (
    <Select value={value} onValueChange={(v: T) => onChange(v)}>
      <SelectTrigger className="h-9 w-[130px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function ClientAppointmentsTab({ client }: { client: ClientListEntry }) {
  const [rows, setRows] = useState<AppointmentRow[]>([
    {
      id: `app-${client.id}-1`,
      dateIso: new Date('2026-01-12T10:00:00').toISOString(),
      doctor: 'Dr.APJ Kalam',
      slot: '10:00 AM',
      reason: 'Back pain follow-up',
      status: 'completed',
    },
    {
      id: `app-${client.id}-2`,
      dateIso: new Date('2026-01-24T11:30:00').toISOString(),
      doctor: 'Dr.Rafiq Hasan',
      slot: '11:30 AM',
      reason: 'Posture assessment',
      status: 'scheduled',
    },
  ])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteRow, setDeleteRow] = useState<AppointmentRow | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [dateIso, setDateIso] = useState(new Date().toISOString().slice(0, 10))
  const [doctor, setDoctor] = useState('')
  const [slot, setSlot] = useState('')
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState<CommonStatus>('scheduled')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) => [row.doctor, row.reason, row.slot].join(' ').toLowerCase().includes(q))
  }, [rows, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
  const paginated = useMemo(() => {
    const safe = Math.min(page, totalPages)
    const start = (safe - 1) * limit
    return filtered.slice(start, start + limit)
  }, [filtered, page, totalPages])

  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setRows((prev) => [
      {
        id: `app-${Date.now()}`,
        dateIso: new Date(`${dateIso}T12:00:00`).toISOString(),
        doctor: doctor.trim(),
        slot: slot.trim(),
        reason: reason.trim(),
        status,
      },
      ...prev,
    ])
    setModalOpen(false)
    setDoctor('')
    setSlot('')
    setReason('')
    setStatus('scheduled')
    setDateIso(new Date().toISOString().slice(0, 10))
    setPage(1)
    toast.success('Appointment added')
  }

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm">
      <CardContent className="p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-accent">Appointments</h3>
            <p className="text-sm text-muted-foreground">Appointments taken by {client.patientName}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search appointments" className="w-full sm:w-[300px]" />
            <Button type="button" onClick={() => setModalOpen(true)} className="h-11 rounded-xl bg-secondary px-4 text-white hover:bg-secondary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Appointment
            </Button>
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[840px]">
            <thead>
              <tr>
                <th className="rounded-l-full border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">Date</th>
                <th className="border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">Doctor</th>
                <th className="border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">Slot</th>
                <th className="border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">Reason</th>
                <th className="border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">Status</th>
                <th className="rounded-r-full border-b border-border bg-[#E9EBF0] px-4 py-3 text-right text-sm font-semibold text-accent">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((row) => (
                <tr key={row.id} className="hover:bg-muted/20">
                  <td className="border-b border-border px-4 py-3 text-sm text-accent">{formatDate(row.dateIso, 'd MMM yyyy')}</td>
                  <td className="border-b border-border px-4 py-3 text-sm text-accent">{row.doctor}</td>
                  <td className="border-b border-border px-4 py-3 text-sm text-accent">{row.slot}</td>
                  <td className="border-b border-border px-4 py-3 text-sm text-accent">{row.reason}</td>
                  <td className="border-b border-border px-4 py-3 text-sm">
                    {statusSelect<CommonStatus>({
                      value: row.status,
                      onChange: (next) => setRows((prev) => prev.map((item) => (item.id === row.id ? { ...item, status: next } : item))),
                      options: [
                        { value: 'pending', label: 'Pending' },
                        { value: 'scheduled', label: 'Scheduled' },
                        { value: 'completed', label: 'Completed' },
                      ],
                    })}
                  </td>
                  <td className="border-b border-border px-4 py-3 text-right">
                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted" onClick={() => { setDeleteRow(row); setDeleteOpen(true) }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border px-4 sm:px-6">
          <Pagination variant="minimal" showItemsPerPage={false} currentPage={Math.min(page, totalPages)} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={limit} onPageChange={setPage} />
        </div>
      </CardContent>
      <ModalWrapper open={modalOpen} onClose={() => setModalOpen(false)} title="Add Appointment" size="md" className="bg-card">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="space-y-2"><Label>Date</Label><Input type="date" value={dateIso} onChange={(e) => setDateIso(e.target.value)} required /></div>
          <div className="space-y-2"><Label>Doctor</Label><Input value={doctor} onChange={(e) => setDoctor(e.target.value)} required /></div>
          <div className="space-y-2"><Label>Slot</Label><Input value={slot} onChange={(e) => setSlot(e.target.value)} placeholder="e.g. 10:30 AM" required /></div>
          <div className="space-y-2"><Label>Reason</Label><Input value={reason} onChange={(e) => setReason(e.target.value)} required /></div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v: CommonStatus) => setStatus(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-secondary text-white hover:bg-secondary/90">Save</Button>
          </div>
        </form>
      </ModalWrapper>
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          if (!deleteRow) return
          setRows((prev) => prev.filter((row) => row.id !== deleteRow.id))
        }}
        onSuccess={() => { setDeleteOpen(false); setDeleteRow(null); toast.success('Appointment deleted') }}
        title="Delete appointment"
        description={deleteRow ? `Delete appointment with ${deleteRow.doctor} on ${formatDate(deleteRow.dateIso, 'd MMM yyyy')}?` : 'Delete this appointment?'}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </Card>
  )
}

export function ClientReportsTab({ client }: { client: ClientListEntry }) {
  const [rows, setRows] = useState<ReportRow[]>([
    {
      id: `rep-${client.id}-1`,
      dateIso: new Date('2026-01-10T12:00:00').toISOString(),
      doctor: 'Dr.APJ Kalam',
      reportType: 'MRI Review',
      summary: `${client.patientName} has mild disc bulge at L4-L5.`,
      status: 'completed',
    },
    {
      id: `rep-${client.id}-2`,
      dateIso: new Date('2026-01-18T12:00:00').toISOString(),
      doctor: 'Dr.Rafiq Hasan',
      reportType: 'Pain Assessment',
      summary: 'Pain scale reduced from 8/10 to 5/10.',
      status: 'scheduled',
    },
  ])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteRow, setDeleteRow] = useState<ReportRow | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [doctor, setDoctor] = useState('')
  const [reportType, setReportType] = useState('')
  const [summary, setSummary] = useState('')
  const [dateIso, setDateIso] = useState(new Date().toISOString().slice(0, 10))
  const [status, setStatus] = useState<CommonStatus>('pending')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) => [row.doctor, row.reportType, row.summary].join(' ').toLowerCase().includes(q))
  }, [rows, search])
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
  const paginated = useMemo(() => filtered.slice((Math.min(page, totalPages) - 1) * limit, (Math.min(page, totalPages) - 1) * limit + limit), [filtered, page, totalPages])

  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setRows((prev) => [
      {
        id: `rep-${Date.now()}`,
        dateIso: new Date(`${dateIso}T12:00:00`).toISOString(),
        doctor: doctor.trim(),
        reportType: reportType.trim(),
        summary: summary.trim(),
        status,
      },
      ...prev,
    ])
    setModalOpen(false)
    setDoctor('')
    setReportType('')
    setSummary('')
    setStatus('pending')
    setDateIso(new Date().toISOString().slice(0, 10))
    setPage(1)
    toast.success('Report added')
  }

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm">
      <CardContent className="p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-accent">Dr.'s Reports</h3>
            <p className="text-sm text-muted-foreground">Clinical reports of {client.patientName}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search reports" className="w-full sm:w-[300px]" />
            <Button type="button" onClick={() => setModalOpen(true)} className="h-11 rounded-xl bg-secondary px-4 text-white hover:bg-secondary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Report
            </Button>
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead>
              <tr>
                <th className="rounded-l-full border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">Date</th>
                <th className="border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">Doctor</th>
                <th className="border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">Type</th>
                <th className="border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">Summary</th>
                <th className="border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">Status</th>
                <th className="rounded-r-full border-b border-border bg-[#E9EBF0] px-4 py-3 text-right text-sm font-semibold text-accent">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((row) => (
                <tr key={row.id} className="hover:bg-muted/20">
                  <td className="border-b border-border px-4 py-3 text-sm text-accent">{formatDate(row.dateIso, 'd MMM yyyy')}</td>
                  <td className="border-b border-border px-4 py-3 text-sm text-accent">{row.doctor}</td>
                  <td className="border-b border-border px-4 py-3 text-sm text-accent">{row.reportType}</td>
                  <td className="border-b border-border px-4 py-3 text-sm text-accent">{row.summary}</td>
                  <td className="border-b border-border px-4 py-3 text-sm">
                    {statusSelect<CommonStatus>({
                      value: row.status,
                      onChange: (next) => setRows((prev) => prev.map((item) => (item.id === row.id ? { ...item, status: next } : item))),
                      options: [
                        { value: 'pending', label: 'Pending' },
                        { value: 'scheduled', label: 'Scheduled' },
                        { value: 'completed', label: 'Completed' },
                      ],
                    })}
                  </td>
                  <td className="border-b border-border px-4 py-3 text-right">
                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted" onClick={() => { setDeleteRow(row); setDeleteOpen(true) }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border px-4 sm:px-6">
          <Pagination variant="minimal" showItemsPerPage={false} currentPage={Math.min(page, totalPages)} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={limit} onPageChange={setPage} />
        </div>
      </CardContent>
      <ModalWrapper open={modalOpen} onClose={() => setModalOpen(false)} title="Add Report" size="md" className="bg-card">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="space-y-2"><Label>Date</Label><Input type="date" value={dateIso} onChange={(e) => setDateIso(e.target.value)} required /></div>
          <div className="space-y-2"><Label>Doctor</Label><Input value={doctor} onChange={(e) => setDoctor(e.target.value)} required /></div>
          <div className="space-y-2"><Label>Report type</Label><Input value={reportType} onChange={(e) => setReportType(e.target.value)} required /></div>
          <div className="space-y-2"><Label>Summary</Label><Input value={summary} onChange={(e) => setSummary(e.target.value)} required /></div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v: CommonStatus) => setStatus(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit" className="bg-secondary text-white hover:bg-secondary/90">Save</Button></div>
        </form>
      </ModalWrapper>
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          if (!deleteRow) return
          setRows((prev) => prev.filter((row) => row.id !== deleteRow.id))
        }}
        onSuccess={() => { setDeleteOpen(false); setDeleteRow(null); toast.success('Report deleted') }}
        title="Delete report"
        description={deleteRow ? `Delete ${deleteRow.reportType} report?` : 'Delete this report?'}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </Card>
  )
}

export function ClientExercisesTab({ client }: { client: ClientListEntry }) {
  const [rows, setRows] = useState<ExerciseRow[]>([
    {
      id: `ex-${client.id}-1`,
      assignedDateIso: new Date('2026-01-08T12:00:00').toISOString(),
      exerciseName: 'Hamstring Stretch',
      setsReps: '3 sets x 12 reps',
      assignedBy: 'Dr.APJ Kalam',
      status: 'scheduled',
    },
    {
      id: `ex-${client.id}-2`,
      assignedDateIso: new Date('2026-01-15T12:00:00').toISOString(),
      exerciseName: 'Core Stability Plank',
      setsReps: '4 sets x 30 sec',
      assignedBy: 'Dr.Rafiq Hasan',
      status: 'pending',
    },
  ])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteRow, setDeleteRow] = useState<ExerciseRow | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [assignedDateIso, setAssignedDateIso] = useState(new Date().toISOString().slice(0, 10))
  const [exerciseName, setExerciseName] = useState('')
  const [setsReps, setSetsReps] = useState('')
  const [assignedBy, setAssignedBy] = useState('')
  const [status, setStatus] = useState<CommonStatus>('pending')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) => [row.exerciseName, row.assignedBy, row.setsReps].join(' ').toLowerCase().includes(q))
  }, [rows, search])
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
  const paginated = useMemo(() => filtered.slice((Math.min(page, totalPages) - 1) * limit, (Math.min(page, totalPages) - 1) * limit + limit), [filtered, page, totalPages])

  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setRows((prev) => [
      {
        id: `ex-${Date.now()}`,
        assignedDateIso: new Date(`${assignedDateIso}T12:00:00`).toISOString(),
        exerciseName: exerciseName.trim(),
        setsReps: setsReps.trim(),
        assignedBy: assignedBy.trim(),
        status,
      },
      ...prev,
    ])
    setModalOpen(false)
    setExerciseName('')
    setSetsReps('')
    setAssignedBy('')
    setStatus('pending')
    setAssignedDateIso(new Date().toISOString().slice(0, 10))
    setPage(1)
    toast.success('Exercise assigned')
  }

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm">
      <CardContent className="p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-accent">Exercises</h3>
            <p className="text-sm text-muted-foreground">Exercises assigned by doctors for {client.patientName}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search exercises" className="w-full sm:w-[300px]" />
            <Button type="button" onClick={() => setModalOpen(true)} className="h-11 rounded-xl bg-secondary px-4 text-white hover:bg-secondary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead>
              <tr>
                <th className="rounded-l-full border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">Assigned Date</th>
                <th className="border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">Exercise</th>
                <th className="border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">Sets/Reps</th>
                <th className="border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">Assigned By</th>
                <th className="border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">Status</th>
                <th className="rounded-r-full border-b border-border bg-[#E9EBF0] px-4 py-3 text-right text-sm font-semibold text-accent">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((row) => (
                <tr key={row.id} className="hover:bg-muted/20">
                  <td className="border-b border-border px-4 py-3 text-sm text-accent">{formatDate(row.assignedDateIso, 'd MMM yyyy')}</td>
                  <td className="border-b border-border px-4 py-3 text-sm text-accent">{row.exerciseName}</td>
                  <td className="border-b border-border px-4 py-3 text-sm text-accent">{row.setsReps}</td>
                  <td className="border-b border-border px-4 py-3 text-sm text-accent">{row.assignedBy}</td>
                  <td className="border-b border-border px-4 py-3 text-sm">
                    {statusSelect<CommonStatus>({
                      value: row.status,
                      onChange: (next) => setRows((prev) => prev.map((item) => (item.id === row.id ? { ...item, status: next } : item))),
                      options: [
                        { value: 'pending', label: 'Pending' },
                        { value: 'scheduled', label: 'Scheduled' },
                        { value: 'completed', label: 'Completed' },
                      ],
                    })}
                  </td>
                  <td className="border-b border-border px-4 py-3 text-right">
                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted" onClick={() => { setDeleteRow(row); setDeleteOpen(true) }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border px-4 sm:px-6">
          <Pagination variant="minimal" showItemsPerPage={false} currentPage={Math.min(page, totalPages)} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={limit} onPageChange={setPage} />
        </div>
      </CardContent>
      <ModalWrapper open={modalOpen} onClose={() => setModalOpen(false)} title="Add Exercise" size="md" className="bg-card">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="space-y-2"><Label>Assigned date</Label><Input type="date" value={assignedDateIso} onChange={(e) => setAssignedDateIso(e.target.value)} required /></div>
          <div className="space-y-2"><Label>Exercise name</Label><Input value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} required /></div>
          <div className="space-y-2"><Label>Sets / reps</Label><Input value={setsReps} onChange={(e) => setSetsReps(e.target.value)} placeholder="e.g. 3 sets x 12 reps" required /></div>
          <div className="space-y-2"><Label>Assigned by</Label><Input value={assignedBy} onChange={(e) => setAssignedBy(e.target.value)} required /></div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v: CommonStatus) => setStatus(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit" className="bg-secondary text-white hover:bg-secondary/90">Save</Button></div>
        </form>
      </ModalWrapper>
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          if (!deleteRow) return
          setRows((prev) => prev.filter((row) => row.id !== deleteRow.id))
        }}
        onSuccess={() => { setDeleteOpen(false); setDeleteRow(null); toast.success('Exercise deleted') }}
        title="Delete exercise"
        description={deleteRow ? `Delete ${deleteRow.exerciseName}?` : 'Delete this exercise?'}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </Card>
  )
}

export function ClientInvoiceTab({ client }: { client: ClientListEntry }) {
  const [rows, setRows] = useState<InvoiceRow[]>([
    {
      id: `inv-${client.id}-1`,
      dateIso: new Date('2026-01-13T12:00:00').toISOString(),
      invoiceNo: 'INV-10021',
      service: 'Physiotherapy Session',
      amount: '2500',
      status: 'paid',
    },
    {
      id: `inv-${client.id}-2`,
      dateIso: new Date('2026-01-24T12:00:00').toISOString(),
      invoiceNo: 'INV-10033',
      service: 'Rehabilitation Package',
      amount: '4500',
      status: 'partial',
    },
  ])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteRow, setDeleteRow] = useState<InvoiceRow | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) => [row.invoiceNo, row.service, row.amount].join(' ').toLowerCase().includes(q))
  }, [rows, search])
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
  const paginated = useMemo(() => filtered.slice((Math.min(page, totalPages) - 1) * limit, (Math.min(page, totalPages) - 1) * limit + limit), [filtered, page, totalPages])

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm">
      <CardContent className="p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-accent">Invoice</h3>
            <p className="text-sm text-muted-foreground">Billing history of {client.patientName}</p>
          </div>
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search invoice" className="w-full sm:w-[300px]" />
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr>
                <th className="rounded-l-full border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">Date</th>
                <th className="border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">Invoice No</th>
                <th className="border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">Service</th>
                <th className="border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">Amount</th>
                <th className="border-b border-border bg-[#E9EBF0] px-4 py-3 text-left text-sm font-semibold text-accent">Status</th>
                <th className="rounded-r-full border-b border-border bg-[#E9EBF0] px-4 py-3 text-right text-sm font-semibold text-accent">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((row) => (
                <tr key={row.id} className="hover:bg-muted/20">
                  <td className="border-b border-border px-4 py-3 text-sm text-accent">{formatDate(row.dateIso, 'd MMM yyyy')}</td>
                  <td className="border-b border-border px-4 py-3 text-sm text-accent">{row.invoiceNo}</td>
                  <td className="border-b border-border px-4 py-3 text-sm text-accent">{row.service}</td>
                  <td className="border-b border-border px-4 py-3 text-sm text-accent">৳{row.amount}</td>
                  <td className="border-b border-border px-4 py-3 text-sm">
                    {statusSelect<InvoiceRow['status']>({
                      value: row.status,
                      onChange: (next) => setRows((prev) => prev.map((item) => (item.id === row.id ? { ...item, status: next } : item))),
                      options: [
                        { value: 'pending', label: 'Pending' },
                        { value: 'partial', label: 'Partial' },
                        { value: 'paid', label: 'Paid' },
                      ],
                    })}
                  </td>
                  <td className="border-b border-border px-4 py-3 text-right">
                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted" onClick={() => { setDeleteRow(row); setDeleteOpen(true) }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border px-4 sm:px-6">
          <Pagination variant="minimal" showItemsPerPage={false} currentPage={Math.min(page, totalPages)} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={limit} onPageChange={setPage} />
        </div>
      </CardContent>
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          if (!deleteRow) return
          setRows((prev) => prev.filter((row) => row.id !== deleteRow.id))
        }}
        onSuccess={() => { setDeleteOpen(false); setDeleteRow(null); toast.success('Invoice removed') }}
        title="Delete invoice"
        description={deleteRow ? `Delete ${deleteRow.invoiceNo}?` : 'Delete this invoice?'}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </Card>
  )
}
