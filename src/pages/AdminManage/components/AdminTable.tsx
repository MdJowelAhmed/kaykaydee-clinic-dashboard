import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/formatters'
import type { AdminRow } from '../types'
import { AdminRowActions } from './AdminRowActions'

function RolePill({ role }: { role: AdminRow['role'] }) {
  return (
    <span className="inline-flex min-w-[110px] justify-center rounded-md bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
      {role === 'head-admin' ? 'Head Admin' : 'Manager'}
    </span>
  )
}

function StatusPill({ status }: { status: AdminRow['status'] }) {
  const isActive = status === 'active'
  return (
    <span
      className={cn(
        'inline-flex min-w-[90px] justify-center rounded-md px-3 py-1 text-xs font-semibold',
        isActive ? 'bg-secondary text-white' : 'bg-muted text-muted-foreground'
      )}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}

interface AdminTableProps {
  rows: AdminRow[]
  onInfo: (row: AdminRow) => void
  onEdit: (row: AdminRow) => void
}

const headerBg = 'bg-[#E9EBF0] dark:bg-background'

const headerCell =
  'border-x-0 border-t-0 border-b border-border px-4 text-sm font-semibold text-accent sm:px-6 sm:py-4 align-middle '

const bodyCell = 'border-b border-border px-4 py-3 text-sm text-accent sm:px-6 sm:py-4'

export function AdminTable({ rows, onInfo, onEdit }: AdminTableProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-thin rounded-b-2xl">
      <table className="w-full min-w-[980px] border-separate border-spacing-0">
        <thead>
          <tr>
            <th
              className={cn(
                headerCell,
                headerBg,
                'text-left rounded-l-full '
              )}
            >
              Admin Id
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Clinic Name</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Join Date</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Role</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Status</th>
            <th
              className={cn(
                headerCell,
                headerBg,
                'text-right rounded-r-full'
              )}
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-card text-accent-foreground">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="border-b border-black px-6 py-10 text-center text-sm text-accent"
              >
                No admins found
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(0.04 * index, 0.4) }}
                className="hover:bg-muted/15 transition-colors"
              >
                <td className={bodyCell}>{row.id}</td>
                <td className={bodyCell}>{row.clinicName}</td>
                <td className={bodyCell}>{formatDate(row.joinDate, 'd MMM yyyy')}</td>
                <td className={bodyCell}>
                  <RolePill role={row.role} />
                </td>
                <td className={bodyCell}>
                  <StatusPill status={row.status} />
                </td>
                <td className={bodyCell}>
                  <AdminRowActions onInfo={() => onInfo(row)} onEdit={() => onEdit(row)} />
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

