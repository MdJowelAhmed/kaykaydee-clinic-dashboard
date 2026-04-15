import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { SendHorizontal } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SearchInput } from '@/components/common/SearchInput'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ModalWrapper } from '@/components/common/ModalWrapper'
import { NotificationListItem } from '@/components/common/NotificationListItem'
import { Pagination } from '@/components/common/Pagination'
import { useUrlParams } from '@/hooks/useUrlState'
import { MOCK_NOTIFICATIONS, type NotificationEntry } from '@/mocks/notificationData'

export default function NotificationPage() {
  const { getParam, getNumberParam, setParams } = useUrlParams()
  const tab = getParam('tab', 'inbox') as 'inbox' | 'sent'
  const search = getParam('search', '')
  const dateFilter = getParam('date', 'all')
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 15)

  const [detailsItem, setDetailsItem] = useState<NotificationEntry | null>(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [composeConfirmed, setComposeConfirmed] = useState(false)
  const [composeTo, setComposeTo] = useState('')
  const [composeSubject, setComposeSubject] = useState('')
  const [composeMessage, setComposeMessage] = useState('')

  const DATE_OPTIONS = [
    { value: 'all', label: 'Date' },
    { value: 'today', label: 'Today' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
  ] as const

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const now = Date.now()
    const MS_DAY = 86400000
    return MOCK_NOTIFICATIONS.filter((n) => {
      if (n.box !== tab) return false
      if (dateFilter !== 'all') {
        const t = new Date(n.date).getTime()
        if (Number.isNaN(t)) return false
        if (dateFilter === 'today') {
          const d = new Date(t)
          const today = new Date(now)
          if (
            d.getFullYear() !== today.getFullYear() ||
            d.getMonth() !== today.getMonth() ||
            d.getDate() !== today.getDate()
          ) {
            return false
          }
        }
        if (dateFilter === '7d' && t < now - 7 * MS_DAY) return false
        if (dateFilter === '30d' && t < now - 30 * MS_DAY) return false
      }
      if (!q) return true
      return (
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        (n.recipientsLabel?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [tab, search, dateFilter])

  const totalItems = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalItems / limit))

  const pageItems = useMemo(() => {
    const safePage = Math.min(page, totalPages)
    const start = (safePage - 1) * limit
    return filtered.slice(start, start + limit)
  }, [page, limit, filtered, totalPages])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Tabs
              value={tab}
              onValueChange={(v) => setParams({ tab: v, page: 1 })}
              className="w-full lg:w-auto"
            >
              <TabsList className="bg-slate-100 rounded-full p-1 h-10">
                <TabsTrigger
                  value="inbox"
                  className="rounded-full data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                >
                  Inbox
                </TabsTrigger>
                <TabsTrigger
                  value="sent"
                  className="rounded-full data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                >
                  Sent
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:flex-wrap w-full lg:w-auto">
              <SearchInput
                value={search}
                onChange={(value) => setParams({ search: value, page: 1 })}
                placeholder="Search here"
                className="w-full sm:w-[420px]"
                inputClassName="h-11 rounded-xl border-slate-200 bg-white shadow-sm"
              />
              <Select value={dateFilter} onValueChange={(v) => setParams({ date: v, page: 1 })}>
                <SelectTrigger className="h-11 w-full sm:w-[140px] rounded-xl border-slate-200 bg-white shadow-sm">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  {DATE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {tab === 'sent' && (
                <Button
                  type="button"
                  className="h-11 rounded-xl bg-secondary text-white hover:bg-secondary/90"
                  onClick={() => {
                    setComposeOpen(true)
                    setComposeConfirmed(false)
                  }}
                >
                  <SendHorizontal className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <CardContent className="p-4 sm:p-6 space-y-3">
          {pageItems.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">No notifications found</div>
          ) : (
            pageItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(0.04 * index, 0.35) }}
              >
                <NotificationListItem
                  item={item}
                  showActions
                  onInfo={(it) => setDetailsItem(it)}
                  onDelete={() => {
                    // mock-only UI: no persistence yet
                  }}
                />
              </motion.div>
            ))
          )}
        </CardContent>

        <div className="border-t border-slate-100 px-4 sm:px-6">
          <Pagination
            variant="minimal"
            showItemsPerPage={false}
            currentPage={Math.min(page, totalPages)}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={limit}
            onPageChange={(p) => setParams({ page: p })}
          />
        </div>
      </Card>

      <ModalWrapper
        open={!!detailsItem}
        onClose={() => setDetailsItem(null)}
        title="Notification details"
        description={detailsItem ? `${detailsItem.title}` : undefined}
        size="md"
        className="max-w-md bg-white"
      >
        {detailsItem && (
          <div className="space-y-2 text-sm">
            {detailsItem.box === 'sent' && detailsItem.recipientsLabel ? (
              <p className="text-slate-700">
                <span className="text-slate-500">To:</span> {detailsItem.recipientsLabel}
              </p>
            ) : null}
            <p className="text-slate-700">
              <span className="text-slate-500">Message:</span> {detailsItem.description}
            </p>
          </div>
        )}
      </ModalWrapper>

      <ModalWrapper
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        title="Send Message"
        description={undefined}
        size="lg"
        className="max-w-2xl bg-white"
      >
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">NewMessage</p>
              <p className="text-sm text-slate-500">
                he Straight Leg Raise (SLR) is one of the most commonly prescribed physiotherapy
                exercises for
              </p>
            </div>
            <p className="text-xs text-slate-500 whitespace-nowrap">2, jan 2026</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">To :</label>
                <span className="text-xs text-slate-400">Select your client here</span>
              </div>
              <div className="relative">
                <Input
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="Add members"
                  className="rounded-xl border-slate-200 bg-white pr-16"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                  All
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Subject</label>
              <Input
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                placeholder="Include message topic"
                className="rounded-xl border-slate-200 bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Message</label>
              <Textarea
                value={composeMessage}
                onChange={(e) => setComposeMessage(e.target.value)}
                placeholder=""
                className="min-h-[220px] rounded-xl border-slate-200 bg-white"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm text-slate-600 select-none">
            <Checkbox
              checked={composeConfirmed}
              onCheckedChange={(v) => setComposeConfirmed(v === true)}
            />
            Confirm changes of this message
          </label>

          <div className="flex justify-end">
            <Button
              type="button"
              className="h-11 rounded-xl bg-slate-900 text-white hover:bg-slate-900/90 px-8"
              disabled={!composeConfirmed}
              onClick={() => {
                setComposeOpen(false)
                setComposeTo('')
                setComposeSubject('')
                setComposeMessage('')
                setComposeConfirmed(false)
              }}
            >
              <SendHorizontal className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </ModalWrapper>
    </motion.div>
  )
}
