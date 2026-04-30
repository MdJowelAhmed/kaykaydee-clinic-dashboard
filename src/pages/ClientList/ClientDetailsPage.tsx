import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ClientProfileTabs } from './components/ClientProfileTabs'
import {
  ClientProfilePageHeader,
  ClientProfileEditDeleteActions,
  ClientProfileSummaryCard,
  clientNameInitials,
} from './components/ClientProfileLayoutParts'
import { useClientListEntries } from './ClientListEntriesContext'
import { clientPatientIdRef, formatClientDobDisplay } from './utils'
import type { ClientListEntry } from './types'

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-accent">{value}</p>
    </div>
  )
}

function ProfileDetailsCard({ client }: { client: ClientListEntry }) {
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
            <DetailField label="Name" value={client.patientName} />
            <DetailField label="Patient ID" value={clientPatientIdRef(client)} />
            <DetailField label="Email" value={client.email} />
            <DetailField label="Phone" value={client.contactNo} />
            <DetailField label="Emergency contact" value={client.emergencyContact ?? '—'} />
          </div>
          <div className="space-y-4">
            <DetailField label="Occupation" value={client.occupation ?? '—'} />
            <DetailField
              label="Date of Birth"
              value={formatClientDobDisplay(client.dateOfBirth)}
            />
            <DetailField label="Gender" value={client.gender ?? '—'} />
            <DetailField label="Address" value={client.address} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ClientDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { findById, removeClient } = useClientListEntries()
  const [tab, setTab] = useState('profile')

  const client = useMemo(() => (id ? findById(id) : undefined), [id, findById])

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-muted-foreground">Client not found</p>
        <button
          type="button"
          className="mt-2 text-sm text-primary hover:underline"
          onClick={() => navigate('/client-list')}
        >
          Back to patients management
        </button>
      </div>
    )
  }

  const handleDelete = () => {
    if (!window.confirm(`Remove ${client.patientName} from the list?`)) return
    removeClient(client.id)
    navigate('/client-list')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <ClientProfilePageHeader
        title="Clients Profile"
        onBack={() => navigate('/client-list')}
        actions={
          <ClientProfileEditDeleteActions
            onEdit={() => navigate(`/client-list/${client.id}/edit`)}
            onDelete={handleDelete}
          />
        }
      />

      <ClientProfileSummaryCard
        displayName={client.patientName}
        patientIdLine={`Patient ID: ${clientPatientIdRef(client)}`}
        initials={clientNameInitials(client.patientName)}
      />

      <ClientProfileTabs
        value={tab}
        onValueChange={setTab}
        profileContent={<ProfileDetailsCard client={client} />}
      />
    </motion.div>
  )
}
