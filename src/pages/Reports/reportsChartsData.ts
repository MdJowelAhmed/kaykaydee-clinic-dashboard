export type ReportsChartPoint = {
  label: string
  utilisationPct: number
  revenueUsd: number
}

// Mock weekly window to match the screenshot (16–22 Mar).
export const REPORTS_WEEK_RANGE_LABEL = '16 Mar 26 — 22 Mar 26'

export const REPORTS_WEEK_POINTS: ReportsChartPoint[] = [
  { label: '16 Mar', utilisationPct: 8, revenueUsd: 220 },
  { label: '17 Mar', utilisationPct: 28, revenueUsd: 780 },
  { label: '18 Mar', utilisationPct: 0, revenueUsd: 0 },
  { label: '19 Mar', utilisationPct: 0, revenueUsd: 0 },
  { label: '20 Mar', utilisationPct: 24, revenueUsd: 410 },
  { label: '21 Mar', utilisationPct: 10, revenueUsd: 260 },
  { label: '22 Mar', utilisationPct: 10, revenueUsd: 100 },
]

export const REPORTS_WEEK_TOTALS = {
  utilisationPct: 11.76,
  revenueUsd: 1770,
} as const

