import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/utils/cn'
import type { SubscriptionManagePackage } from '../types'

interface PackageCardProps {
  pkg: SubscriptionManagePackage
  onToggleEnabled: (next: boolean) => void
  onEdit: () => void
  onEditFeatures: () => void
}

function cycleLabel(cycle: SubscriptionManagePackage['cycle']) {
  if (cycle === 'trial') return 'Free Trial'
  return cycle === 'annual' ? ' / year' : ' / month'
}

export function PackageCard({ pkg, onToggleEnabled, onEdit, onEditFeatures }: PackageCardProps) {
  const flatFeatures = pkg.featureGroups.flatMap((g) => g.items)

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">{pkg.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {pkg.cycle === 'trial' ? '0' : `$${pkg.price}`} <span className="text-slate-500">{cycleLabel(pkg.cycle)}</span>
            </p>
          </div>
          {/* <Button type="button" variant="outline" className="rounded-xl" onClick={onEdit}>
            Edit
          </Button> */}
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
          <div>
            <p className="text-sm font-medium text-slate-800">Enable</p>
          </div>
          <Switch checked={pkg.enabled} onCheckedChange={onToggleEnabled} />
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <ul className="space-y-2 text-sm">
            {flatFeatures.slice(0, 6).map((f) => (
              <li key={f.id} className="flex items-center gap-2 text-slate-700">
                <span
                  className={cn(
                    'inline-block h-1.5 w-1.5 rounded-full',
                    f.enabled ? 'bg-[#6BBF2D]' : 'bg-slate-300'
                  )}
                />
                <span className={cn(!f.enabled && 'text-slate-400')}>{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/40 mt-12">
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-xl bg-white"
          onClick={onEditFeatures}
        >
          Edit Features
        </Button>
      </div>
    </div>
  )
}

