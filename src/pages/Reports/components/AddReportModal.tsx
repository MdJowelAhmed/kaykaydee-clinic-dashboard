import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ModalWrapper } from '@/components/common/ModalWrapper'
import { FormInput } from '@/components/common/Form/FormInput'
import { FormSelect } from '@/components/common/Form/FormSelect'
import { Button } from '@/components/ui/button'
import type { ReportEntry, ReportStatus } from '../types'

const schema = z.object({
  service: z.string().min(1, 'Service is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  patientId: z.string().min(1, 'Patient ID is required'),
  contactNo: z.string().min(1, 'Contact is required'),
  reportBy: z.string().min(1, 'Report by is required'),
  internalDocId: z.string().min(1, 'ID no is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  dateline: z.string().min(1, 'Dateline is required'),
  price: z.coerce.number().positive('Price must be positive'),
  status: z.enum(['completed', 'in_queue', 'assigned']),
})

type FormValues = z.infer<typeof schema>

const statusOptions = [
  { value: 'completed', label: 'Completed' },
  { value: 'in_queue', label: 'In Queue' },
  { value: 'assigned', label: 'Assigned' },
]

interface AddReportModalProps {
  open: boolean
  onClose: () => void
  serviceOptions: { value: string; label: string }[]
  reportByOptions: { value: string; label: string }[]
  existingEntries: ReportEntry[]
  onCreated: (entry: ReportEntry) => void
}

function nextReportNo(existing: ReportEntry[]): string {
  const nums = existing.map((e) => parseInt(e.reportNo, 10)).filter((n) => !Number.isNaN(n))
  const max = nums.length ? Math.max(...nums) : 265800
  return String(max + 1)
}

export function AddReportModal({
  open,
  onClose,
  serviceOptions,
  reportByOptions,
  existingEntries,
  onCreated,
}: AddReportModalProps) {
  const serviceFieldOptions = serviceOptions.filter((o) => o.value !== 'all')
  const reportByFieldOptions = reportByOptions.filter((o) => o.value !== 'all')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      service: '',
      patientName: '',
      patientId: '',
      contactNo: '',
      reportBy: '',
      internalDocId: '',
      issueDate: '',
      dateline: '',
      price: 500,
      status: 'in_queue',
    },
  })

  const statusVal = watch('status') as ReportStatus

  useEffect(() => {
    if (!open) return
    const today = new Date()
    const local = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10)
    const deadline = new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000)
    const localDeadline = new Date(deadline.getTime() - deadline.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10)
    reset({
      service: serviceFieldOptions[0]?.value ?? '',
      patientName: '',
      patientId: '',
      contactNo: '',
      reportBy: reportByFieldOptions[0]?.value ?? '',
      internalDocId: '',
      issueDate: local,
      dateline: localDeadline,
      price: 500,
      status: 'in_queue',
    })
  }, [open, reset, serviceOptions, reportByOptions])

  const onSubmit = handleSubmit((values) => {
    const issueIso = new Date(`${values.issueDate}T12:00:00`).toISOString()
    const datelineIso = new Date(`${values.dateline}T12:00:00`).toISOString()
    const entry: ReportEntry = {
      id: `rp-new-${Date.now()}`,
      reportNo: nextReportNo(existingEntries),
      service: values.service,
      patientName: values.patientName,
      patientId: values.patientId,
      contactNo: values.contactNo,
      reportBy: values.reportBy,
      internalDocId: values.internalDocId,
      issueDate: issueIso,
      dateline: datelineIso,
      price: values.price,
      status: values.status,
    }
    onCreated(entry)
    toast.success('Report added')
    onClose()
  })

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Add report"
      description="Create a new report entry."
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormSelect
            label="Service"
            value={watch('service')}
            options={serviceFieldOptions}
            onChange={(v) => setValue('service', v, { shouldValidate: true })}
            placeholder="Select service"
            error={errors.service?.message}
            required
          />
          <FormSelect
            label="Report by"
            value={watch('reportBy')}
            options={reportByFieldOptions}
            onChange={(v) => setValue('reportBy', v, { shouldValidate: true })}
            placeholder="Select"
            error={errors.reportBy?.message}
            required
          />
          <FormInput
            label="Patient name"
            {...register('patientName')}
            error={errors.patientName?.message}
            required
          />
          <FormInput
            label="Patient ID"
            {...register('patientId')}
            error={errors.patientId?.message}
            required
          />
          <FormInput
            label="Contact no"
            {...register('contactNo')}
            error={errors.contactNo?.message}
            required
          />
          <FormInput
            label="ID no"
            {...register('internalDocId')}
            error={errors.internalDocId?.message}
            required
          />
          <FormInput
            label="Issue date"
            type="date"
            {...register('issueDate')}
            error={errors.issueDate?.message}
            required
          />
          <FormInput
            label="Dateline"
            type="date"
            {...register('dateline')}
            error={errors.dateline?.message}
            required
          />
          <FormInput
            label="Price"
            type="number"
            step="0.01"
            min={0}
            {...register('price')}
            error={errors.price?.message}
            required
          />
          <div className="sm:col-span-2">
            <FormSelect
              label="Status"
              value={statusVal}
              options={statusOptions}
              onChange={(v) => setValue('status', v as ReportStatus, { shouldValidate: true })}
              error={errors.status?.message}
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-[#1A2B4C] text-white hover:bg-[#152238]"
          >
            Save report
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
