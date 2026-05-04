import { NavLink, useNavigate } from 'react-router-dom'
import { Menu, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { toggleSidebar, toggleTheme } from '@/redux/slices/uiSlice'
import { logout } from '@/redux/slices/authSlice'
import { NotificationPreviewDialog } from '@/components/layout/NotificationPreviewDialog'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { headerNav } from '@/components/layout/navigation'
import { cn } from '@/utils/cn'
import { hasRouteAccess } from '@/types/roles'

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

  return (
   <div className="bg-background p-2 fixed top-0 left-0 right-0 z-50 h-28">
     <header className="fixed top-0 left-0 right-0 z-50 h-20 shadow-md bg-card backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-4 rounded-2xl mx-5">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          {/* <div>
            <h1 className="text-xl font-semibold text-accent">{pageTitle}</h1>
            <p className="text-sm text-accent hidden sm:block">
              Welcome back, {user?.firstName || 'Admin'}
            </p>
          </div> */}

          <div className="text-primary text-white font-bold text-lg">
            <img src="/logo.png" alt="Booking Dashboard" className="h-16 w-28" />
            {/* <img src="/assets/logo3.png" alt="Booking Dashboard" className="h-8 w-20 object-contain" /> */}
          </div>
        </div>

        {/* Center - Top routes (scrollable) */}
        <nav className="hidden lg:flex flex-1 justify-center px-6">
          <div className="flex items-center gap-10 overflow-x-auto scrollbar-thin">
            {headerNav
              .filter((item) => (user ? hasRouteAccess(user.role, item.href) : false))
              .map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                      'text-accent hover:text-accent hover:bg-muted/30',
                      isActive && 'text-accent bg-muted/40'
                    )
                  }
                >
                  {item.title}
                </NavLink>
              ))}
          </div>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-5">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 text-accent" />
            ) : (
              <Sun className="h-5 w-5 text-accent" />
            )}
          </Button>

          {/* Notifications — anchored popover under bell */}
          <NotificationPreviewDialog />

          {/* User menu */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-white bg-primary" >
                    {getInitials(user?.firstName, user?.lastName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || 'admin@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings/password')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setLogoutDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
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
