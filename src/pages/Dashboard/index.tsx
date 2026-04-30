import { useState, useMemo } from 'react'
import { Building2, CircleDollarSign, User, UserCheck } from 'lucide-react'
import { OverviewKpiCard } from './OverviewKpiCard'
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
        icon: UserCheck,
        featured: false as const,
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-accent sm:text-3xl">Platform Analytics</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Monitor platform performance and usage metrics
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((stat, index) => (
          <OverviewKpiCard key={stat.title} {...stat} index={index} />
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
