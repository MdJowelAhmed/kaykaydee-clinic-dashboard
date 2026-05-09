import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/cn'
import { AuthTabs } from './components/AuthTabs'

const schema = z
  .object({
    email: z.string().email('Please enter a valid email'),
    phone: z.string().min(6, 'Phone is required'),
    clinicName: z.string().min(1, 'Clinic name is required'),
    clinicRegNo: z.string().min(1, 'Clinic reg. no is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm your password'),
    agree: z.boolean().refine((v) => v === true, 'You must accept terms'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

type FormValues = z.infer<typeof schema>

export default function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      phone: '',
      clinicName: '',
      clinicRegNo: '',
      password: '',
      confirmPassword: '',
      agree: false,
    },
  })

  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 500))
    toast.success('Account created')
    navigate('/auth/login', { replace: true })
  })

  return (
    <div className="space-y-4">

      <div className="mb-8 flex flex-col items-center justify-center gap-3">
        <img src="/assets/logo.png" alt="" className="h-12 w-20" />
        <img src="/assets/logo3.png" alt="Kay Kay Dee" className="h-8 w-20 object-contain" />
      </div>
      <AuthTabs active="register" />

      <div className="flex items-center justify-center pb-2">
        <div className="text-center">
          <h1 className="mt-3 text-2xl font-bold text-accent">Sign Up</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            To get the all personalised feature sign up Login now.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Email</label>
          <Input
            type="email"
            className={cn('rounded-xl bg-[#F7F7F7]', errors.email && 'border-destructive')}
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex gap-2">
            <div className="flex w-[92px] items-center justify-center gap-2 rounded-xl border border-border bg-background px-2 text-xs text-accent shadow-sm">
              <span aria-hidden>🇧🇩</span>
              <span>+880</span>
            </div>
            <Input
              type="tel"
              className={cn('flex-1 rounded-xl bg-[#F7F7F7]', errors.phone && 'border-destructive')}
              {...register('phone')}
            />
          </div>
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Clinic Name</label>
          <Input
            className={cn('rounded-xl bg-[#F7F7F7]', errors.clinicName && 'border-destructive')}
            {...register('clinicName')}
          />
          {errors.clinicName && (
            <p className="text-xs text-destructive">{errors.clinicName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Clinic Reg. No</label>
          <Input
            className={cn('rounded-xl bg-[#F7F7F7]', errors.clinicRegNo && 'border-destructive')}
            {...register('clinicRegNo')}
          />
          {errors.clinicRegNo && (
            <p className="text-xs text-destructive">{errors.clinicRegNo.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              className={cn('rounded-xl pr-10 bg-[#F7F7F7]', errors.password && 'border-destructive')}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Confirm Password</label>
          <div className="relative">
            <Input
              type={showConfirm ? 'text' : 'password'}
              className={cn('rounded-xl pr-10 bg-[#F7F7F7]', errors.confirmPassword && 'border-destructive')}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <label className="flex items-start gap-2 pt-1 text-[10px] text-muted-foreground">
          <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-input" {...register('agree')} />
          <span>
            I have read and agree to the{' '}
            <span className="font-medium text-accent">Privacy Policy</span> and{' '}
            <span className="font-medium text-accent">Terms & Conditions</span>
          </span>
        </label>
        {errors.agree && <p className="text-xs text-destructive">{errors.agree.message}</p>}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-11 w-full rounded-xl bg-gradient-to-r from-[#7946CD] to-[#BC45E4] text-white hover:from-[#BC45E4] hover:to-[#7946CD]"
        >
          {isSubmitting ? 'Creating...' : 'Create account'}
        </Button>
      </form>
    </div>
  )
}

