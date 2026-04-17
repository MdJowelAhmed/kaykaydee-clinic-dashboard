import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'
import type { OverviewMonthRow } from './dashboardData'
import { overviewYears } from './dashboardData'

const TEAL = '#0d9488'
const Y_TICKS = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000]

interface DashboardActivityLineChartProps {
  data: OverviewMonthRow[]
  selectedYear: string
  onYearChange: (year: string) => void
}

const kFormatter = (v: number) => `${v / 1000}k`

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number }[] }) => {
  if (active && payload?.length) {
    const n = payload[0].value
    return (
      <div className="rounded-md bg-[#364355] px-3 py-1.5 text-sm font-medium text-white shadow-lg">
        <p>{kFormatter(n)}</p>
      </div>
    )
  }
  return null
}

export function DashboardActivityLineChart({
  data,
  selectedYear,
  onYearChange,
}: DashboardActivityLineChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.22 }}
    >
      <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-slate-900">Activity Statistics</h2>
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
              <LineChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 4 }}>
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
                  domain={[1000, 10000]}
                  ticks={Y_TICKS}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="activity"
                  stroke={TEAL}
                  strokeWidth={2.5}
                  dot={{
                    fill: TEAL,
                    strokeWidth: 2,
                    stroke: '#fff',
                    r: 4,
                  }}
                  activeDot={{ r: 6, fill: TEAL, stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
