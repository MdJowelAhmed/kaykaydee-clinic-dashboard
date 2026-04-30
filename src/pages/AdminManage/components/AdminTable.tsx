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

export function AdminTable({ rows, onInfo, onEdit }: AdminTableProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-thin rounded-b-2xl">
      <table className="w-full min-w-[980px]">
        <thead>
          <tr className="bg-primary text-accent-foreground">
            <th className="px-4 py-3 text-left text-sm font-semibold  rounded-tl-2xl sm:px-6 sm:py-4">Admin Id</th>
            <th className="px-4 py-3 text-left text-sm font-semibold  sm:px-6 sm:py-4">clinic Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold  sm:px-6 sm:py-4">Join Date</th>
            <th className="px-4 py-3 text-left text-sm font-semibold  sm:px-6 sm:py-4">Role</th>
            <th className="px-4 py-3 text-left text-sm font-semibold  sm:px-6 sm:py-4">Status</th>
            <th className="px-4 py-3 text-right text-sm font-semibold  rounded-tr-2xl sm:px-6 sm:py-4">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card text-accent-foreground">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-accent text-sm">
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
                <td className="px-4 py-3 text-sm text-accent sm:px-6 sm:py-4">{row.id}</td>
                <td className="px-4 py-3 text-sm text-accent sm:px-6 sm:py-4">{row.clinicName}</td>
                <td className="px-4 py-3 text-sm text-accent sm:px-6 sm:py-4">
                  {formatDate(row.joinDate, 'd MMM yyyy')}
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <RolePill role={row.role} />
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <StatusPill status={row.status} />
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
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

