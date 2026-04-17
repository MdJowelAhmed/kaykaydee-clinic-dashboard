// Auth roles — exactly two (Head Admin + Manager)
export enum UserRole {
  HEAD_ADMIN = 'head-admin',
  MANAGER = 'manager',
}

/** Legacy API/storage values from earlier builds/APIs. */
export const LEGACY_ADMIN_ROLE_KEY = 'host' as const
export const LEGACY_SUPER_ADMIN_ROLE_KEY = 'super-admin' as const
export const LEGACY_MANAGER_ROLE_KEY = 'admin' as const

/** Head Admin + Manager may use the dashboard shell. */
export const DASHBOARD_ALLOWED_ROLES: readonly UserRole[] = [
  UserRole.HEAD_ADMIN,
  UserRole.MANAGER,
]

/** Normalize role keys (handles legacy values). */
export function normalizeRoleKey(role: string): string {
  if (role === LEGACY_SUPER_ADMIN_ROLE_KEY) return UserRole.HEAD_ADMIN
  if (role === LEGACY_MANAGER_ROLE_KEY) return UserRole.MANAGER
  if (role === LEGACY_ADMIN_ROLE_KEY) return UserRole.MANAGER
  return role
}

export function canAccessDashboard(role: string): boolean {
  const key = normalizeRoleKey(role)
  return DASHBOARD_ALLOWED_ROLES.includes(key as UserRole)
}

const ALL_DASHBOARD_ROLES = [UserRole.HEAD_ADMIN, UserRole.MANAGER]

export interface RoutePermission {
  path: string
  allowedRoles: UserRole[]
  description?: string
}

/** Route → allowed roles (extend as you add routes) */
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/dashboard': ALL_DASHBOARD_ROLES,
  '/users': [UserRole.HEAD_ADMIN],
  '/clinic-management': [UserRole.HEAD_ADMIN],
  '/controller': [UserRole.HEAD_ADMIN],
  '/subscription-packages': [UserRole.HEAD_ADMIN],
  '/subscription-invoice': [UserRole.HEAD_ADMIN],
  '/subscription-manage': [UserRole.HEAD_ADMIN],
  '/admin-manage': [UserRole.HEAD_ADMIN],
  '/agency-management': [UserRole.HEAD_ADMIN],
  '/transactions-history': [UserRole.HEAD_ADMIN],
  '/settings/faq': [UserRole.HEAD_ADMIN],
  '/settings/terms': ALL_DASHBOARD_ROLES,
  '/settings/privacy': ALL_DASHBOARD_ROLES,
  '/settings/about-us': ALL_DASHBOARD_ROLES,
  '/cars': ALL_DASHBOARD_ROLES,
  '/booking-management': ALL_DASHBOARD_ROLES,
  '/my-listing': ALL_DASHBOARD_ROLES,
  '/calender': ALL_DASHBOARD_ROLES,
  '/clients': ALL_DASHBOARD_ROLES,
  '/reviews-ratings': ALL_DASHBOARD_ROLES,
  '/app-slider': ALL_DASHBOARD_ROLES,
  '/subscription': ALL_DASHBOARD_ROLES,
  '/notification': ALL_DASHBOARD_ROLES,
  '/support': ALL_DASHBOARD_ROLES,
  '/zealth-ai': ALL_DASHBOARD_ROLES,
  '/waiting-list': ALL_DASHBOARD_ROLES,
  '/client-list': ALL_DASHBOARD_ROLES,
  '/client-list/': ALL_DASHBOARD_ROLES,
  '/reports': ALL_DASHBOARD_ROLES,
  '/exercises': ALL_DASHBOARD_ROLES,
  '/settings/profile': ALL_DASHBOARD_ROLES,
  '/settings/password': ALL_DASHBOARD_ROLES,
  '/categories': ALL_DASHBOARD_ROLES,
}

export const getDefaultRouteForRole = (role: string): string => {
  if (canAccessDashboard(role)) return '/dashboard'
  return '/auth/login'
}

export const hasRouteAccess = (userRole: string, routePath: string): boolean => {
  const role = normalizeRoleKey(userRole) as UserRole
  if (ROUTE_PERMISSIONS[routePath]) {
    return ROUTE_PERMISSIONS[routePath].includes(role)
  }

  const matchingRoute = Object.keys(ROUTE_PERMISSIONS).find((route) =>
    routePath.startsWith(route)
  )

  if (matchingRoute) {
    return ROUTE_PERMISSIONS[matchingRoute].includes(role)
  }

  return false
}

export const shouldFilterData = (userRole: string, routePath: string): boolean => {
  void userRole
  void routePath
  return false
}
