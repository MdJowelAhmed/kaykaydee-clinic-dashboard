import { useEffect } from 'react'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ModalWrapper, FormInput, FormSelect } from '@/components/common'
import { Button } from '@/components/ui/button'
import type { BranchEntry, BranchStatus } from '../types'

const STATUS_OPTIONS: { value: BranchStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const schema = z.object({
  branchName: z.string().min(1, 'Branch name is required'),
  email: z.string().email('Enter a valid email'),
  status: z.enum(['active', 'inactive']),
})

type FormValues = z.infer<typeof schema>

interface AddEditBranchModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  entry: BranchEntry | null
  onSave: (payload: { branchName: string; email: string; status: BranchStatus }) => void
}

export function AddEditBranchModal({ open, onClose, mode, entry, onSave }: AddEditBranchModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { branchName: '', email: '', status: 'active' },
  })

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && entry) {
      reset({ branchName: entry.branchName, email: entry.email, status: entry.status })
    } else {
      reset({ branchName: '', email: '', status: 'active' })
    }
  }, [open, mode, entry, reset])

  const submit = (data: FormValues) => {
    onSave({
      branchName: data.branchName.trim(),
      email: data.email.trim(),
      status: data.status,
    })
    onClose()
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Add branch' : 'Edit branch'}
      size="md"
      className="bg-card rounded-2xl"
    >
      <form onSubmit={handleSubmit(submit)} className="space-y-4 pt-2">
        <FormInput
          label="Branch name"
          required
          {...register('branchName')}
          error={errors.branchName?.message}
        />
        <FormInput label="Email" type="email" required {...register('email')} error={errors.email?.message} />

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
          
          <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white">
            {mode === 'create' ? 'Add Branch' : 'Save Branch'}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}

