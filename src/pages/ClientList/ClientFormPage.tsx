import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { User } from 'lucide-react'
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
import { ClientProfileTabs } from './components/ClientProfileTabs'
import {
  ClientProfilePageHeader,
  ClientProfileSummaryCard,
  clientNameInitials,
} from './components/ClientProfileLayoutParts'
import { useClientListEntries, nextClientIdNo } from './ClientListEntriesContext'
import { clientPatientIdRef } from './utils'
import type { ClientListEntry } from './types'
import { cn } from '@/utils/cn'

const schema = z.object({
  patientName: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  occupation: z.string().optional(),
  contactNo: z.string().min(1, 'Phone is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  emergencyContact: z.string().optional(),
  gender: z.string().min(1, 'Gender is required'),
  address: z.string().min(1, 'Address is required'),
  joinDate: z.string().min(1, 'Join date is required'),
})

type FormValues = z.infer<typeof schema>

/** Extra classes only — base `Input` keeps border + bg from `input.tsx` (no border-0 / bg override). */
const inputClass =
  'rounded-xl text-accent placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary'

function ProfileFormCard({
  children,
  isSubmitting,
}: {
  children: ReactNode
  isSubmitting: boolean
}) {
  return (
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
        {children}
      </CardContent>
    </Card>
  )
}

export default function ClientFormPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const { entries, findById, upsertClient } = useClientListEntries()
  const [tab, setTab] = useState('profile')

  const isCreate = location.pathname.endsWith('/new')
  const client = useMemo(() => (!isCreate && id ? findById(id) : undefined), [isCreate, id, findById])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      patientName: '',
      email: '',
      occupation: '',
      contactNo: '',
      dateOfBirth: '',
      emergencyContact: '',
      gender: 'Male',
      address: '',
      joinDate: '',
    },
  })

  const nameWatch = watch('patientName')

  useEffect(() => {
    if (isCreate) {
      const today = new Date()
      const local = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10)
      setValue('joinDate', local)
      return
    }
    if (!client) return
    setValue('patientName', client.patientName)
    setValue('email', client.email)
    setValue('occupation', client.occupation ?? '')
    setValue('contactNo', client.contactNo)
    setValue('dateOfBirth', client.dateOfBirth ?? '')
    setValue('emergencyContact', client.emergencyContact ?? '')
    setValue('gender', client.gender ?? 'Male')
    setValue('address', client.address)
    setValue('joinDate', client.joinDate.slice(0, 10))
  }, [isCreate, client, setValue])

  if (!isCreate && id && !client) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-muted-foreground">Client not found</p>
        <button
          type="button"
          className="mt-2 text-sm text-primary hover:underline"
          onClick={() => navigate('/client-list')}
        >
          Back to patients management
        </button>
      </div>
    )
  }

  const displayName = nameWatch?.trim() ? nameWatch : isCreate ? 'New client' : client!.patientName
  const patientIdLine = isCreate
    ? `Patient ID: (assigned on save)`
    : `Patient ID: ${clientPatientIdRef(client!)}`

  const submitForm = handleSubmit((values) => {
    const joinIso = isCreate
      ? new Date(`${values.joinDate.trim()}T12:00:00`).toISOString()
      : client!.joinDate
    const payload: ClientListEntry = {
      id: isCreate ? `cl-${Date.now()}` : client!.id,
      idNo: isCreate ? nextClientIdNo(entries) : client!.idNo,
      patientName: values.patientName,
      contactNo: values.contactNo,
      email: values.email,
      joinDate: joinIso,
      address: values.address,
      occupation: values.occupation || undefined,
      dateOfBirth: values.dateOfBirth || undefined,
      gender: values.gender,
      emergencyContact: values.emergencyContact || undefined,
    }
    upsertClient(payload)
    toast.success(isCreate ? 'Client added' : 'Profile updated')
    navigate(`/client-list/${payload.id}`)
  })

  const pageTitle = isCreate ? 'Add Clients Profile' : 'Edit Clients Profile'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <ClientProfilePageHeader title={pageTitle} onBack={() => navigate('/client-list')} />

      <ClientProfileSummaryCard
        displayName={displayName}
        patientIdLine={patientIdLine}
        initials={clientNameInitials(displayName === 'New client' ? 'N' : displayName)}
      />

      <ClientProfileTabs
        value={tab}
        onValueChange={setTab}
        profileContent={
          <form id="client-profile-form" onSubmit={submitForm} className="space-y-0">
            <ProfileFormCard isSubmitting={isSubmitting}>
              {!isCreate && <input type="hidden" {...register('joinDate')} />}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="patientName" className="text-xs text-muted-foreground">
                    Name
                  </Label>
                  <Input
                    id="patientName"
                    className={inputClass}
                    {...register('patientName')}
                  />
                  {errors.patientName && (
                    <p className="text-xs text-destructive">{errors.patientName.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="occupation" className="text-xs text-muted-foreground">
                    Occupation
                  </Label>
                  <Input id="occupation" className={inputClass} {...register('occupation')} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-muted-foreground">
                    Email
                  </Label>
                  <Input id="email" type="email" className={inputClass} {...register('email')} />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dateOfBirth" className="text-xs text-muted-foreground">
                    Date of Birth
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    className={inputClass}
                    {...register('dateOfBirth')}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contactNo" className="text-xs text-muted-foreground">
                    Phone
                  </Label>
                  <Input id="contactNo" className={inputClass} {...register('contactNo')} />
                  {errors.contactNo && (
                    <p className="text-xs text-destructive">{errors.contactNo.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Gender</Label>
                  <Select
                    value={watch('gender')}
                    onValueChange={(v) => setValue('gender', v, { shouldValidate: true })}
                  >
                    <SelectTrigger
                      className={cn(
                        inputClass,
                        'border border-input bg-[#E8EAED] shadow-none dark:border-input dark:bg-muted/40'
                      )}
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-xs text-destructive">{errors.gender.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="emergencyContact" className="text-xs text-muted-foreground">
                    Emergency contact
                  </Label>
                  <Input
                    id="emergencyContact"
                    className={inputClass}
                    {...register('emergencyContact')}
                  />
                </div>
                <div className="hidden sm:block" aria-hidden />

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="address" className="text-xs text-muted-foreground">
                    Address
                  </Label>
                  <Input id="address" className={inputClass} {...register('address')} />
                  {errors.address && (
                    <p className="text-xs text-destructive">{errors.address.message}</p>
                  )}
                </div>

                {isCreate && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="joinDate" className="text-xs text-muted-foreground">
                      Join date
                    </Label>
                    <Input id="joinDate" type="date" className={inputClass} {...register('joinDate')} />
                    {errors.joinDate && (
                      <p className="text-xs text-destructive">{errors.joinDate.message}</p>
                    )}
                  </div>
                )}
              </div>
            </ProfileFormCard>
          </form>
        }
      />
    </motion.div>
  )
}
