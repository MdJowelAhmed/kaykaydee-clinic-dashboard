export type BranchStatus = 'active' | 'inactive'

export interface BranchEntry {
  id: string
  branchName: string
  joinDate: string // ISO
  email: string
  status: BranchStatus
}

