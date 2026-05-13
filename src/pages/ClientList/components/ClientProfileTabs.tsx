import type { ReactNode } from 'react'
import {
  User,
  Calendar,
  FolderOpen,
  FileText,
  HeartPulse,
  Receipt,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/utils/cn'

export const CLIENT_PROFILE_TAB_PROFILE = 'profile'

const TAB_DEFS = [
  { id: CLIENT_PROFILE_TAB_PROFILE, label: 'Clients Profile', Icon: User },
  { id: 'appointments', label: 'Appointments', Icon: Calendar },
  { id: 'documents', label: 'Clients Documents', Icon: FolderOpen },
  { id: 'reports', label: "Dr.'s Reports", Icon: FileText },
  { id: 'exercises', label: 'Exercises', Icon: HeartPulse },
  { id: 'invoice', label: 'Invoice', Icon: Receipt },
] as const

const triggerClass =
    'inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-accent transition-colors data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-none'

const listClass =
  'flex h-auto min-h-12 w-full flex-wrap items-center justify-start gap-1 rounded-xl border border-border bg-muted/25 p-1.5'

interface ClientProfileTabsProps {
  value: string
  onValueChange: (v: string) => void
  profileContent: ReactNode
  documentsContent?: ReactNode
  appointmentsContent?: ReactNode
  reportsContent?: ReactNode
  exercisesContent?: ReactNode
  invoiceContent?: ReactNode
  className?: string
}

export function ClientProfileTabs({
  value,
  onValueChange,
  profileContent,
  documentsContent,
  appointmentsContent,
  reportsContent,
  exercisesContent,
  invoiceContent,
  className,
}: ClientProfileTabsProps) {
  const placeholder = (
    <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center text-sm text-accent">
      No data in this section yet.
    </div>
  )

  return (
    <Tabs value={value} onValueChange={onValueChange} className={cn('w-full space-y-4', className)}>
      <TabsList className={listClass}>
        {TAB_DEFS.map(({ id, label, Icon }) => (
          <TabsTrigger key={id} value={id} className={triggerClass}>
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={CLIENT_PROFILE_TAB_PROFILE} className="mt-0 outline-none">
        {profileContent}
      </TabsContent>
      <TabsContent value="appointments" className="mt-0 outline-none">
        {appointmentsContent ?? placeholder}
      </TabsContent>
      <TabsContent value="documents" className="mt-0 outline-none">
        {documentsContent ?? placeholder}
      </TabsContent>
      <TabsContent value="reports" className="mt-0 outline-none">
        {reportsContent ?? placeholder}
      </TabsContent>
      <TabsContent value="exercises" className="mt-0 outline-none">
        {exercisesContent ?? placeholder}
      </TabsContent>
      <TabsContent value="invoice" className="mt-0 outline-none">
        {invoiceContent ?? placeholder}
      </TabsContent>
    </Tabs>
  )
}
