import type React from 'react'
import {
  CalendarDays,
  ClipboardList,
  Contact,
  FileBarChart2,
  FolderOpen,
  GitBranch,
  LayoutDashboard,
  Receipt,
  Settings,
  UserCog,
  UserPlus,
  Users,
} from 'lucide-react'
import type { UserRole } from '@/types/roles'

export interface NavItem {
  title: string
  href: string
  icon?: React.ElementType
  allowedRoles?: UserRole[]
}

export const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/calender': 'Calendar',
  '/transactions-history': 'Transactions History',
  '/notification': 'Notification',
  '/subscription-packages': 'Subscription Package',
  '/support': 'Support',
  '/users': 'User Management',
  '/categories': 'Category Management',
  '/settings': 'Settings',
  '/settings/profile': 'Profile',
  '/settings/subscription': 'My subscription',
  '/settings/password': 'Change Password',
  '/settings/terms': 'Terms & Conditions',
  '/settings/privacy': 'Privacy Policy',
  '/settings/about-us': 'About Us',
  '/settings/faq': 'Manage FAQ',
  '/zealth-ai': 'AI Manager',
  '/waiting-list': 'Waitlist',
  '/client-list': 'Clients',
  '/contact-list': 'Contacts',
  '/clinics-invoice': 'Invoices',
  '/reports': 'Reports',
  '/exercises': 'Exercises',
  '/branch-manage': 'Branch',
  '/doctors-manage': 'Members',
  '/documents-manage': 'Documents',
  '/send-documents': 'Send Documents',
  '/admin-manage': 'Admin',
  '/clinic-management': 'Clinic Management',
}

/**
 * Primary top-navigation tabs. The left sidebar has been removed, so this is the
 * single source of primary navigation. Order is intentional.
 */
export const headerNav: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Calendar', href: '/calender', icon: CalendarDays },
  { title: 'Clients', href: '/client-list', icon: Users },
  { title: 'Contacts', href: '/contact-list', icon: Contact },
  { title: 'Waitlist', href: '/waiting-list', icon: ClipboardList },
  { title: 'Invoices', href: '/clinics-invoice', icon: Receipt },
  { title: 'Reports', href: '/reports', icon: FileBarChart2 },
  { title: 'Documents', href: '/documents-manage', icon: FolderOpen },
]

/**
 * Infrequently-used admin items, surfaced from the Settings icon menu in the
 * top bar instead of taking permanent navigation space.
 */
export const settingsMenuNav: NavItem[] = [
  { title: 'Branch', href: '/branch-manage', icon: GitBranch },
  { title: 'Admin', href: '/admin-manage', icon: UserCog },
  { title: 'Members', href: '/doctors-manage', icon: UserPlus },
  { title: 'Settings', href: '/settings', icon: Settings },
]
