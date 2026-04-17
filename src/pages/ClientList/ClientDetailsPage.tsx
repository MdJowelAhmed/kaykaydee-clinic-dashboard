import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Mail, Phone, MapPin, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/utils/cn'
import { formatClientJoinDate } from './utils'
import { INITIAL_CLIENT_LIST } from './clientListData'
import type { ClientListEntry } from './types'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'C'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function badge(label: string, className?: string) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold',
        className
      )}
    >
      {label}
    </span>
  )
}

function kpiCard({
  title,
  value,
  className,
}: {
  title: string
  value: string | number
  className: string
}) {
  return (
    <div className={cn('rounded-xl p-5 text-white shadow-sm', className)}>
      <p className="text-sm font-semibold/relaxed opacity-90">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
    </div>
  )
}

export default function ClientDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const client: ClientListEntry | undefined = useMemo(
    () => INITIAL_CLIENT_LIST.find((c) => c.id === id),
    [id]
  )

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-muted-foreground">Client not found</p>
        <Button variant="link" onClick={() => navigate('/client-list')}>
          Back to Patients
        </Button>
      </div>
    )
  }

  // Mock fields to match UI spec (until API wiring).
  const age = 45
  const gender = 'Male'
  const primaryCondition = 'Post-Surgery Knee Rehabilitation'
  const treatmentStartDate = formatClientJoinDate(client.joinDate)
  const progressPercent = 78

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <button
        type="button"
        onClick={() => navigate('/client-list')}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Patients
      </button>

      <div className="rounded-2xl border border-slate-200 bg-sky-50/40 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white shadow-sm">
              Z
            </div>
            <p className="text-base font-bold text-violet-700">ZealthOS</p>
          </div>
        </div>

        <Card className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <Avatar className="h-14 w-14 border border-slate-200">
                  <AvatarFallback className="bg-sky-600 text-sm font-bold text-white">
                    {initials(client.patientName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-base font-bold text-slate-900">{client.patientName}</p>
                    {badge('Active', 'border-emerald-200 bg-emerald-50 text-emerald-700')}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">Patient ID: P001</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      {age} years, {gender}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {client.email}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {client.contactNo}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      Joined {formatClientJoinDate(client.joinDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" className="h-9 rounded-lg">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg text-rose-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <Tabs defaultValue="overview">
                <TabsList className="h-9 rounded-full bg-slate-100 p-1">
                  <TabsTrigger value="overview" className="rounded-full px-3 py-1 text-xs">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="exercises" className="rounded-full px-3 py-1 text-xs">
                    Exercises
                  </TabsTrigger>
                  <TabsTrigger value="appointments" className="rounded-full px-3 py-1 text-xs">
                    Appointments
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="rounded-full px-3 py-1 text-xs">
                    Notes
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-slate-900">Personal Information</p>
            <div className="mt-4 grid gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500">Date of Birth</p>
                <p className="font-semibold text-slate-900">Jan 15, 1981</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Gender</p>
                <p className="font-semibold text-slate-900">{gender}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Age</p>
                <p className="font-semibold text-slate-900">{age} years</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-slate-100 p-2 text-slate-600">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Address</p>
                  <p className="font-semibold text-slate-900">{client.address}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-slate-900">Medical Information</p>
            <div className="mt-4 grid gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500">Primary Condition</p>
                <p className="font-semibold text-slate-900">{primaryCondition}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Treatment Start Date</p>
                <p className="font-semibold text-slate-900">{treatmentStartDate}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Overall Progress</p>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-slate-900"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-900">{progressPercent}% Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCard({ title: 'Active Exercises', value: 4, className: 'bg-gradient-to-r from-blue-600 to-indigo-600' })}
        {kpiCard({ title: 'Avg. Completion', value: '80%', className: 'bg-gradient-to-r from-emerald-600 to-green-600' })}
        {kpiCard({ title: 'Total Sessions', value: 12, className: 'bg-gradient-to-r from-orange-500 to-amber-500' })}
        {kpiCard({ title: 'Days in Treatment', value: 38, className: 'bg-gradient-to-r from-purple-600 to-fuchsia-600' })}
      </div>
    </motion.div>
  )
}

