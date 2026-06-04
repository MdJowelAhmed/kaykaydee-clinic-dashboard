import { AlertTriangle } from 'lucide-react'
import { cn } from '@/utils/cn'

/**
 * Prominent client safety/clinical alert. Designed to be reused anywhere a client
 * is in focus — profile, appointment scheduling, calendar, invoicing — so important
 * information is immediately visible. Renders nothing when there is no alert.
 */
export function ClientAlertsBanner({
  alerts,
  className,
}: {
  alerts?: string
  className?: string
}) {
  const text = alerts?.trim()
  if (!text) return null
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-rose-900 shadow-sm',
        'dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200',
        className
      )}
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-300">
        <AlertTriangle className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wide text-rose-600 dark:text-rose-300">
          Alerts
        </p>
        <p className="mt-0.5 whitespace-pre-wrap break-words text-sm font-medium leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  )
}
