import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from 'lucide-react'
import { ContactPageHeader, ContactSummaryCard } from './components/ContactHeaderParts'
import { useContactEntries, nextContactIdNo } from './ContactEntriesContext'
import { contactInitials } from './utils'
import type { ContactEntry } from './types'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  company: z.string().min(1, 'Company is required'),
  email: z.string().email('Valid email is required'),
  contactNo: z.string().min(1, 'Contact is required'),
  gender: z.string().optional(),
  address: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const inputClass =
  'rounded-xl text-accent placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary'

export default function ContactFormPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const { entries, findById, upsert } = useContactEntries()

  const isCreate = location.pathname.endsWith('/new')
  const entry = useMemo(() => (!isCreate && id ? findById(id) : undefined), [isCreate, id, findById])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      type: '',
      company: '',
      email: '',
      contactNo: '',
      gender: '',
      address: '',
    },
  })

  useEffect(() => {
    if (isCreate) return
    if (!entry) return
    setValue('name', entry.name)
    setValue('type', entry.type)
    setValue('company', entry.company)
    setValue('email', entry.email)
    setValue('contactNo', entry.contactNo)
    setValue('gender', entry.gender ?? '')
    setValue('address', entry.address ?? '')
  }, [isCreate, entry, setValue])

  if (!isCreate && id && !entry) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-muted-foreground">Provider not found</p>
        <button
          type="button"
          className="mt-2 text-sm text-primary hover:underline"
          onClick={() => navigate('/contact-list')}
        >
          Back to contact list
        </button>
      </div>
    )
  }

  const nameWatch = watch('name')
  const displayName = nameWatch?.trim() ? nameWatch : isCreate ? 'New provider' : entry!.name

  const submitForm = handleSubmit((values) => {
    const payload: ContactEntry = {
      id: isCreate ? `ct-${Date.now()}` : entry!.id,
      idNo: isCreate ? nextContactIdNo(entries) : entry!.idNo,
      name: values.name,
      type: values.type,
      company: values.company,
      email: values.email,
      contactNo: values.contactNo,
      gender: values.gender || undefined,
      address: values.address || undefined,
      status: 'active',
    }
    upsert(payload)
    toast.success(isCreate ? 'Provider added' : 'Provider updated')
    navigate(`/contact-list/${payload.id}`)
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <ContactPageHeader title="Contact list" subtitle="Manage provider details" />

      <ContactSummaryCard displayName={displayName} subTitle="provider" initials={contactInitials(displayName)} />

      <form onSubmit={submitForm}>
        <Card className="rounded-2xl border border-border bg-card shadow-sm">
          <CardContent className="p-5 sm:p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <h2 className="text-base font-semibold text-accent">Profile Details</h2>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 w-full shrink-0 rounded-xl bg-secondary px-6 text-white hover:bg-secondary/90 sm:w-auto"
              >
                Save & Change
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs text-muted-foreground">
                  Name
                </Label>
                <Input id="name" className={inputClass} {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="company" className="text-xs text-muted-foreground">
                  Company
                </Label>
                <Input id="company" className={inputClass} {...register('company')} />
                {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="type" className="text-xs text-muted-foreground">
                  Type
                </Label>
                <Input id="type" className={inputClass} {...register('type')} />
                {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gender" className="text-xs text-muted-foreground">
                  Gender
                </Label>
                <Input id="gender" className={inputClass} {...register('gender')} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-muted-foreground">
                  Email
                </Label>
                <Input id="email" type="email" className={inputClass} {...register('email')} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contactNo" className="text-xs text-muted-foreground">
                  Contact No
                </Label>
                <Input id="contactNo" className={inputClass} {...register('contactNo')} />
                {errors.contactNo && (
                  <p className="text-xs text-destructive">{errors.contactNo.message}</p>
                )}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address" className="text-xs text-muted-foreground">
                  Address
                </Label>
                <Input id="address" className={inputClass} {...register('address')} />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </motion.div>
  )
}

