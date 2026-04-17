import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'
import type { OverviewMonthRow } from './dashboardData'
import { overviewYears } from './dashboardData'

const PURPLE = '#7c3aed'
const Y_TICKS = [5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000]

interface DashboardRevenueBarChartProps {
  data: OverviewMonthRow[]
  selectedYear: string
  onYearChange: (year: string) => void
}

function formatTooltipExact(value: unknown): string {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number }[] }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-md bg-[#364355] px-3 py-1.5 text-sm font-medium text-white shadow-lg">
        <p>{formatTooltipExact(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

const kFormatter = (v: number) => `${v / 1000}k`

export function DashboardRevenueBarChart({
  data,
  selectedYear,
  onYearChange,
}: DashboardRevenueBarChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
    >
      <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-slate-900">Revenue Statistics</h2>
            <Select value={selectedYear} onValueChange={onYearChange}>
              <SelectTrigger className="h-9 w-[100px] shrink-0 border-slate-200 bg-white text-sm font-medium">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {overviewYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[260px] w-full sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={kFormatter}
                  domain={[5000, 50000]}
                  ticks={Y_TICKS}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124, 58, 237, 0.06)' }} />
                <Bar dataKey="revenue" fill={PURPLE} radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
