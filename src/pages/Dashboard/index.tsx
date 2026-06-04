import { useEffect, useMemo, useState } from 'react'
import {
  Building2,
  CalendarCheck,
  CircleDollarSign,
  ClipboardList,
  Gauge,
  SlidersHorizontal,
  User,
  UserCheck,
  UserPlus,
  XCircle,
} from 'lucide-react'
import { OverviewKpiCard } from './OverviewKpiCard'
import { DashboardRevenueBarChart } from './DashboardRevenueBarChart'
import { DashboardActivityLineChart } from './DashboardActivityLineChart'
import { overviewByYear, overviewYears } from './dashboardData'
import { formatNumber } from '@/utils/formatters'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function formatUsd0(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

interface BusinessStat {
  key: string
  title: string
  value: string
  change: number
  changeLabel: string
  icon: typeof CircleDollarSign
}

/** Meaningful clinic business statistics. Users choose which to display. */
const ALL_STATS: BusinessStat[] = [
  { key: 'revenue', title: 'Monthly Revenue', value: formatUsd0(512612), change: 2, changeLabel: 'from last month', icon: CircleDollarSign },
  { key: 'outstanding', title: 'Outstanding Invoices', value: formatUsd0(6458), change: 2, changeLabel: 'from last month', icon: Building2 },
  { key: 'activeClients', title: 'Active Clients', value: formatNumber(2536), change: 8, changeLabel: 'from last month', icon: User },
  { key: 'paymentRate', title: 'Payment Rate', value: '80%', change: -2, changeLabel: 'from last month', icon: UserCheck },
  { key: 'newClients', title: 'New Clients (30d)', value: formatNumber(128), change: 12, changeLabel: 'from last month', icon: UserPlus },
  { key: 'appointments', title: 'Appointments This Week', value: formatNumber(342), change: 5, changeLabel: 'from last week', icon: CalendarCheck },
  { key: 'cancellation', title: 'Cancellation Rate', value: '6.4%', change: -1, changeLabel: 'from last month', icon: XCircle },
  { key: 'waitlist', title: 'Waitlist Clients', value: formatNumber(47), change: 3, changeLabel: 'from last week', icon: ClipboardList },
  { key: 'utilisation', title: 'Avg. Utilisation', value: '78%', change: 4, changeLabel: 'from last month', icon: Gauge },
]

const STORAGE_KEY = 'kaykaydee-dashboard-stats-v1'
const DEFAULT_KEYS = ['revenue', 'outstanding', 'activeClients', 'paymentRate']

function loadVisibleKeys(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_KEYS
    const parsed = JSON.parse(raw) as unknown
    if (Array.isArray(parsed) && parsed.every((k) => typeof k === 'string') && parsed.length) {
      return parsed as string[]
    }
    return DEFAULT_KEYS
  } catch {
    return DEFAULT_KEYS
  }
}

export default function Dashboard() {
  const [chartYear, setChartYear] = useState(overviewYears[0] ?? '2026')
  const [visibleKeys, setVisibleKeys] = useState<string[]>(loadVisibleKeys)

  const overviewRows = useMemo(() => overviewByYear[chartYear] ?? [], [chartYear])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleKeys))
    } catch {
      /* ignore */
    }
  }, [visibleKeys])

  const toggleStat = (key: string) => {
    setVisibleKeys((prev) => {
      if (prev.includes(key)) {
        // Keep at least one stat visible.
        return prev.length > 1 ? prev.filter((k) => k !== key) : prev
      }
      return [...prev, key]
    })
  }

  const visibleStats = useMemo(
    () => ALL_STATS.filter((s) => visibleKeys.includes(s.key)),
    [visibleKeys]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-10 gap-2 rounded-xl border-border bg-card text-accent shadow-sm hover:bg-muted/40"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Customise
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>Show statistics</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ALL_STATS.map((stat) => (
              <DropdownMenuCheckboxItem
                key={stat.key}
                checked={visibleKeys.includes(stat.key)}
                onCheckedChange={() => toggleStat(stat.key)}
                onSelect={(e) => e.preventDefault()}
              >
                {stat.title}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {visibleStats.map((stat, index) => (
          <OverviewKpiCard
            key={stat.key}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeLabel={stat.changeLabel}
            icon={stat.icon}
            featured={index === 0}
            index={index}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <DashboardActivityLineChart
          data={overviewRows}
          selectedYear={chartYear}
          onYearChange={setChartYear}
        />
        <DashboardRevenueBarChart
          data={overviewRows}
          selectedYear={chartYear}
          onYearChange={setChartYear}
        />
        <DashboardRevenueBarChart
          data={overviewRows}
          selectedYear={chartYear}
          onYearChange={setChartYear}
        />
        <DashboardActivityLineChart
          data={overviewRows}
          selectedYear={chartYear}
          onYearChange={setChartYear}
        />
      </div>
    </div>
  )
}
