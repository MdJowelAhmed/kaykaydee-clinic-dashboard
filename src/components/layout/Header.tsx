import { NavLink, useNavigate } from 'react-router-dom'
import { Bell, Brain, LogOut, Menu, Moon, Settings as SettingsIcon, Sun, User } from 'lucide-react'
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
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { headerNav, settingsMenuNav } from '@/components/layout/navigation'
import { MOCK_NOTIFICATIONS } from '@/mocks/notificationData'
import { cn } from '@/utils/cn'
import { hasRouteAccess } from '@/types/roles'

/** Unread badge = inbox notifications (demo data). */
const NOTIFICATION_COUNT = MOCK_NOTIFICATIONS.filter((n) => n.box === 'inbox').length

/** Icon button styling shared by the right-side actions so they match the notification bell. */
const ICON_BTN =
  'flex h-9 w-9 items-center justify-center rounded-full text-accent transition-colors hover:bg-muted/50'

export function Header() {
  const navigate = useNavigate()
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

            {/* Notifications — go straight to the notifications page */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(ICON_BTN, 'relative')}
                  aria-label={`Notifications${NOTIFICATION_COUNT ? ` (${NOTIFICATION_COUNT} unread)` : ''}`}
                  onClick={() => navigate('/notification')}
                >
                  <Bell className="h-5 w-5" />
                  {NOTIFICATION_COUNT > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-white">
                      {NOTIFICATION_COUNT > 9 ? '9+' : NOTIFICATION_COUNT}
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-accent">Notifications</TooltipContent>
            </Tooltip>

            {/* Logout */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(ICON_BTN, 'hover:bg-destructive/10 hover:text-destructive')}
                  aria-label="Logout"
                  onClick={() => setLogoutDialogOpen(true)}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-accent">Logout</TooltipContent>
            </Tooltip>

            {/* Profile — opens the profile page directly */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition-opacity hover:opacity-90"
                  aria-label="Profile"
                  onClick={() => navigate('/settings/profile')}
                >
                  <User className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-accent">Profile</TooltipContent>
            </Tooltip>
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
