import { useState, useMemo } from 'react'
import { Building2, CircleDollarSign, User, Users } from 'lucide-react'
import { OverviewKpiCard } from './OverviewKpiCard'
import { DashboardMessagePanel } from './DashboardMessagePanel'
import { DashboardRevenueBarChart } from './DashboardRevenueBarChart'
import { DashboardActivityLineChart } from './DashboardActivityLineChart'
import { overviewByYear, overviewYears } from './dashboardData'
import { formatNumber } from '@/utils/formatters'

function formatUsd0(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function Dashboard() {
  const [chartYear, setChartYear] = useState(overviewYears[0] ?? '2026')

  const overviewRows = useMemo(() => overviewByYear[chartYear] ?? [], [chartYear])

  const kpis = useMemo(
    () => [
      {
        title: 'Monthly Revenue',
        value: formatUsd0(512612),
        change: 2,
        changeLabel: 'from last month',
        icon: CircleDollarSign,
        featured: true as const,
      },
      {
        title: 'Pending Payment',
        value: formatUsd0(6458),
        change: 2,
        changeLabel: 'from last month',
        icon: Building2,
        featured: false as const,
      },
      {
        title: 'Total Patients',
        value: formatNumber(2536),
        change: 8,
        changeLabel: 'from last month',
        icon: User,
        featured: false as const,
      },
      {
        title: 'Payment Rate',
        value: '80%',
        change: -2,
        changeLabel: 'from last month',
        icon: Users,
        featured: false as const,
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((stat, index) => (
          <OverviewKpiCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <div className="min-h-[560px] lg:min-h-[620px]">
          <DashboardMessagePanel />
        </div>
        <div className="flex min-h-0 flex-col gap-6">
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
    </div>
  )
}
