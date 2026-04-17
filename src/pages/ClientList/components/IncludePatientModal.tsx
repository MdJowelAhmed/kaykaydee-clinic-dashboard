import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ModalWrapper } from '@/components/common/ModalWrapper'
import { FormInput } from '@/components/common/Form/FormInput'
import { Button } from '@/components/ui/button'
import type { ClientListEntry } from '../types'

const schema = z.object({
  patientName: z.string().min(1, 'Patient name is required'),
  contactNo: z.string().min(1, 'Contact is required'),
  email: z.string().email('Valid email is required'),
  address: z.string().min(1, 'Address is required'),
  joinDate: z.string().min(1, 'Join date is required'),
})

type FormValues = z.infer<typeof schema>

interface IncludePatientModalProps {
  open: boolean
  onClose: () => void
  existingEntries: ClientListEntry[]
  onCreated: (entry: ClientListEntry) => void
}

function nextIdNo(existing: ClientListEntry[]): string {
  const nums = existing.map((e) => parseInt(e.idNo, 10)).filter((n) => !Number.isNaN(n))
  const max = nums.length ? Math.max(...nums) : 265800
  return String(max + 1)
}

export function IncludePatientModal({
  open,
  onClose,
  existingEntries,
  onCreated,
}: IncludePatientModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      patientName: '',
      contactNo: '',
      email: '',
      address: '',
      joinDate: '',
    },
  })

  useEffect(() => {
    if (!open) return
    const today = new Date()
    const local = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10)
    reset({
      patientName: '',
      contactNo: '',
      email: '',
      address: '',
      joinDate: local,
    })
  }, [open, reset])

  const onSubmit = handleSubmit((values) => {
    const iso = new Date(`${values.joinDate}T12:00:00`).toISOString()
    const entry: ClientListEntry = {
      id: `cl-new-${Date.now()}`,
      idNo: nextIdNo(existingEntries),
      patientName: values.patientName,
      contactNo: values.contactNo,
      email: values.email,
      joinDate: iso,
      address: values.address,
    }
    onCreated(entry)
    toast.success('Patient included')
    onClose()
  })

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Include patient"
      description="Add a new client to the list."
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            label="Patient name"
            {...register('patientName')}
            error={errors.patientName?.message}
            required
          />
          <FormInput
            label="Contact no"
            {...register('contactNo')}
            error={errors.contactNo?.message}
            required
          />
          <FormInput
            label="Email"
            type="email"
            className="sm:col-span-2"
            {...register('email')}
            error={errors.email?.message}
            required
          />
          <FormInput
            label="Join date"
            type="date"
            {...register('joinDate')}
            error={errors.joinDate?.message}
            required
          />
          <div className="sm:col-span-2">
            <FormInput
              label="Address"
              {...register('address')}
              error={errors.address?.message}
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
            Save
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
