import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Settings,
  Crown,
  Activity,
  Info,
  ShieldAlert,
  FileCheck,
  HelpCircle,
  Receipt,
  GitBranch,
  UserCog,
  UserPlus,
  Brain,
  LogOut,
  User,
  Users,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { toggleSidebar } from '@/redux/slices/uiSlice'
import { cn } from '@/utils/cn'
import { UserRole, normalizeRoleKey } from '@/types/roles'
import { Button } from '../ui/button'
import { logout } from '@/redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import {
  DASHBOARD_HEADER_H,
  DASHBOARD_HEADER_SIDEBAR_GAP,
  DASHBOARD_SIDEBAR_V_INSET,
} from '@/components/layout/dashboardLayoutTokens'
import { getRoleDisplayName } from '@/utils/roleHelpers'

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  allowedRoles?: UserRole[]
}

const invoiceSection: NavItem[] = [
  {
    title: 'Invoices',
    href: '/clinics-invoice',
    icon: Receipt,
    allowedRoles: [UserRole.HEAD_ADMIN, UserRole.MANAGER],
  },
]

const generalSettingsSection: NavItem[] = [
  {
    title: 'Settings',
    href: '/settings/profile',
    icon: Settings,
    allowedRoles: [UserRole.HEAD_ADMIN, UserRole.MANAGER],
  },
  {
    title: 'My Subscription',
    href: '/subscription-packages',
    icon: Crown,
    allowedRoles: [UserRole.HEAD_ADMIN],
  },
  {
    title: 'Exercises Setting',
    href: '/exercises',
    icon: Activity,
    allowedRoles: [UserRole.HEAD_ADMIN, UserRole.MANAGER],
  },
  {
    title: 'About us',
    href: '/settings/about-us',
    icon: Info,
    allowedRoles: [UserRole.HEAD_ADMIN, UserRole.MANAGER],
  },
  {
    title: 'Privacy Policy',
    href: '/settings/privacy',
    icon: ShieldAlert,
    allowedRoles: [UserRole.HEAD_ADMIN, UserRole.MANAGER],
  },
  {
    title: 'Terms & Condition',
    href: '/settings/terms',
    icon: FileCheck,
    allowedRoles: [UserRole.HEAD_ADMIN, UserRole.MANAGER],
  },
  {
    title: 'Manage FAQ',
    href: '/settings/faq',
    icon: HelpCircle,
    allowedRoles: [UserRole.HEAD_ADMIN],
  },
]

const adminSection: NavItem[] = [
  {
    title: 'Branch',
    href: '/branch-manage',
    icon: GitBranch,
    allowedRoles: [UserRole.HEAD_ADMIN, UserRole.MANAGER],
  },
  {
    title: 'Admin',
    href: '/admin-manage',
    icon: UserCog,
    allowedRoles: [UserRole.HEAD_ADMIN],
  },
  {
    title: 'Members',
    href: '/doctors-manage',
    icon: UserPlus,
    allowedRoles: [UserRole.HEAD_ADMIN, UserRole.MANAGER],
  },
]

const aiItem: NavItem = {
  title: 'AI Manager',
  href: '/zealth-ai',
  icon: Brain,
  allowedRoles: [UserRole.HEAD_ADMIN, UserRole.MANAGER],
}

function filterByRole(items: NavItem[], user: { role: string } | null): NavItem[] {
  if (!items.length) return []
  return items.filter((item) => {
    if (!item.allowedRoles) return true
    if (!user) return false
    const role = normalizeRoleKey(user.role) as UserRole
    return item.allowedRoles.includes(role)
  })
}

