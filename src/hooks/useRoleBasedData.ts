import { useMemo } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { UserRole, canAccessDashboard } from '@/types/roles'

interface DataItem {
  businessId?: string
  userId?: string
  [key: string]: string | number | undefined
}

/** Head Admin and Manager see all rows. */
export const useRoleBasedData = <T extends DataItem>(data: T[]): T[] => {
  const { user } = useAppSelector((state) => state.auth)

  return useMemo(() => {
    if (!user) return []

    if (canAccessDashboard(user.role)) {
      return data
    }

    return []
  }, [data, user])
}

/** True when the logged-in user is Manager. */
export const useIsAdmin = (): boolean => {
  const { user } = useAppSelector((state) => state.auth)
  return user?.role === UserRole.MANAGER
}

/** @deprecated Use `useIsAdmin` (legacy name for the admin role). */
export const useIsHost = (): boolean => {
  const { user } = useAppSelector((state) => state.auth)
  return user?.role === UserRole.MANAGER
}

export const useIsBusiness = (): boolean => {
  const { user } = useAppSelector((state) => state.auth)
  void user
  return false
}

export const useBusinessId = (): string | undefined => {
  const { user } = useAppSelector((state) => state.auth)
  return user?.businessId
}

export const useCanModifyItem = (item: DataItem): boolean => {
  const { user } = useAppSelector((state) => state.auth)

  if (!user) return false

  if (canAccessDashboard(user.role)) {
    return true
  }

  void item
  return false
}
