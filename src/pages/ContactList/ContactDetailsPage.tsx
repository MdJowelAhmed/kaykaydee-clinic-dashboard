import { useMemo, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { User, Phone, MapPin, StickyNote } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { useContactEntries } from './ContactEntriesContext'
import { contactInitials, contactProviderIdRef } from './utils'
import type { ContactEntry } from './types'
import { ContactEditDeleteActions, ContactPageHeader, ContactSummaryCard } from './components/ContactHeaderParts'

function DetailField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-accent">{value?.trim() ? value : '—'}</p>
    </div>
  )
}

function DetailSection({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
}) {
  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm">
      <CardContent className="p-5 sm:p-6">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            {icon}
          </div>
          <h2 className="text-base font-semibold text-accent">{title}</h2>
        </div>
        {children}
      </CardContent>
    </Card>
  )
}

function ProfileDetailsCard({ entry }: { entry: ContactEntry }) {
  return (
    <div className="space-y-4">
      <DetailSection icon={<User className="h-4 w-4" />} title="General Details">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <DetailField label="Name" value={entry.name} />
            <DetailField label="Type" value={entry.type} />
            <DetailField label="Title" value={entry.title} />
          </div>
          <div className="space-y-4">
            <DetailField label="Occupation" value={entry.occupation} />
            <DetailField label="Company" value={entry.company} />
            <DetailField label="Contact ID" value={contactProviderIdRef(entry)} />
          </div>
        </div>
      </DetailSection>

      <DetailSection icon={<Phone className="h-4 w-4" />} title="Contact Details">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <DetailField label="Email" value={entry.email} />
            <DetailField label="Mobile Number" value={entry.mobile} />
          </div>
          <div className="space-y-4">
            <DetailField label="Work Phone" value={entry.workPhone} />
            <DetailField label="Secondary Phone Number" value={entry.secondaryPhone} />
          </div>
        </div>
      </DetailSection>

      <DetailSection icon={<MapPin className="h-4 w-4" />} title="Address Details">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <DetailField label="Address" value={entry.address} />
            <DetailField label="City / Town" value={entry.city} />
            <DetailField label="State / Region" value={entry.state} />
          </div>
          <div className="space-y-4">
            <DetailField label="Postcode" value={entry.postcode} />
            <DetailField label="Country" value={entry.country} />
          </div>
        </div>
      </DetailSection>

      <DetailSection icon={<StickyNote className="h-4 w-4" />} title="Notes">
        <p className="whitespace-pre-wrap text-sm text-accent">
          {entry.notes?.trim() ? entry.notes : 'No notes added.'}
        </p>
      </DetailSection>
    </div>
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
        <p className="text-lg text-muted-foreground">Contact not found</p>
        <button
          type="button"
          className="mt-2 text-sm text-primary hover:underline"
          onClick={() => navigate('/contact-list')}
        >
          Back to contacts
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
        title="Contacts"
        subtitle="Manage contact details"
        actions={
          <ContactEditDeleteActions
            onEdit={() => navigate(`/contact-list/${entry.id}/edit`)}
            onDelete={handleDelete}
          />
        }
      />

      <ContactSummaryCard displayName={entry.name} subTitle="contact" initials={contactInitials(entry.name)} />

      <ProfileDetailsCard entry={entry} />
    </motion.div>
  )
}

