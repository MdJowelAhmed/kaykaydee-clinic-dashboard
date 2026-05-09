import { useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUrlParams } from '@/hooks/useUrlState'
import { useNavigate } from 'react-router-dom'
import { ContactListTable } from './components/ContactListTable'
import { useContactEntries } from './ContactEntriesContext'
import { getCompanyOptionsFromEntries, getTypeOptionsFromEntries } from './contactListData'
import type { ContactEntry } from './types'

export default function ContactListPage() {
  const { getParam, getNumberParam, setParams } = useUrlParams()
  const navigate = useNavigate()
  const { entries, remove } = useContactEntries()

  const search = getParam('search', '')
  const type = getParam('type', 'all')
  const company = getParam('company', 'all')
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 15)

  const typeOptions = useMemo(() => getTypeOptionsFromEntries(entries), [entries])
  const companyOptions = useMemo(() => getCompanyOptionsFromEntries(entries), [entries])

  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase()
    return entries.filter((row) => {
      if (type !== 'all' && row.type !== type) return false
      if (company !== 'all' && row.company !== company) return false
      if (!q) return true
      const hay = [row.name, row.type, row.company, row.email, row.contactNo].join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [entries, search, type, company])

  const totalPages = Math.max(1, Math.ceil(filteredList.length / limit))

  const paginatedData = useMemo(() => {
    const safePage = Math.min(page, totalPages)
    const startIndex = (safePage - 1) * limit
    return filteredList.slice(startIndex, startIndex + limit)
  }, [filteredList, page, limit, totalPages])

  const handleSearch = (value: string) => setParams({ search: value, page: 1 })
  const handlePageChange = (newPage: number) => setParams({ page: newPage })
  const handleItemsPerPageChange = (newLimit: number) => setParams({ limit: newLimit, page: 1 })

  const handleView = useCallback(
    (row: ContactEntry) => navigate(`/contact-list/${row.id}`),
    [navigate]
  )
  const handleEdit = useCallback(
    (row: ContactEntry) => navigate(`/contact-list/${row.id}/edit`),
    [navigate]
  )
  const handleDelete = useCallback(
    (row: ContactEntry) => {
      if (!window.confirm(`Remove ${row.name} from the list?`)) return
      remove(row.id)
    },
    [remove]
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
              <h1 className="text-xl font-bold text-accent sm:text-2xl">Contact list</h1>
              <p className="text-sm text-muted-foreground">Manage provider details</p>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
              <SearchInput
                value={search}
                onChange={handleSearch}
                placeholder="Search here"
                className="w-full min-w-0 sm:max-w-md lg:max-w-xl"
                inputClassName={filterInputClass}
              />
              <Select value={type} onValueChange={(v) => setParams({ type: v, page: 1 })}>
                <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[140px] ${filterInputClass}`}>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={company} onValueChange={(v) => setParams({ company: v, page: 1 })}>
                <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[150px] ${filterInputClass}`}>
                  <SelectValue placeholder="Company" />
                </SelectTrigger>
                <SelectContent>
                  {companyOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                className="h-11 shrink-0 rounded-xl bg-secondary px-4 text-white hover:bg-secondary/90"
                onClick={() => navigate('/contact-list/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                + Add Provider
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-border shadow-sm">
        <CardContent className="bg-card p-4 text-card-foreground">
          <ContactListTable rows={paginatedData} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />

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

