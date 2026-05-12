import { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/utils/cn'
import { toast } from '@/utils/toast'
import { ImageUploader } from '@/components/common/ImageUploader'

const DEFAULT_CLINIC_LOGO =
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'

const FACILITY_TYPES = [
  'General practice',
  'Specialist clinic',
  'Dental',
  'Physiotherapy & MSK',
  'Multi-specialty',
  'Diagnostic centre',
  'Other',
] as const

const clinicProfileSchema = z.object({
  clinicName: z.string().min(2, 'Clinic name is required'),
  facilityType: z.enum(FACILITY_TYPES),
  phone: z.string().min(5, 'Enter a valid phone number'),
  email: z.string().email('Please enter a valid email'),
  website: z
    .string()
    .optional()
    .transform((s) => (s ?? '').trim())
    .refine((s) => s === '' || /^https?:\/\/.+/i.test(s), {
      message: 'Enter a full URL (e.g. https://yourclinic.com)',
    }),
  address: z.string().min(8, 'Enter the full clinic address'),
  registrationId: z.string().min(3, 'Registration or license reference is required'),
})

type ClinicProfileFormData = z.infer<typeof clinicProfileSchema>

export default function ProfileSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string>(DEFAULT_CLINIC_LOGO)
  const [clinicPhotoFile, setClinicPhotoFile] = useState<File | null>(null)

  const handleClinicPhotoChange = useCallback((file: File | null) => {
    setClinicPhotoFile(file)
    if (!file) {
      setPhotoPreview(DEFAULT_CLINIC_LOGO)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setPhotoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ClinicProfileFormData>({
    resolver: zodResolver(clinicProfileSchema),
    defaultValues: {
      clinicName: 'Kay Kay Dee Clinic',
      facilityType: 'Multi-specialty',
      phone: '+1 (312) 555-0142',
      email: 'contact@kaykaydee-clinic.example.com',
      website: 'https://kaykaydee-clinic.example.com',
      address: '76/4 R no. 60/1 Rue des Saints-Pères, 75005 Paris, France',
      registrationId: 'CLN-REG-45872347687',
    },
  })

  const onSubmit = async (data: ClinicProfileFormData) => {
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log('Clinic profile data:', data, {
      clinicPhoto: clinicPhotoFile ? { name: clinicPhotoFile.name, size: clinicPhotoFile.size } : null,
    })

    toast({
      title: 'Clinic profile updated',
      description: 'Your clinic details have been saved successfully.',
    })

    setIsSubmitting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-accent">Clinic profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This information is shown to patients and staff as your organisation profile. Keep
          contact details accurate.
        </p>
      </div>

      {/* <Card className="overflow-hidden rounded-2xl border border-indigo-500/40 bg-slate-900 shadow-sm">
        <CardContent className="p-0">
          <div className="flex items-stretch gap-5 p-4 sm:p-5">
            <div className="h-[110px] w-[140px] shrink-0 overflow-hidden rounded-xl bg-slate-800 ring-1 ring-white/10">
              <img
                src={photoPreview}
                alt={`${clinicTitle} logo`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-white">{clinicTitle}</p>
                <p className="mt-1 text-xs text-white/70">{facilityLabel}</p>
                <p className="mt-2 text-xs text-white/60">{clinicIdLabel}</p>
              </div>
              <span className="inline-flex shrink-0 items-center rounded-full bg-violet-600/20 px-4 py-1 text-xs font-medium text-violet-200 ring-1 ring-violet-500/40">
                {status}
              </span>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* <Card className="overflow-hidden rounded-2xl border border-indigo-500/40 bg-slate-900 shadow-sm">
        <CardContent className="p-0">
          <div className="flex items-stretch gap-5 p-4 sm:p-5">
            <div className="h-[110px] w-[140px] shrink-0 overflow-hidden rounded-xl bg-slate-800 ring-1 ring-white/10">
              <img
                src={photoPreview}
                alt={`${clinicTitle} logo`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-white">{clinicTitle}</p>
                <p className="mt-1 text-xs text-white/70">{facilityLabel}</p>
                <p className="mt-2 text-xs text-white/60">{clinicIdLabel}</p>
              </div>
              <span className="inline-flex shrink-0 items-center rounded-full bg-violet-600/20 px-4 py-1 text-xs font-medium text-violet-200 ring-1 ring-violet-500/40">
                {status}
              </span>
            </div>
          </div>
        </CardContent>
      </Card> */}

      <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Clinic logo / photo</Label>
                <p className="text-xs text-muted-foreground">
                  Upload a clear logo or building photo. Shown on this profile banner and can be
                  wired to your public clinic page when the API is connected.
                </p>
                <ImageUploader
                  value={photoPreview}
                  onChange={handleClinicPhotoChange}
                  className="max-w-md"
                  emptyTitle="Drop clinic logo or tap to upload"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label className={cn(errors.clinicName && 'text-destructive')}>Clinic name</Label>
                <Input
                  {...register('clinicName')}
                  className="rounded-md border-border bg-background text-accent"
                  placeholder="Official clinic or practice name"
                />
                {errors.clinicName?.message && (
                  <p className="text-xs text-destructive">{errors.clinicName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className={cn(errors.facilityType && 'text-destructive')}>
                  Facility type
                </Label>
                <Controller
                  control={control}
                  name="facilityType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-11 rounded-md border-border bg-background text-accent">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {FACILITY_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.facilityType?.message && (
                  <p className="text-xs text-destructive">{errors.facilityType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className={cn(errors.registrationId && 'text-destructive')}>
                  Registration / license ID
                </Label>
                <Input
                  {...register('registrationId')}
                  className="rounded-md border-border bg-background text-accent"
                  placeholder="Government or board registration reference"
                />
                {errors.registrationId?.message && (
                  <p className="text-xs text-destructive">{errors.registrationId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className={cn(errors.phone && 'text-destructive')}>Main phone</Label>
                <Input
                  {...register('phone')}
                  className="rounded-md border-border bg-background text-accent"
                  placeholder="Reception or main line"
                />
                {errors.phone?.message && (
                  <p className="text-xs text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className={cn(errors.email && 'text-destructive')}>Clinic email</Label>
                <Input
                  {...register('email')}
                  className="rounded-md border-border bg-background text-accent"
                  placeholder="appointments@clinic.com"
                  type="email"
                />
                {errors.email?.message && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label className={cn(errors.website && 'text-destructive')}>
                  Website <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  {...register('website')}
                  className="rounded-md border-border bg-background text-accent"
                  placeholder="https://"
                  type="url"
                />
                {errors.website?.message && (
                  <p className="text-xs text-destructive">{errors.website.message}</p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label className={cn(errors.address && 'text-destructive')}>Clinic address</Label>
                <Textarea
                  {...register('address')}
                  rows={3}
                  className="resize-y rounded-md border-border bg-background text-accent"
                  placeholder="Street, city, postal code, country"
                />
                {errors.address?.message && (
                  <p className="text-xs text-destructive">{errors.address.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex select-none items-center gap-3 text-xs text-muted-foreground">
                <Checkbox checked={confirm} onCheckedChange={(v) => setConfirm(v === true)} />
                I confirm these clinic details are correct and may be shown to patients and staff.
              </label>

              <Button
                type="submit"
                className="h-11 w-full rounded-xl bg-secondary px-10 text-white hover:bg-secondary/90 sm:w-auto"
                isLoading={isSubmitting}
                disabled={!confirm || isSubmitting}
              >
                Save &amp; Change
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
