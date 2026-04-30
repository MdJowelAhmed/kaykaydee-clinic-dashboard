import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Paperclip, Send } from 'lucide-react'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/cn'

export default function ReportsPage() {
  const [tab, setTab] = useState<'clients' | 'doctors' | 'branch'>('branch')
  const todayLabel = useMemo(() => format(new Date(), 'd, MMM yyyy').toLowerCase(), [])

  const [toValue, setToValue] = useState('')
  const [patientName, setPatientName] = useState('')
  const [patientId, setPatientId] = useState('')
  const [reportType, setReportType] = useState('')
  const [reportNo, setReportNo] = useState('')
  const [subject, setSubject] = useState('')
  const [note, setNote] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)

  const isBranch = tab === 'branch'
  const toPlaceholder = isBranch ? 'Add Branch' : tab === 'doctors' ? 'Add Doctors' : 'Add Clients'

  const reportTypeOptions = [
    { value: 'include_message_topic', label: 'Include message topic' },
    { value: 'progress', label: 'Progress report' },
    { value: 'diagnostic', label: 'Diagnostic report' },
  ]
  const reportNoOptions = [
    { value: 'include_message_topic', label: 'Include message topic' },
    { value: 'rpt-1001', label: 'RPT-1001' },
    { value: 'rpt-1002', label: 'RPT-1002' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <Card className="overflow-hidden rounded-2xl border border-border shadow-sm">
        <CardContent className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-accent">Reports</h1>
              <p className="mt-1 text-sm text-muted-foreground">Manage Report of your system</p>
            </div>
            <p className="text-xs text-muted-foreground sm:pt-1">{todayLabel}</p>
          </div>

          <p className="max-w-2xl text-sm text-muted-foreground">
            he Straight Leg Raise (SLR) is one of the most commonly prescribed physiotherapy exercises for
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex w-full max-w-md rounded-full bg-muted/40 p-1">
              {(
                [
                  { id: 'clients', label: 'Clients' },
                  { id: 'doctors', label: 'Doctors' },
                  { id: 'branch', label: 'Branch' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={cn(
                    'flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    tab === t.id ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-accent'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm text-muted-foreground">To :</label>
                <span className="rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
                  All
                </span>
              </div>
              <Input
                value={toValue}
                onChange={(e) => setToValue(e.target.value)}
                placeholder={toPlaceholder}
                className="rounded-xl"
              />
            </div>

            {isBranch ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm text-muted-foreground">Patient Name</label>
                  <Input
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Include message topic"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-muted-foreground">Patient ID</label>
                  <Input
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="Include message topic"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-muted-foreground">Report Type</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="h-11 rounded-xl border-border bg-background text-accent">
                      <SelectValue placeholder="Include message topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-muted-foreground">Report no</label>
                  <Select value={reportNo} onValueChange={setReportNo}>
                    <SelectTrigger className="h-11 rounded-xl border-border bg-background text-accent">
                      <SelectValue placeholder="Include message topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportNoOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Subject</label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Include message topic"
                  className="rounded-xl"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Attachments</label>
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-muted/40 px-4 py-2 text-sm font-medium text-accent hover:bg-muted/50">
                  <Paperclip className="h-4 w-4" />
                  Attach file
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                  />
                </label>
                <p className="text-sm text-muted-foreground">
                  {fileName ? fileName : 'PDF,DOC, or image'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[140px] w-full resize-none rounded-xl border border-border bg-background px-3 py-3 text-sm text-accent outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
              <p className="text-sm text-muted-foreground">Confirm changes of this message</p>
              <Button
                type="button"
                className="h-11 w-full gap-2 rounded-xl bg-secondary px-10 text-white hover:bg-secondary/90 sm:w-auto"
                onClick={() => {
                  /* UI only */
                }}
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
