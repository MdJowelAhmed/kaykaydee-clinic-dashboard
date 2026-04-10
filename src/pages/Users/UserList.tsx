import { useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { UserManagementTable } from './components/UserManagementTable'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setFilters, setPage, setLimit } from '@/redux/slices/userSlice'
import { useUrlParams } from '@/hooks/useUrlState'
import { USER_STATUSES, USER_PACKAGES } from '@/utils/constants'
import type { User } from '@/types'
import { cn } from '@/utils/cn'

export default function UserList() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { filteredList, pagination } = useAppSelector((state) => state.users)

  const { getParam, getNumberParam, setParam, setParams } = useUrlParams()

  const search = getParam('search', '')
  const status = getParam('status', 'all')
  const packageFilter = getParam('package', 'all')
  const tab = getParam('tab', 'subscription')
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 10)

  useEffect(() => {
    dispatch(
      setFilters({
        search,
        status: status as User['status'] | 'all',
        role: 'all',
        package: (packageFilter === 'all' ? 'all' : packageFilter) as User['packagePlan'] | 'all',
      })
    )
  }, [search, status, packageFilter, dispatch])

  useEffect(() => {
    dispatch(setPage(page))
  }, [page, dispatch])

  useEffect(() => {
    dispatch(setLimit(limit))
  }, [limit, dispatch])

  const listForTab = useMemo(() => {
    if (tab === 'members') {
      return filteredList.filter((u) => u.membershipType === 'member')
    }
    return filteredList.filter((u) => u.membershipType === 'subscription')
  }, [filteredList, tab])

  const totalPages = Math.max(1, Math.ceil(listForTab.length / pagination.limit))

  const paginatedData = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit
    return listForTab.slice(startIndex, startIndex + pagination.limit)
  }, [listForTab, pagination.page, pagination.limit])

  const handleSearch = (value: string) => {
    setParams({ search: value, page: 1 })
  }

  const handleStatusFilter = (value: string) => {
    setParams({ status: value, page: 1 })
  }

  const handlePackageFilter = (value: string) => {
    setParams({ package: value, page: 1 })
  }

  const handleTabChange = (next: 'subscription' | 'members') => {
    setParams({ tab: next, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    setParam('page', newPage)
  }

  const handleItemsPerPageChange = (newLimit: number) => {
    setParams({ limit: newLimit, page: 1 })
  }

  const handleView = (user: User) => {
    navigate(`/users/${user.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-8"
    >
      {/* Toolbar: separate block above the table */}
      <Card className="bg-white border border-slate-100 shadow-sm overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <h1 className="text-xl font-bold text-slate-800 shrink-0">
                User Management
              </h1>
              <div className="inline-flex items-center gap-1 rounded-md bg-slate-100 p-1 w-fit">
                <button
                  type="button"
                  onClick={() => handleTabChange('subscription')}
                  className={cn(
                    'rounded-sm px-3 py-1.5 text-sm font-medium transition-colors',
                    tab === 'subscription'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  )}
                >
                  Monthly Subscription
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('members')}
                  className={cn(
                    'rounded-sm px-3 py-1.5 text-sm font-medium transition-colors',
                    tab === 'members'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  )}
                >
                  Clinic Members
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
              <SearchInput
                value={search}
                onChange={handleSearch}
                placeholder="Search here"
                className="w-full sm:w-[280px]"
              />
              <Select value={packageFilter} onValueChange={handlePackageFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-secondary hover:bg-secondary text-white border-secondary">
                  <SelectValue placeholder="Package" />
                </SelectTrigger>
                <SelectContent>
                  {USER_PACKAGES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-secondary hover:bg-secondary text-white border-secondary">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {USER_STATUSES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table + pagination */}
      <Card className="bg-white border border-slate-100 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <UserManagementTable users={paginatedData} onView={handleView} />

          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination
              currentPage={Math.min(pagination.page, totalPages)}
              totalPages={totalPages}
              totalItems={listForTab.length}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
