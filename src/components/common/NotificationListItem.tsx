import { Info, Mail, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import type { NotificationEntry } from '@/mocks/notificationData'

interface NotificationListItemProps {
  item: NotificationEntry
  className?: string
  showActions?: boolean
  onInfo?: (item: NotificationEntry) => void
  onDelete?: (item: NotificationEntry) => void
}

function formatShortDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function NotificationListItem({
  item,
  className,
  showActions = false,
  onInfo,
  onDelete,
}: NotificationListItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm',
        className
      )}
    >
      <div
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
          item.box === 'sent' ? 'bg-emerald-50 text-emerald-600' : 'bg-violet-50 text-violet-600'
        )}
        aria-hidden
      >
        <Mail className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900">{item.title}</p>
        <p className="text-sm text-muted-foreground leading-snug">{item.description}</p>
      </div>

      {item.box === 'sent' && item.recipientsLabel ? (
        <div className="hidden lg:block min-w-[240px] text-right">
          <p className="text-xs text-slate-500 truncate">{item.recipientsLabel}</p>
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {formatShortDate(item.date)}
        </span>
        {showActions && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-9 w-9 rounded-full text-slate-500 hover:text-secondary hover:bg-slate-100"
              onClick={() => onInfo?.(item)}
              aria-label="Details"
            >
              <Info className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-9 w-9 rounded-full text-slate-500 hover:text-destructive hover:bg-slate-100"
              onClick={() => onDelete?.(item)}
              aria-label="Delete"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
