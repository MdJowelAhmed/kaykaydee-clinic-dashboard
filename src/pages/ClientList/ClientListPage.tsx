import { useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { useUrlParams } from '@/hooks/useUrlState'
import { ClientListTable } from './components/ClientListTable'
import { CLIENT_LIST_DATE_OPTIONS, CLIENT_LIST_NAME_OPTIONS } from './clientListData'
import { useClientListEntries } from './ClientListEntriesContext'
import { clientJoinMonthKey } from './utils'
import type { ClientListEntry } from './types'
import { useNavigate } from 'react-router-dom'

export default function ClientListPage() {
  const { getParam, getNumberParam, setParams } = useUrlParams()
  const navigate = useNavigate()

  const search = getParam('search', '')
  const dateMonth = getParam('date', 'all')
  const nameSort = getParam('sort', 'default')
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 15)

  const { entries, removeClient } = useClientListEntries()

  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = entries.filter((row) => {
      if (dateMonth !== 'all' && clientJoinMonthKey(row.joinDate) !== dateMonth) {
        return false
      }
      if (!q) return true
      const hay = [row.idNo, row.patientName, row.contactNo, row.email, row.address]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })

    if (nameSort === 'name_asc') {
      list = [...list].sort((a, b) => a.patientName.localeCompare(b.patientName))
    } else if (nameSort === 'name_desc') {
      list = [...list].sort((a, b) => b.patientName.localeCompare(a.patientName))
    }

    return list
  }, [entries, search, dateMonth, nameSort])

  const totalPages = Math.max(1, Math.ceil(filteredList.length / limit))

  const paginatedData = useMemo(() => {
    const safePage = Math.min(page, totalPages)
    const startIndex = (safePage - 1) * limit
    return filteredList.slice(startIndex, startIndex + limit)
  }, [filteredList, page, limit, totalPages])

  const handleSearch = (value: string) => {
    setParams({ search: value, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    setParams({ page: newPage })
  }

  const handleItemsPerPageChange = (newLimit: number) => {
    setParams({ limit: newLimit, page: 1 })
  }

  const handleOpenProfile = useCallback(
    (row: ClientListEntry) => {
      navigate(`/client-list/${row.id}`)
    },
    [navigate]
  )

  const handleEdit = useCallback(
    (row: ClientListEntry) => {
      navigate(`/client-list/${row.id}/edit`)
    },
    [navigate]
  )

  const handleDelete = useCallback(
    (row: ClientListEntry) => {
      if (!window.confirm(`Remove ${row.patientName} from the list?`)) return
      removeClient(row.id)
    },
    [removeClient]
  )

  const filterInputClass =
    'h-11 rounded-lg border-border bg-white dark:bg-background text-accent shadow-sm placeholder:text-muted-foreground'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div className="overflow-hidden ">
        <div className="">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="shrink-0 space-y-1">
              <h1 className="text-xl font-bold text-accent sm:text-2xl">Clients Details</h1>
              <p className="text-sm text-accent">
                Manage your all registered patients
              </p>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
              <SearchInput
                value={search}
                onChange={handleSearch}
                placeholder="Search here"
                className="w-full min-w-0 sm:max-w-md lg:max-w-xl"
                inputClassName={filterInputClass}
              />
              <Select value={dateMonth} onValueChange={(v) => setParams({ date: v, page: 1 })}>
                <SelectTrigger
                  className={`h-11 w-full shrink-0 sm:w-[140px] ${filterInputClass}`}
                >
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  {CLIENT_LIST_DATE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={nameSort} onValueChange={(v) => setParams({ sort: v, page: 1 })}>
                <SelectTrigger
                  className={`h-11 w-full shrink-0 sm:w-[160px] ${filterInputClass}`}
                >
                  <SelectValue placeholder="Clients name" />
                </SelectTrigger>
                <SelectContent>
                  {CLIENT_LIST_NAME_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                className="h-11 shrink-0 rounded-xl bg-secondary px-4 text-white hover:bg-secondary/90"
                onClick={() => navigate('/client-list/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                add client
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-border shadow-sm">
        <CardContent className="bg-card p-4 text-card-foreground">
          <ClientListTable
            rows={paginatedData}
            onOpenProfile={handleOpenProfile}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <div className="border-t border-border px-4 sm:px-6">
            <Pagination
              variant="minimal"
              currentPage={Math.min(page, totalPages)}
              totalPages={totalPages}
              totalItems={filteredList.length}
              itemsPerPage={limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              showItemsPerPage={false}
            />
          </div>
        </CardContent>
      </Card>

    </motion.div>
  )
}
