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

const schema = z.object({
  service: z.string().min(1, 'Service is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  patientId: z.string().min(1, 'Patient ID is required'),
  contactNo: z.string().min(1, 'Contact is required'),
  doctor: z.string().min(1, 'Doctor is required'),
  roomNo: z.string().min(1, 'Room is required'),
  price: z.coerce.number().positive('Price must be positive'),
  appointmentAt: z.string().min(1, 'Date and time is required'),
  status: z.enum(['completed', 'pending', 'cancelled']),
})

type FormValues = z.infer<typeof schema>

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancel' },
]

interface AddAppointmentModalProps {
  open: boolean
  onClose: () => void
  serviceOptions: { value: string; label: string }[]
  doctorOptions: { value: string; label: string }[]
  existingEntries: WaitingListEntry[]
  onCreated: (entry: WaitingListEntry) => void
}

function nextSerialNo(existing: WaitingListEntry[]): string {
  const nums = existing
    .map((e) => parseInt(e.serialNo, 10))
    .filter((n) => !Number.isNaN(n))
  const max = nums.length ? Math.max(...nums) : 265800
  return String(max + 1)
}

export function AddAppointmentModal({
  open,
  onClose,
  serviceOptions,
  doctorOptions,
  existingEntries,
  onCreated,
}: AddAppointmentModalProps) {
  const serviceFieldOptions = serviceOptions.filter((o) => o.value !== 'all')
  const doctorFieldOptions = doctorOptions.filter((o) => o.value !== 'all')

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
      doctor: '',
      roomNo: '',
      price: 500,
      appointmentAt: '',
      status: 'pending',
    },
  })

  const statusVal = watch('status') as WaitingListStatus

  useEffect(() => {
    if (!open) return
    reset({
      service: serviceFieldOptions[0]?.value ?? '',
      patientName: '',
      patientId: '',
      contactNo: '',
      doctor: doctorFieldOptions[0]?.value ?? '',
      roomNo: '',
      price: 500,
      appointmentAt: '',
      status: 'pending',
    })
  }, [open, reset, serviceOptions, doctorOptions])

  const onSubmit = handleSubmit((values) => {
    const iso = new Date(values.appointmentAt).toISOString()
    const entry: WaitingListEntry = {
      id: `wl-new-${Date.now()}`,
      serialNo: nextSerialNo(existingEntries),
      service: values.service,
      patientName: values.patientName,
      patientId: values.patientId,
      contactNo: values.contactNo,
      doctor: values.doctor,
      appointmentAt: iso,
      roomNo: values.roomNo,
      price: values.price,
      status: values.status,
    }
    onCreated(entry)
    toast.success('Appointment added')
    onClose()
  })

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Add appointment"
      description="Create a new waiting list entry."
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
            label="Doctor"
            value={watch('doctor')}
            options={doctorFieldOptions}
            onChange={(v) => setValue('doctor', v, { shouldValidate: true })}
            placeholder="Select doctor"
            error={errors.doctor?.message}
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
            label="Room no"
            {...register('roomNo')}
            error={errors.roomNo?.message}
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
          <FormInput
            label="Appointment date & time"
            type="datetime-local"
            {...register('appointmentAt')}
            error={errors.appointmentAt?.message}
            required
          />
          <div className="sm:col-span-2">
            <FormSelect
              label="Status"
              value={statusVal}
              options={statusOptions}
              onChange={(v) =>
                setValue('status', v as WaitingListStatus, { shouldValidate: true })
              }
              error={errors.status?.message}
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-slate-900 hover:bg-slate-800">
            Save appointment
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
