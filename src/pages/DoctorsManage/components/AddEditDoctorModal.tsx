import { useEffect } from 'react'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ModalWrapper, FormInput, FormSelect } from '@/components/common'
import { Button } from '@/components/ui/button'
import type { DoctorEntry, DoctorStatus } from '../types'

const STATUS_OPTIONS: { value: DoctorStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const schema = z.object({
  clinicName: z.string().min(1, 'Clinic name is required'),
  branch: z.string().min(1, 'Branch is required'),
  designation: z.string().min(1, 'Designation is required'),
  status: z.enum(['active', 'inactive']),
})

type FormValues = z.infer<typeof schema>

interface AddEditDoctorModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  entry: DoctorEntry | null
  onSave: (payload: { clinicName: string; branch: string; designation: string; status: DoctorStatus }) => void
}

export function AddEditDoctorModal({ open, onClose, mode, entry, onSave }: AddEditDoctorModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { clinicName: '', branch: '', designation: '', status: 'active' },
  })

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && entry) {
      reset({
        clinicName: entry.clinicName,
        branch: entry.branch,
        designation: entry.designation,
        status: entry.status,
      })
    } else {
      reset({ clinicName: '', branch: '', designation: '', status: 'active' })
    }
  }, [open, mode, entry, reset])

  const submit = (data: FormValues) => {
    onSave({
      clinicName: data.clinicName.trim(),
      branch: data.branch.trim(),
      designation: data.designation.trim(),
      status: data.status,
    })
    onClose()
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Add doctor' : 'Edit doctor'}
      size="md"
      className="bg-white rounded-2xl"
    >
      <form onSubmit={handleSubmit(submit)} className="space-y-4 pt-2">
        <FormInput label="Clinic name" required {...register('clinicName')} error={errors.clinicName?.message} />
        <FormInput label="Branch" required {...register('branch')} error={errors.branch?.message} />
        <FormInput
          label="Designation"
          required
          {...register('designation')}
          error={errors.designation?.message}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Status"
              required
              value={field.value}
              options={STATUS_OPTIONS}
              onChange={field.onChange}
              error={errors.status?.message}
            />
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#0F1F44] hover:bg-[#0F1F44]/90 text-white">
            {mode === 'create' ? 'Add' : 'Save'}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}

