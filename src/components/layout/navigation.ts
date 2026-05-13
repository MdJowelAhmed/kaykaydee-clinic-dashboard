import type React from 'react'
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
  '/zealth-ai': 'Zealth AI',
  '/waiting-list': 'Waiting list',
  '/client-list': 'Client list',
  '/contact-list': 'Contact list',
  '/clinics-invoice': 'Clinics Invoice',
  '/reports': 'Reports',
  '/exercises': 'Exercises',
  '/branch-manage': 'Branch manage',
  '/doctors-manage': 'Doctors manage',
  '/documents-manage': 'Documents',
  '/admin-manage': 'Admin Manage',
  '/clinic-management': 'Clinic Management',
}

/**
 * Header tabs: keep this short (top-level routes).
 * Sidebar can include more items; header is for primary navigation.
 */
export const headerNav: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Calendar', href: '/calender' },
  { title: 'Waiting list', href: '/waiting-list' },
  { title: 'Client list', href: '/client-list' },
  { title: 'Contact list', href: '/contact-list' },
  { title: 'Clinics Invoice', href: '/clinics-invoice' },
  { title: 'Reports', href: '/reports' },
  { title: 'Exercises', href: '/exercises' },
  { title: 'Branch manage', href: '/branch-manage' },
  { title: 'Doctors manage', href: '/doctors-manage' },
  { title: 'Documents', href: '/documents-manage' },
]

