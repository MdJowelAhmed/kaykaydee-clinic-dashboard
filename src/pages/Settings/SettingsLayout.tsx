import type { ElementType } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  User,
  Crown,
  Info,
  FileCheck,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react'
import { useAppSelector } from '@/redux/hooks'
import { UserRole, normalizeRoleKey } from '@/types/roles'
import { cn } from '@/utils/cn'

const triggerClass =
  'inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-accent transition-colors'

const listClass =
  'flex h-auto min-h-12 w-full flex-wrap items-center justify-start gap-1 rounded-xl border border-border bg-muted/25 p-1.5'

interface SettingsTabDef {
  to: string
  label: string
  Icon: ElementType
  allowedRoles: UserRole[]
}

const SETTINGS_TABS: SettingsTabDef[] = [
  { to: '/settings/profile', label: 'Profile', Icon: User, allowedRoles: [UserRole.HEAD_ADMIN, UserRole.MANAGER] },
  {
    to: '/settings/subscription',
    label: 'My subscription',
    Icon: Crown,
    allowedRoles: [UserRole.HEAD_ADMIN],
  },
  {
    to: '/settings/about-us',
    label: 'About us',
    Icon: Info,
    allowedRoles: [UserRole.HEAD_ADMIN, UserRole.MANAGER],
  },
  {
    to: '/settings/terms',
    label: 'Terms & conditions',
    Icon: FileCheck,
    allowedRoles: [UserRole.HEAD_ADMIN, UserRole.MANAGER],
  },
  {
    to: '/settings/privacy',
    label: 'Privacy policy',
    Icon: ShieldAlert,
    allowedRoles: [UserRole.HEAD_ADMIN, UserRole.MANAGER],
  },
  {
    to: '/settings/faq',
    label: 'Manage FAQ',
    Icon: HelpCircle,
    allowedRoles: [UserRole.HEAD_ADMIN],
  },
]

function filterTabsByRole(user: { role: string } | null): SettingsTabDef[] {
  if (!user) return []
  const role = normalizeRoleKey(user.role) as UserRole
  return SETTINGS_TABS.filter((t) => t.allowedRoles.includes(role))
}

export default function SettingsLayout() {
  const { user } = useAppSelector((state) => state.auth)
  const tabs = filterTabsByRole(user)
  const location = useLocation()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-accent">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account, subscription, and clinic information.
        </p>
      </div>

      <nav className={listClass} aria-label="Settings sections">
        {tabs.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(triggerClass, isActive && 'bg-primary/15 text-primary shadow-none')}
            aria-current={location.pathname === to ? 'page' : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="min-h-[320px]">
        <Outlet />
      </div>
    </div>
  )
}
