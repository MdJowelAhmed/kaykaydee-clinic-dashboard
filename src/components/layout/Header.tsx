import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Brain, LogOut, Menu, Moon, Settings as SettingsIcon, Sun, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { toggleTheme } from '@/redux/slices/uiSlice'
import { logout } from '@/redux/slices/authSlice'
import { NotificationPreviewDialog } from '@/components/layout/NotificationPreviewDialog'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { headerNav, settingsMenuNav } from '@/components/layout/navigation'
import { cn } from '@/utils/cn'
import { hasRouteAccess } from '@/types/roles'

/** Icon button styling shared by the right-side actions so they match the notification bell. */
const ICON_BTN =
  'flex h-9 w-9 items-center justify-center rounded-full text-accent transition-colors hover:bg-muted/50'

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { theme } = useAppSelector((state) => state.ui)
  const { user } = useAppSelector((state) => state.auth)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      dispatch(logout())
      navigate('/auth/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const visibleNav = headerNav.filter((item) =>
    user ? hasRouteAccess(user.role, item.href) : false
  )
  const visibleSettingsItems = settingsMenuNav.filter((item) =>
    user ? hasRouteAccess(user.role, item.href) : false
  )
  const canSeeAi = user ? hasRouteAccess(user.role, '/zealth-ai') : false

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
      isActive
        ? 'bg-primary/15 text-primary'
        : 'text-accent hover:bg-muted/50 hover:text-accent'
    )

  return (
    <div className="bg-background px-2 fixed top-0 left-0 right-0 z-50 h-[72px]">
      <header className="fixed top-0 left-0 right-0 z-50 h-[72px] shadow-md bg-card backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-4 rounded-2xl mx-5">
        <div className="flex h-full items-center justify-between gap-2 px-4 lg:px-6">
          {/* Left: mobile menu + logo */}
          <div className="flex items-center gap-3">
            {/* Mobile nav menu (replaces the removed sidebar) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className={cn(ICON_BTN, 'lg:hidden')} aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {visibleNav.map((item) => {
                  const Icon = item.icon
                  return (
                    <DropdownMenuItem key={item.href} onClick={() => navigate(item.href)}>
                      {Icon && <Icon className="mr-2 h-4 w-4" />}
                      {item.title}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="text-lg font-bold">
              <img
                src="/assets/logo2.png"
                alt="Booking Dashboard"
                className="h-7 w-40 object-contain dark:brightness-0 dark:invert"
              />
            </div>
          </div>

          {/* Center: primary navigation with purple active bubble */}
          <nav className="hidden flex-1 justify-center lg:flex">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
              {visibleNav.map((item) => (
                <NavLink key={item.href} to={item.href} className={navLinkClass}>
                  {item.title}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Right: actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme toggle */}
            <Button
              type="button"
              variant="ghost"
              onClick={() => dispatch(toggleTheme())}
              className="relative h-8 w-[72px] rounded-full border bg-[#414141] p-1"
              aria-label="Toggle theme"
              aria-pressed={theme === 'dark'}
            >
              <span
                className={cn(
                  'absolute h-8 w-8 rounded-3xl bg-white shadow-sm transition-all duration-200',
                  theme === 'dark' ? 'left-[38px]' : 'left-0'
                )}
              />
              <span className="relative z-10 flex w-full items-center justify-between px-1">
                <Sun
                  className={cn(
                    'h-5 w-5 transition-colors',
                    theme === 'light' ? 'text-[#111827]' : 'text-[#8f949b]'
                  )}
                />
                <Moon
                  className={cn(
                    'h-5 w-5 transition-colors',
                    theme === 'dark' ? 'text-[#1f3f69]' : 'text-[#d0d4db]'
                  )}
                />
              </span>
            </Button>

            {/* AI Manager */}
            {canSeeAi && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={ICON_BTN}
                    aria-label="AI Manager"
                    onClick={() => navigate('/zealth-ai')}
                  >
                    <Brain className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-accent">AI Manager</TooltipContent>
              </Tooltip>
            )}

            {/* Settings & admin menu */}
            {visibleSettingsItems.length > 0 && (
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <button type="button" className={ICON_BTN} aria-label="Settings">
                        <SettingsIcon className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent className="text-accent">Settings</TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>Settings &amp; admin</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {visibleSettingsItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <DropdownMenuItem key={item.href} onClick={() => navigate(item.href)}>
                        {Icon && <Icon className="mr-2 h-4 w-4" />}
                        {item.title}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Notifications */}
            <NotificationPreviewDialog />

            {/* Profile menu */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition-opacity hover:opacity-90"
                      aria-label="Profile"
                    >
                      <User className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent className="text-accent">Profile</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium text-accent">
                      {user ? `${user.firstName} ${user.lastName}`.trim() || user.email : 'Admin User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email || 'admin@example.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate('/settings/profile')}
                  className={cn(location.pathname.startsWith('/settings/profile') && 'text-primary')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setLogoutDialogOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <ConfirmDialog
          open={logoutDialogOpen}
          onClose={() => setLogoutDialogOpen(false)}
          onConfirm={handleLogout}
          onSuccess={() => setLogoutDialogOpen(false)}
          title="Confirm logout"
          description="Are you sure you want to log out?"
          confirmText="Logout"
          cancelText="Cancel"
          variant="danger"
          isLoading={isLoggingOut}
        />
      </header>
    </div>
  )
}
