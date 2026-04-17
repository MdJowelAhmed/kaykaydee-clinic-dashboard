import { Badge } from '@/components/ui/badge'
import { Shield, Building2, Briefcase } from 'lucide-react'
import { cn } from '@/utils/cn'
import { UserRole, LEGACY_ADMIN_ROLE_KEY } from '@/types/roles'
import { getRoleDisplayName } from '@/utils/roleHelpers'

interface RoleBadgeProps {
  role: string
  className?: string
  showIcon?: boolean
}

type BadgeTier = 'headAdmin' | 'manager' | 'other'

function badgeTier(role: string): BadgeTier {
  if (role === UserRole.HEAD_ADMIN) return 'headAdmin'
  if (role === UserRole.MANAGER || role === LEGACY_ADMIN_ROLE_KEY) return 'manager'
  return 'other'
}

export function RoleBadge({ role, className, showIcon = true }: RoleBadgeProps) {
  const tier = badgeTier(role)

  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1 font-medium border-0',
        tier === 'headAdmin' &&
          'bg-amber-100 text-amber-900 hover:bg-amber-200/90',
        tier === 'manager' &&
          'bg-purple-100 text-purple-800 hover:bg-purple-200/90',
        tier === 'other' && 'bg-slate-100 text-slate-800 hover:bg-slate-200/80',
        className
      )}
    >
      {showIcon &&
        (tier === 'headAdmin' ? (
          <Shield className="h-3 w-3" />
        ) : tier === 'manager' ? (
          <Building2 className="h-3 w-3" />
        ) : (
          <Briefcase className="h-3 w-3" />
        ))}
      {getRoleDisplayName(role)}
    </Badge>
  )
}
