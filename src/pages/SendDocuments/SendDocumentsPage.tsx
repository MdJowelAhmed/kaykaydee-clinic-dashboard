import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import { Paperclip, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUrlParams } from '@/hooks/useUrlState'
import { formatDate } from '@/utils/formatters'
import { cn } from '@/utils/cn'

const REPORT_TYPES = ['MRI Review', 'X-Ray', 'Progress note', 'Lab result', 'Discharge summary'] as const
const REPORT_NUMBERS = ['R-2026-001', 'R-2026-002', 'R-2026-003', 'R-2026-004'] as const

type SendTab = 'clients' | 'doctors' | 'branch'

function isSendTab(v: string): v is SendTab {
  return v === 'clients' || v === 'doctors' || v === 'branch'
}

export default function SendDocumentsPage() {
  const { getParam, setParams } = useUrlParams()
  const rawTab = getParam('tab', 'clients')
  const tab: SendTab = isSendTab(rawTab) ? rawTab : 'clients'

  const [sendAll, setSendAll] = useState(false)
  const [attachmentName, setAttachmentName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [clientsForm, setClientsForm] = useState({
    to: '',
    patientName: '',
    patientId: '',
    reportType: '',
    reportNo: '',
  })
  const [doctorsForm, setDoctorsForm] = useState({
    to: '',
    subject: '',
  })
  const [branchForm, setBranchForm] = useState({
    to: '',
    patientName: '',
    patientId: '',
    reportType: '',
    reportNo: '',
  })
  const [note, setNote] = useState('')

  const headerDate = formatDate(new Date().toISOString(), 'd, MMM yyyy')

  const setTab = (next: string) => {
    if (isSendTab(next)) setParams({ tab: next })
  }

  useEffect(() => {
    setSendAll(false)
  }, [tab])

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setAttachmentName(file ? file.name : null)
    e.target.value = ''
  }, [])

  const handleSend = () => {
    const targetLabel =
      tab === 'clients' ? 'client(s)' : tab === 'doctors' ? 'doctor(s)' : 'branch(es)'
    if (!sendAll) {
      if (tab === 'doctors') {
        if (!doctorsForm.to.trim()) {
          toast.error('Add a recipient or choose All')
          return
        }
      } else if (tab === 'clients') {
        if (!clientsForm.to.trim()) {
          toast.error('Add a recipient or choose All')
          return
        }
      } else if (!branchForm.to.trim()) {
        toast.error('Add a recipient or choose All')
        return
      }
    }
    toast.success(`Document send queued for ${sendAll ? 'all ' : ''}${targetLabel}`)
    setNote('')
    setAttachmentName(null)
    setSendAll(false)
  }

  const tabListClass =
    'flex h-auto min-h-11 w-full flex-wrap gap-1 rounded-xl border border-border bg-muted/25 p-1.5'
  const tabTriggerClass =
    'rounded-lg px-4 py-2 text-sm font-medium text-accent transition-colors data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-none'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-accent sm:text-2xl">Send Documents</h1>
          <p className="text-sm text-muted-foreground">Manage Documents of your system</p>
        </div>
        <p className="text-sm font-medium text-accent sm:pt-1">{headerDate}</p>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            The Straight Leg Raise (SLR) is one of the most commonly prescribed physiotherapy exercises
            for lower back and sciatic pain assessment.
          </p>

          <Tabs value={tab} onValueChange={setTab} className="w-full space-y-6">
            <TabsList className={tabListClass}>
              <TabsTrigger value="clients" className={tabTriggerClass}>
                Clients
              </TabsTrigger>
              <TabsTrigger value="doctors" className={tabTriggerClass}>
                Doctors
              </TabsTrigger>
              <TabsTrigger value="branch" className={tabTriggerClass}>
                Branch
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clients" className="mt-0 space-y-4 outline-none">
              <RecipientRow
                label="To"
                placeholder="Add client"
                value={clientsForm.to}
                onChange={(to) => setClientsForm((s) => ({ ...s, to }))}
                sendAll={sendAll}
                onToggleAll={() => setSendAll((a) => !a)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Patient Name"
                  value={clientsForm.patientName}
                  onChange={(v) => setClientsForm((s) => ({ ...s, patientName: v }))}
                />
                <Field
                  label="Patient ID"
                  value={clientsForm.patientId}
                  onChange={(v) => setClientsForm((s) => ({ ...s, patientId: v }))}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Report Type"
                  value={clientsForm.reportType}
                  onChange={(v) => setClientsForm((s) => ({ ...s, reportType: v }))}
                  options={REPORT_TYPES}
                />
                <SelectField
                  label="Report no"
                  value={clientsForm.reportNo}
                  onChange={(v) => setClientsForm((s) => ({ ...s, reportNo: v }))}
                  options={REPORT_NUMBERS}
                />
              </div>
            </TabsContent>

            <TabsContent value="doctors" className="mt-0 space-y-4 outline-none">
              <RecipientRow
                label="To"
                placeholder="Add doctor"
                value={doctorsForm.to}
                onChange={(to) => setDoctorsForm((s) => ({ ...s, to }))}
                sendAll={sendAll}
                onToggleAll={() => setSendAll((a) => !a)}
              />
              <div className="space-y-2">
                <Label className="text-sm text-accent">Subject</Label>
                <Input
                  value={doctorsForm.subject}
                  onChange={(e) => setDoctorsForm((s) => ({ ...s, subject: e.target.value }))}
                  placeholder="Include message topic"
                  className="h-11 rounded-xl border-border bg-background"
                />
              </div>
            </TabsContent>

            <TabsContent value="branch" className="mt-0 space-y-4 outline-none">
              <RecipientRow
                label="To"
                placeholder="Add Branch"
                value={branchForm.to}
                onChange={(to) => setBranchForm((s) => ({ ...s, to }))}
                sendAll={sendAll}
                onToggleAll={() => setSendAll((a) => !a)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Patient Name"
                  value={branchForm.patientName}
                  onChange={(v) => setBranchForm((s) => ({ ...s, patientName: v }))}
                />
                <Field
                  label="Patient ID"
                  value={branchForm.patientId}
                  onChange={(v) => setBranchForm((s) => ({ ...s, patientId: v }))}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Report Type"
                  value={branchForm.reportType}
                  onChange={(v) => setBranchForm((s) => ({ ...s, reportType: v }))}
                  options={REPORT_TYPES}
                />
                <SelectField
                  label="Report no"
                  value={branchForm.reportNo}
                  onChange={(v) => setBranchForm((s) => ({ ...s, reportNo: v }))}
                  options={REPORT_NUMBERS}
                />
              </div>
            </TabsContent>

            <div className="space-y-2 border-t border-border pt-6">
              <Label className="text-sm text-accent">Attachments</Label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="sr-only"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="gap-2 rounded-lg"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                  Attach file
                </Button>
                <span className="text-xs text-muted-foreground">
                  {attachmentName ?? 'PDF, DOC, or image'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-accent">Note</Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write a note for recipients…"
                className="min-h-[120px] rounded-xl border-border bg-background resize-y"
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">Confirm changes of this message</p>
              <Button
                type="button"
                onClick={handleSend}
                className="h-11 gap-2 rounded-xl bg-secondary px-6 text-white hover:bg-secondary/90 sm:shrink-0"
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function RecipientRow({
  label,
  placeholder,
  value,
  onChange,
  sendAll,
  onToggleAll,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  sendAll: boolean
  onToggleAll: () => void
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm text-accent">{label} :</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleAll}
            className={cn(
              'h-8 rounded-md border-violet-200 px-3 text-xs font-medium text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-300 dark:hover:bg-violet-950/40',
              sendAll && 'bg-violet-100 dark:bg-violet-950/60'
            )}
          >
            All
          </Button>
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={sendAll}
          className="h-11 rounded-xl border-border bg-background"
        />
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-accent">{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Include message topic"
        className="h-11 rounded-xl border-border bg-background"
      />
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: readonly string[]
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-accent">{label}</Label>
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger className="h-11 rounded-xl border-border bg-background">
          <SelectValue placeholder="Include message topic" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
