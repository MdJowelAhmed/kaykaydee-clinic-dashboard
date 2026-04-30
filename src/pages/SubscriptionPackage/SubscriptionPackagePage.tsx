import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ExternalLink, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/formatters'
import { UpdatePackageStatusModal, type PackageStatus } from './components/UpdatePackageStatusModal'

type PlanId = 'free_trial' | 'basic' | 'advanced' | 'premium'

interface Plan {
  id: PlanId
  name: string
  monthlyPrice: number
  billingLabel: string
  buttonVariant: 'reload' | 'subscribe'
}

const KEY_FEATURES = [
  'Scheduling',
  'Manual notes',
  'Limited templates',
  'Patient portal',
  'Patient invoicing & payments',
  'Web + mobile access',
] as const

export default function SubscriptionPackagePage() {
  const plans: Plan[] = useMemo(
    () => [
      { id: 'free_trial', name: 'Free Trial', monthlyPrice: 0, billingLabel: '/ 14 Day', buttonVariant: 'reload' },
      { id: 'basic', name: 'Basic', monthlyPrice: 50, billingLabel: '/ month', buttonVariant: 'subscribe' },
      { id: 'advanced', name: 'Advanced', monthlyPrice: 100, billingLabel: '/ month', buttonVariant: 'subscribe' },
      { id: 'premium', name: 'Premium', monthlyPrice: 200, billingLabel: '/ month', buttonVariant: 'subscribe' },
    ],
    []
  )
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  const [activeId, setActiveId] = useState<PlanId>('free_trial')
  const [completionPct, setCompletionPct] = useState(50)
  const [deadlineLabel] = useState('Dateline 22, feb 2027')

  const [packageStatus, setPackageStatus] = useState<Record<string, PackageStatus>>(() =>
    Object.fromEntries(plans.map((p) => [p.id, 'active']))
  )
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [statusTarget, setStatusTarget] = useState<Plan | null>(null)

  const activePlan = plans.find((p) => p.id === activeId) ?? plans[0]

  const handleTakeSubscription = (plan: Plan) => {
    setActiveId(plan.id)
    setCompletionPct(0)
    toast.success(`Subscribed to ${plan.name}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-accent md:text-3xl">
          Manage Subscription
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage subscription package</p>
      </div>

      <Card className="rounded-2xl border border-border bg-card shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold text-accent">{activePlan.name}</p>
              <button
                type="button"
                className="rounded-md p-1 text-muted-foreground hover:bg-muted/40 hover:text-accent"
                aria-label="Open"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(activePlan.monthlyPrice, 'USD')} {activePlan.billingLabel}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              You complete {completionPct}% of your package
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Button
              type="button"
              className="h-10 rounded-xl bg-primary px-6 text-white hover:bg-primary/90"
              onClick={() => {
                setCompletionPct((p) => Math.min(100, p + 10))
                toast.success('Reload Package')
              }}
            >
              Reload Package
            </Button>
            <p className="text-xs text-destructive">{deadlineLabel}</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        Choose the perfect plan for your clinic. Upgrade or downgrade anytime.
      </div>

      <div className="flex items-center justify-center gap-3 text-sm">
        <span className={cn('font-medium', billing === 'monthly' ? 'text-accent' : 'text-muted-foreground')}>
          Monthly
        </span>
        <Switch
          checked={billing === 'annual'}
          onCheckedChange={(v) => setBilling(v ? 'annual' : 'monthly')}
        />
        <span className={cn('font-medium', billing === 'annual' ? 'text-accent' : 'text-muted-foreground')}>
          Annual
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan, index) => {
          const isActive = plan.id === activeId
          const status = packageStatus[plan.id] ?? 'active'
          const priceNumber = billing === 'monthly' ? plan.monthlyPrice : plan.monthlyPrice * 12
          const priceSuffix = plan.id === 'free_trial' ? plan.billingLabel : billing === 'monthly' ? '/ month' : '/ year'
          const priceLabel = `${formatCurrency(priceNumber, 'USD')} ${priceSuffix}`

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * index }}
            >
              <Card
                className={cn(
                  'rounded-2xl border border-border bg-card shadow-sm',
                  isActive && 'ring-2 ring-primary/20'
                )}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-2xl font-semibold text-accent">{plan.name}</p>
                      <p className="mt-1 text-xl text-muted-foreground tabular-nums">{priceLabel}</p>
                    </div>
               
                  </div>

                  {plan.buttonVariant === 'reload' ? (
                    <Button
                      type="button"
                      className="my-12 h-10 w-full rounded-xl bg-primary text-white hover:bg-primary/90"
                      onClick={() => {
                        setCompletionPct((p) => Math.min(100, p + 10))
                        toast.success('Reload Package')
                      }}
                    >
                      Reload Package
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className={cn(
                        'my-12 h-10 w-full rounded-xl text-white',
                        'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600'
                      )}
                      onClick={() => handleTakeSubscription(plan)}
                    >
                      Take Subscription
                    </Button>
                  )}

                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground">Key features:</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="rounded-md p-1 text-muted-foreground hover:bg-muted/40 hover:text-accent"
                          aria-label="Open details"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                            status === 'active'
                              ? 'bg-success/10 text-success'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <ul className="mt-3 space-y-4 text-sm text-muted-foreground">
                      {KEY_FEATURES.map((f) => (
                        <li key={`${plan.id}-${f}`} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={2.5} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <UpdatePackageStatusModal
        open={statusModalOpen}
        onClose={() => {
          setStatusModalOpen(false)
          setStatusTarget(null)
        }}
        packageName={statusTarget?.name ?? ''}
        currentStatus={statusTarget ? packageStatus[statusTarget.id] ?? 'active' : 'active'}
        onSave={(next) => {
          if (!statusTarget) return
          setPackageStatus((prev) => ({ ...prev, [statusTarget.id]: next }))
          toast.success('Status updated')
        }}
      />
    </motion.div>
  )
}
