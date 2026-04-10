import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { User } from '@/types'

const ROLE_LABELS: Record<User['role'], string> = {
  admin: 'Admin',
  user: 'Staff',
  moderator: 'Doctor',
  editor: 'Doctor',
}

function userDisplayName(user: User) {
  return user.organizationName?.trim() || `${user.firstName} ${user.lastName}`.trim()
}

interface UserManagementTableProps {
  users: User[]
  onView: (user: User) => void
}

export function UserManagementTable({ users, onView }: UserManagementTableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[1100px]">
        <thead>
          <tr className="bg-primary text-white">
            <th className="px-6 py-4 text-left text-sm font-bold">S. No</th>
            <th className="px-6 py-4 text-left text-sm font-bold">User Name</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Role</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Clinics</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Contact</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
            <th className="px-6 py-4 text-right text-sm font-bold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => onView(user)}
                    className="text-sm font-medium text-blue-600 underline cursor-pointer hover:text-blue-700"
                  >
                    #{user.id}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{userDisplayName(user)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{ROLE_LABELS[user.role]}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{user.clinicName ?? '—'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{user.phone}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700 break-all">{user.email}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      'inline-flex items-center px-3 py-1 min-w-[90px] justify-center text-center rounded-sm text-xs font-medium capitalize',
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : user.status === 'pending'
                          ? 'bg-orange-100 text-orange-800'
                          : user.status === 'blocked'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                    )}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(user)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
