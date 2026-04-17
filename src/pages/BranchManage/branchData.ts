import type { BranchEntry, BranchStatus } from './types'

const BRANCH_NAMES = ['Branch 1', 'Branch 2', 'Branch 3', 'Branch 4', 'Branch 5']

function makeBranch(i: number): BranchEntry {
  const day = 1 + (i % 28)
  const joinDate = new Date(2025, 0, day, 12, 0).toISOString()
  const name = BRANCH_NAMES[i % BRANCH_NAMES.length]
  return {
    id: `br-${i + 1}`,
    branchName: name,
    joinDate,
    email: `alexsadman${(i % 20) + 1}@gmail.com`,
    status: i % 8 === 0 ? 'inactive' : 'active',
  }
}

export const INITIAL_BRANCHES: BranchEntry[] = Array.from({ length: 80 }, (_, i) => makeBranch(i))

export const BRANCH_STATUS_OPTIONS: { value: BranchStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