export function Sidebar() {
  const dispatch = useAppDispatch()
  const { sidebarCollapsed } = useAppSelector((state) => state.ui)
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const filteredInvoice = filterByRole(invoiceSection, user)
  const filteredGeneral = filterByRole(generalSettingsSection, user)
  const filteredAdmin = filterByRole(adminSection, user)
  const filteredAi = filterByRole([aiItem], user)
  const showAi = filteredAi.length > 0

  const belowHeaderGap = `calc(${DASHBOARD_HEADER_H} + ${DASHBOARD_HEADER_SIDEBAR_GAP})`
  const sidebarTop = `calc(${belowHeaderGap} + ${DASHBOARD_SIDEBAR_V_INSET})`

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email
    : ''

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      dispatch(logout())
      toast.success('User logged out successfully')
      navigate('/auth/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity',
          sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
        style={{ top: belowHeaderGap }}
        onClick={() => dispatch(toggleSidebar())}
      />

      <aside
        className={cn(
          'fixed left-0 z-40 flex flex-col overflow-hidden border border-border/60 bg-card shadow-lg transition-all duration-300',
          'ml-4 rounded-[2rem] lg:ml-5',
          sidebarCollapsed ? 'w-[80px]' : 'w-[280px]',
          'lg:translate-x-0',
          sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
        )}
        style={{ top: sidebarTop, bottom: DASHBOARD_SIDEBAR_V_INSET }}
      >
        <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto scrollbar-thin px-3 pb-2 pt-4">
          {filteredInvoice.map((item) => (
            <SidebarNavItem key={item.href} item={item} collapsed={sidebarCollapsed} />
          ))}

          {filteredInvoice.length > 0 &&
            (filteredGeneral.length > 0 ||
              filteredAdmin.length > 0 ||
              showAi) && <SidebarDivider />}

          {filteredGeneral.map((item) => (
            <SidebarNavItem key={item.href} item={item} collapsed={sidebarCollapsed} />
          ))}

          {(filteredGeneral.length > 0 && filteredAdmin.length > 0) && <SidebarDivider />}

          {!sidebarCollapsed && filteredAdmin.length > 0 && (
            <div className="flex items-center gap-2 px-3 pb-2 pt-1">
              <Users className="h-4 w-4 shrink-0 text-muted-foreground/70" />
              <span className="text-xs font-medium tracking-tight text-muted-foreground/90">
                Manage Admin/Members
              </span>
            </div>
          )}
          {sidebarCollapsed && filteredAdmin.length > 0 && (
            <div className="flex justify-center py-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className='text-accent'>Manage Admin/Members</TooltipContent>
              </Tooltip>
            </div>
          )}

          {filteredAdmin.map((item) => (
            <SidebarNavItem key={item.href} item={item} collapsed={sidebarCollapsed} />
          ))}

          {showAi &&
            (filteredInvoice.length > 0 ||
              filteredGeneral.length > 0 ||
              filteredAdmin.length > 0) && <SidebarDivider />}

          {showAi &&
            filteredAi.map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                collapsed={sidebarCollapsed}
                variant="ai"
              />
            ))}

          {!sidebarCollapsed && (
            <div className="mt-3 px-1">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-400 via-cyan-500 to-fuchsia-600 p-4 text-white shadow-md">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_45%)]" />
                <div className="relative flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight">50% Completed</span>
                </div>
                <div className="relative mt-3 h-2 w-full overflow-hidden rounded-full bg-white/25">
                  <div
                    className="h-full w-1/2 rounded-full bg-white shadow-sm transition-all duration-500"
                    style={{ width: '50%' }}
                  />
                </div>
              </div>
            </div>
          )}
        </nav>

        <div className="mt-auto space-y-3 border-t border-border px-3 py-1">
          {!sidebarCollapsed && user && (
            <div className="flex items-center gap-3 rounded-2xl px-2 py-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-inner ring-2 ring-background">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-white" strokeWidth={1.75} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-accent">{displayName}</p>
                <p className="text-xs text-muted-foreground">
                  {getRoleDisplayName(user.role)}
                </p>
              </div>
            </div>
          )}

          {sidebarCollapsed && user && (
            <div className="flex justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex h-11 w-11 cursor-default items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-inner ring-2 ring-background">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt=""
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-white" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className='text-accent'>
                  <p className="font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    {getRoleDisplayName(user.role)}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          {sidebarCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mx-auto flex h-10 w-10 text-accent  hover:text-accent"
                  onClick={() => setLogoutDialogOpen(true)}
                  aria-label="Log Out"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className='text-accent'>Log Out</TooltipContent>
            </Tooltip>
          ) : (
            <button
              type="button"
              onClick={() => setLogoutDialogOpen(true)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ',
                'text-accent transition-colors',
                'hover:bg-muted/60 hover:text-accent'
              )}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </aside>

      <ConfirmDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        onSuccess={() => setLogoutDialogOpen(false)}
        title="Confirm logout"
        description="Are you sure you want to log out?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        variant="danger"
        isLoading={isLoggingOut}
      />
    </>
  )
}

function SidebarDivider() {
  return <div className="my-3 border-t border-border" role="presentation" />
}

interface SidebarNavItemProps {
  item: NavItem
  collapsed: boolean
  variant?: 'default' | 'ai'
}

function SidebarNavItem({ item, collapsed, variant = 'default' }: SidebarNavItemProps) {
  const Icon = item.icon

  const linkContent = (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-200',
          collapsed && 'justify-center px-2',
          variant === 'default' && [
            'text-accent hover:bg-muted/50 hover:text-accent',
            isActive && 'bg-background font-medium text-accent shadow-sm',
          ],
          variant === 'ai' && [
            'text-purple-600 hover:bg-purple-500/10 hover:text-purple-700 dark:text-purple-400 dark:hover:bg-purple-500/15 dark:hover:text-purple-300',
            isActive &&
              'bg-purple-500/15 font-medium text-purple-700 shadow-sm dark:bg-purple-500/20 dark:text-purple-300',
          ]
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              'h-[1.125rem] w-[1.125rem] shrink-0 stroke-[1.75]',
              variant === 'default' &&
                (isActive ? 'text-accent' : 'text-muted-foreground'),
              variant === 'ai' &&
                (isActive
                  ? 'text-purple-700 dark:text-purple-300'
                  : 'text-purple-600 dark:text-purple-400')
            )}
          />
          {!collapsed && <span>{item.title}</span>}
        </>
      )}
    </NavLink>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" className='text-accent'>{item.title}</TooltipContent>
      </Tooltip>
    )
  }

  return linkContent
}
