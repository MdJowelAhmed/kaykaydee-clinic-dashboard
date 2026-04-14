import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/formatters'
import type { AdminRow } from '../types'
import { AdminRowActions } from './AdminRowActions'

function RolePill({ role }: { role: AdminRow['role'] }) {
  return (
    <span className="inline-flex min-w-[110px] justify-center rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
      {role === 'head-admin' ? 'Head Admin' : 'Admin'}
    </span>
  )
}

function StatusPill({ status }: { status: AdminRow['status'] }) {
  const isActive = status === 'active'
  return (
    <span
      className={cn(
        'inline-flex min-w-[90px] justify-center rounded-md px-3 py-1 text-xs font-semibold',
        isActive ? 'bg-[#0F1F44] text-white' : 'bg-slate-200 text-slate-700'
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
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[980px]">
        <thead>
          <tr className="bg-slate-200/70 text-slate-700">
            <th className="px-6 py-4 text-left text-sm font-semibold rounded-tl-2xl">Admin Id</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">clinic Name</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Join Date</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
            <th className="px-6 py-4 text-right text-sm font-semibold rounded-tr-2xl">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-slate-500 text-sm">
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
                className="hover:bg-slate-50/80 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-slate-600">{row.id}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{row.clinicName}</td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  {formatDate(row.joinDate, 'd MMM yyyy')}
                </td>
                <td className="px-6 py-4">
                  <RolePill role={row.role} />
                </td>
                <td className="px-6 py-4">
                  <StatusPill status={row.status} />
                </td>
                <td className="px-6 py-4">
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

