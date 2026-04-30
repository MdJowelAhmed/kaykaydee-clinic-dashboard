import type { ReactNode } from 'react'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/utils/cn'

export function clientNameInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export function ClientProfilePageHeader({
  title,
  onBack,
  actions,
}: {
  title: string
  onBack: () => void
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
      <button
          type="button"
          onClick={onBack}
          className="mb-1 inline-flex items-center gap-1.5 text-sm text-accent transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          Back to patients management
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-accent">{title}</h1>
       
      </div>
      {actions}
    </div>
  )
}

export function ClientProfileEditDeleteActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="outline"
        className="h-10 gap-2 rounded-xl border-border bg-card px-4 text-accent shadow-sm hover:bg-muted/40"
        onClick={onEdit}
      >
        <Pencil className="h-4 w-4" />
        Edit
      </Button>
      <Button
        type="button"
        variant="outline"
        className="h-10 gap-2 rounded-xl border-border bg-card px-4 text-accent shadow-sm hover:bg-muted/40"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  )
}

export function ClientProfileSummaryCard({
  displayName,
  patientIdLine,
  initials,
  className,
}: {
  displayName: string
  patientIdLine: string
  initials: string
  className?: string
}) {
  return (
    <Card className={cn('rounded-2xl border border-border shadow-sm', className)}>
      <CardContent className="flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <Avatar className="h-20 w-20 shrink-0 border-0 sm:h-24 sm:w-24">
          <AvatarFallback className="bg-primary text-lg font-bold text-white sm:text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-xl font-bold text-accent sm:text-2xl">{displayName}</p>
          <p className="mt-1 text-sm text-accent">{patientIdLine}</p>
        </div>
      </CardContent>
    </Card>
  )
}
