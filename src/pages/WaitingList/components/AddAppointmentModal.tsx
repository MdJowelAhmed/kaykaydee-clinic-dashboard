import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ModalWrapper } from '@/components/common/ModalWrapper'
import { FormInput } from '@/components/common/Form/FormInput'
import { FormSelect } from '@/components/common/Form/FormSelect'
import { Button } from '@/components/ui/button'
import type { WaitingListEntry, WaitingListStatus } from '../types'
import {
  APPOINTMENT_TYPES,
  ANY_PRACTITIONER,
  PREFERRED_PRACTITIONER_OPTIONS,
} from '../waitingListData'

const schema = z.object({
  patientName: z.string().min(1, 'Client name is required'),
  dob: z.string().optional(),
  address: z.string().optional(),
  contactNo: z.string().min(1, 'Contact number is required'),
  doctor: z.string().min(1, 'Preferred practitioner is required'),
  appointmentType: z.string().min(1, 'Appointment type is required'),
  dateAddedAt: z.string().min(1, 'Date added is required'),
  preferredAppointmentDate: z.string().optional(),
  status: z.enum(['waiting', 'contacted', 'booked', 'cancelled', 'declined']),
})

type FormValues = z.infer<typeof schema>

const statusOptions = [
  { value: 'waiting', label: 'Waiting' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'booked', label: 'Booked' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'declined', label: 'Declined' },
]

const appointmentTypeOptions = APPOINTMENT_TYPES.map((t) => ({ value: t, label: t }))

interface AddAppointmentModalProps {
  open: boolean
  onClose: () => void
  existingEntries: WaitingListEntry[]
  onCreated: (entry: WaitingListEntry) => void
}

function nextSerialNo(existing: WaitingListEntry[]): string {
  const nums = existing.map((e) => parseInt(e.serialNo, 10)).filter((n) => !Number.isNaN(n))
  const max = nums.length ? Math.max(...nums) : 265800
  return String(max + 1)
}

/** YYYY-MM-DD (date input) → ISO; empty → null. */
function dateInputToIso(value?: string): string | null {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

function todayInputValue(): string {
  return new Date().toISOString().slice(0, 10)
}

export function AddAppointmentModal({
  open,
  onClose,
  existingEntries,
  onCreated,
}: AddAppointmentModalProps) {
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
      patientName: '',
      dob: '',
      address: '',
      contactNo: '',
      doctor: ANY_PRACTITIONER,
      appointmentType: APPOINTMENT_TYPES[0],
      dateAddedAt: todayInputValue(),
      preferredAppointmentDate: '',
      status: 'waiting',
    },
  })

  useEffect(() => {
    if (!open) return
    reset({
      patientName: '',
      dob: '',
      address: '',
      contactNo: '',
      doctor: ANY_PRACTITIONER,
      appointmentType: APPOINTMENT_TYPES[0],
      dateAddedAt: todayInputValue(),
      preferredAppointmentDate: '',
      status: 'waiting',
    })
  }, [open, reset])

  const onSubmit = handleSubmit((values) => {
    const dateAddedIso = dateInputToIso(values.dateAddedAt) ?? new Date().toISOString()
    const preferredIso = dateInputToIso(values.preferredAppointmentDate)
    const entry: WaitingListEntry = {
      id: `wl-new-${Date.now()}`,
      serialNo: nextSerialNo(existingEntries),
      patientName: values.patientName,
      dob: dateInputToIso(values.dob) ?? '',
      address: values.address ?? '',
      contactNo: values.contactNo,
      doctor: values.doctor,
      appointmentType: values.appointmentType,
      dateAddedAt: dateAddedIso,
      preferredAppointmentDate: preferredIso,
      status: values.status,
      listRole: 'waitlist',
      waitlistJoinedAt: dateAddedIso,
      slotOffer: null,
      // Internal defaults (not shown in the table).
      appointmentAt: preferredIso ?? dateAddedIso,
      service: 'General',
      patientId: `cl-${Date.now()}`,
      roomNo: 'Rm TBD',
      price: 0,
    }
    onCreated(entry)
    toast.success('Client added to the waitlist')
    onClose()
  })

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Add client to waitlist"
      description="Add a client waiting for an appointment."
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            label="Client name"
            {...register('patientName')}
            error={errors.patientName?.message}
            required
          />
          <FormInput label="Date of birth" type="date" {...register('dob')} error={errors.dob?.message} />
          <div className="sm:col-span-2">
            <FormInput label="Address" {...register('address')} error={errors.address?.message} />
          </div>
          <FormInput
            label="Contact number"
            {...register('contactNo')}
            error={errors.contactNo?.message}
            required
          />
          <FormSelect
            label="Preferred practitioner"
            value={watch('doctor')}
            options={PREFERRED_PRACTITIONER_OPTIONS}
            onChange={(v) => setValue('doctor', v, { shouldValidate: true })}
            placeholder="Select practitioner"
            error={errors.doctor?.message}
            required
          />
          <FormSelect
            label="Appointment type"
            value={watch('appointmentType')}
            options={appointmentTypeOptions}
            onChange={(v) => setValue('appointmentType', v, { shouldValidate: true })}
            placeholder="Select appointment type"
            error={errors.appointmentType?.message}
            required
          />
          <FormInput
            label="Date added to waitlist"
            type="date"
            {...register('dateAddedAt')}
            error={errors.dateAddedAt?.message}
            required
          />
          <FormInput
            label="Preferred appointment date"
            type="date"
            {...register('preferredAppointmentDate')}
            error={errors.preferredAppointmentDate?.message}
          />
          <FormSelect
            label="Status"
            value={watch('status')}
            options={statusOptions}
            onChange={(v) => setValue('status', v as WaitingListStatus, { shouldValidate: true })}
            error={errors.status?.message}
            required
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-slate-900 hover:bg-slate-800">
            Add to waitlist
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
