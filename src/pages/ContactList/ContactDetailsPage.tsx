import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { useContactEntries } from './ContactEntriesContext'
import { contactInitials, contactProviderIdRef } from './utils'
import type { ContactEntry } from './types'
import { ContactEditDeleteActions, ContactPageHeader, ContactSummaryCard } from './components/ContactHeaderParts'

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-accent">{value}</p>
    </div>
  )
}

function ProfileDetailsCard({ entry }: { entry: ContactEntry }) {
  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm">
      <CardContent className="p-5 sm:p-6">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <User className="h-4 w-4" />
          </div>
          <h2 className="text-base font-semibold text-accent">Profile Details</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <DetailField label="Name" value={entry.name} />
            <DetailField label="Patient ID" value={contactProviderIdRef(entry)} />
            <DetailField label="Email" value={entry.email} />
            <DetailField label="Phone name" value={entry.contactNo} />
          </div>
          <div className="space-y-4">
            <DetailField label="Company" value={entry.company} />
            <DetailField label="Sub Point" value={entry.type} />
            <DetailField label="Gender" value={entry.gender ?? '—'} />
            <DetailField label="Address" value={entry.address ?? '—'} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ContactDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { findById, remove } = useContactEntries()

  const entry = useMemo(() => (id ? findById(id) : undefined), [id, findById])

  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-muted-foreground">Provider not found</p>
        <button
          type="button"
          className="mt-2 text-sm text-primary hover:underline"
          onClick={() => navigate('/contact-list')}
        >
          Back to contact list
        </button>
      </div>
    )
  }

  const handleDelete = () => {
    if (!window.confirm(`Remove ${entry.name} from the list?`)) return
    remove(entry.id)
    navigate('/contact-list')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <ContactPageHeader
        title="Contact list"
        subtitle="Manage provider details"
        actions={
          <ContactEditDeleteActions
            onEdit={() => navigate(`/contact-list/${entry.id}/edit`)}
            onDelete={handleDelete}
          />
        }
      />

      <ContactSummaryCard displayName={entry.name} subTitle="provider" initials={contactInitials(entry.name)} />

      <ProfileDetailsCard entry={entry} />
    </motion.div>
  )
}

