import { Card, CardContent } from '@/components/ui/card'
import { MoreHorizontal } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import type { ReportsChartPoint } from '../reportsChartsData'
import { REPORTS_WEEK_RANGE_LABEL, REPORTS_WEEK_TOTALS } from '../reportsChartsData'

const PURPLE = '#7c3aed'

function formatPct(v: number): string {
  return `${v}%`
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean
  payload?: { value: number }[]
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md bg-[#364355] px-3 py-1.5 text-sm font-medium text-white shadow-lg">
      <p>{formatPct(payload[0].value)}</p>
    </div>
  )
}

export function ReportsUtilisationChart({ data }: { data: ReportsChartPoint[] }) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Utilisation</p>
            <p className="mt-0.5 text-[11px] text-slate-500">Percentage of available time utilised</p>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="More"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-xl font-bold text-slate-900">{REPORTS_WEEK_TOTALS.utilisationPct.toFixed(2)}%</p>
          <p className="text-xs text-slate-500">{REPORTS_WEEK_RANGE_LABEL}</p>
        </div>

        <div className="mt-4 h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={formatPct}
                domain={[0, 30]}
                ticks={[0, 10, 20, 30]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="utilisationPct"
                stroke={PURPLE}
                strokeWidth={2.5}
                dot={{ r: 0 }}
                activeDot={{ r: 5, fill: PURPLE, stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

