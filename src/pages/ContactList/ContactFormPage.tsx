import { useEffect, useMemo, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { User, Phone, MapPin, StickyNote } from 'lucide-react'
import { ContactPageHeader, ContactSummaryCard } from './components/ContactHeaderParts'
import { useContactEntries, nextContactIdNo } from './ContactEntriesContext'
import { CONTACT_TYPE_OPTIONS } from './contactListData'
import { contactInitials } from './utils'
import type { ContactEntry } from './types'

const schema = z.object({
  // General Details — only the person name is mandatory
  name: z.string().min(1, 'Name is required'),
  type: z.string().optional(),
  title: z.string().optional(),
  occupation: z.string().optional(),
  company: z.string().optional(),
  // Contact Details
  email: z.union([z.string().email('Enter a valid email'), z.literal('')]).optional(),
  mobile: z.string().optional(),
  workPhone: z.string().optional(),
  secondaryPhone: z.string().optional(),
  // Address Details
  addressSearch: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().optional(),
  // Notes
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const inputClass =
  'rounded-xl text-accent placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary'

function FormSection({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
}) {
  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm">
      <CardContent className="p-5 sm:p-6">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            {icon}
          </div>
          <h2 className="text-base font-semibold text-accent">{title}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">{children}</div>
      </CardContent>
    </Card>
  )
}

function Field({
  id,
  label,
  required,
  error,
  full,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  full?: boolean
  children: ReactNode
}) {
  return (
    <div className={`space-y-1.5 ${full ? 'sm:col-span-2' : ''}`}>
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export default function ContactFormPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const { entries, findById, upsert } = useContactEntries()

  const isCreate = location.pathname.endsWith('/new')
  const entry = useMemo(() => (!isCreate && id ? findById(id) : undefined), [isCreate, id, findById])

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      type: '',
      title: '',
      occupation: '',
      company: '',
      email: '',
      mobile: '',
      workPhone: '',
      secondaryPhone: '',
      addressSearch: '',
      address: '',
      city: '',
      state: '',
      postcode: '',
      country: '',
      notes: '',
    },
  })

  useEffect(() => {
    if (isCreate || !entry) return
    reset({
      name: entry.name ?? '',
      type: entry.type ?? '',
      title: entry.title ?? '',
      occupation: entry.occupation ?? '',
      company: entry.company ?? '',
      email: entry.email ?? '',
      mobile: entry.mobile ?? '',
      workPhone: entry.workPhone ?? '',
      secondaryPhone: entry.secondaryPhone ?? '',
      addressSearch: '',
      address: entry.address ?? '',
      city: entry.city ?? '',
      state: entry.state ?? '',
      postcode: entry.postcode ?? '',
      country: entry.country ?? '',
      notes: entry.notes ?? '',
    })
  }, [isCreate, entry, reset])

  if (!isCreate && id && !entry) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-muted-foreground">Contact not found</p>
        <button
          type="button"
          className="mt-2 text-sm text-primary hover:underline"
          onClick={() => navigate('/contact-list')}
        >
          Back to contacts
        </button>
      </div>
    )
  }

  const nameWatch = watch('name')
  const displayName = nameWatch?.trim() ? nameWatch : isCreate ? 'New contact' : entry!.name

  const trimOrUndef = (value?: string) => {
    const v = value?.trim()
    return v ? v : undefined
  }

  const submitForm = handleSubmit((values) => {
    const payload: ContactEntry = {
      id: isCreate ? `ct-${Date.now()}` : entry!.id,
      idNo: isCreate ? nextContactIdNo(entries) : entry!.idNo,
      name: values.name.trim(),
      type: trimOrUndef(values.type),
      title: trimOrUndef(values.title),
      occupation: trimOrUndef(values.occupation),
      company: trimOrUndef(values.company),
      email: trimOrUndef(values.email),
      mobile: trimOrUndef(values.mobile),
      workPhone: trimOrUndef(values.workPhone),
      secondaryPhone: trimOrUndef(values.secondaryPhone),
      address: trimOrUndef(values.address),
      city: trimOrUndef(values.city),
      state: trimOrUndef(values.state),
      postcode: trimOrUndef(values.postcode),
      country: trimOrUndef(values.country),
      notes: trimOrUndef(values.notes),
      status: entry?.status ?? 'active',
    }
    upsert(payload)
    toast.success(isCreate ? 'Contact added' : 'Contact updated')
    navigate(`/contact-list/${payload.id}`)
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <ContactPageHeader title="Contacts" subtitle="Manage contact details" />

      <ContactSummaryCard displayName={displayName} subTitle="contact" initials={contactInitials(displayName)} />

      <form onSubmit={submitForm} className="space-y-4">
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 w-full shrink-0 rounded-xl bg-secondary px-6 text-white hover:bg-secondary/90 sm:w-auto"
          >
            Save & Change
          </Button>
        </div>

        {/* General Details */}
        <FormSection icon={<User className="h-4 w-4" />} title="General Details">
          <Field id="name" label="Name" required error={errors.name?.message}>
            <Input id="name" placeholder="Person name" className={inputClass} {...register('name')} />
          </Field>
          <Field id="type" label="Type">
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value || ''} onValueChange={field.onChange}>
                  <SelectTrigger id="type" className={inputClass}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTACT_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field id="title" label="Title">
            <Input id="title" placeholder="e.g. Dr, Mr, Ms" className={inputClass} {...register('title')} />
          </Field>
          <Field id="occupation" label="Occupation">
            <Input id="occupation" className={inputClass} {...register('occupation')} />
          </Field>
          <Field id="company" label="Company" full>
            <Input id="company" className={inputClass} {...register('company')} />
          </Field>
        </FormSection>

        {/* Contact Details */}
        <FormSection icon={<Phone className="h-4 w-4" />} title="Contact Details">
          <Field id="email" label="Email" error={errors.email?.message}>
            <Input id="email" type="email" className={inputClass} {...register('email')} />
          </Field>
          <Field id="mobile" label="Mobile Number">
            <Input id="mobile" className={inputClass} {...register('mobile')} />
          </Field>
          <Field id="workPhone" label="Work Phone">
            <Input id="workPhone" className={inputClass} {...register('workPhone')} />
          </Field>
          <Field id="secondaryPhone" label="Secondary Phone Number">
            <Input id="secondaryPhone" className={inputClass} {...register('secondaryPhone')} />
          </Field>
        </FormSection>

        {/* Address Details */}
        <FormSection icon={<MapPin className="h-4 w-4" />} title="Address Details">
          <Field id="addressSearch" label="Address Search" full>
            <Input
              id="addressSearch"
              placeholder="Start typing to search an address…"
              className={inputClass}
              {...register('addressSearch')}
            />
          </Field>
          <Field id="address" label="Address" full>
            <Input id="address" className={inputClass} {...register('address')} />
          </Field>
          <Field id="city" label="City / Town">
            <Input id="city" className={inputClass} {...register('city')} />
          </Field>
          <Field id="state" label="State / Region">
            <Input id="state" className={inputClass} {...register('state')} />
          </Field>
          <Field id="postcode" label="Postcode">
            <Input id="postcode" className={inputClass} {...register('postcode')} />
          </Field>
          <Field id="country" label="Country">
            <Input id="country" className={inputClass} {...register('country')} />
          </Field>
        </FormSection>

        {/* Notes */}
        <FormSection icon={<StickyNote className="h-4 w-4" />} title="Notes">
          <Field
            id="notes"
            label="Additional information (preferred contact method, best times to call, relationship to participant, invoicing instructions, referral info…)"
            full
          >
            <Textarea
              id="notes"
              rows={5}
              placeholder="Add any additional notes about this contact…"
              className={inputClass}
              {...register('notes')}
            />
          </Field>
        </FormSection>
      </form>
    </motion.div>
  )
}
