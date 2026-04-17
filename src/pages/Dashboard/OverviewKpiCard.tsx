import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/utils/cn'
import { motion } from 'framer-motion'
import { formatPercentage } from '@/utils/formatters'

export interface OverviewKpiCardProps {
  title: string
  value: string
  change: number
  changeLabel: string
  icon: React.ElementType
  index: number
  /** Kept for API compatibility; styling matches other cards (white / black hover). */
  featured?: boolean
}

export function OverviewKpiCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  index,
}: OverviewKpiCardProps) {
  const isPositive = change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm',
        'transition-shadow duration-200 hover:shadow-md'
      )}
    >
      <div className="relative z-10 flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100">
          <Icon className="h-5 w-5 text-violet-600" aria-hidden />
        </div>
      </div>
      <p className="relative z-10 mt-4 text-3xl font-bold tracking-tight text-slate-900 xl:text-[2rem]">
        {value}
      </p>
      <div className="relative z-10 mt-2 flex flex-wrap items-center gap-x-1 text-xs">
        <span
          className={cn(
            'inline-flex items-center gap-0.5 font-semibold',
            isPositive ? 'text-emerald-600' : 'text-red-600'
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" aria-hidden />
          )}
          {formatPercentage(change)}
        </span>
        <span className="text-slate-500">{changeLabel}</span>
      </div>
    </motion.div>
  )
}
