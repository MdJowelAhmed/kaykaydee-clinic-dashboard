import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CalendarDays,
  ClipboardList,
  Clock,
  DoorOpen,
  FileText,
  StickyNote,
  Tag,
  User,
  UserRound,
  X,
} from 'lucide-react'
import { CATEGORY_CELL_STYLES, type ClinicCalendarEvent } from '../clinicCalendarData'
import { cn } from '@/utils/cn'

interface EventDetailsPanelProps {
  events: ClinicCalendarEvent[]
  slotLabel?: string
  dayLabel?: string
  onClose: () => void
}

const CATEGORY_LABEL: Record<ClinicCalendarEvent['category'], string> = {
  consultation: 'Consultation',
  follow_up: 'Follow-up',
  diagnostics: 'Diagnostics',
  procedure: 'Procedure',
  staff: 'Staff / Handover',
  admin: 'Administrative',
}

function DetailRow({
  icon: Icon,
  label,
  value,
  valueClass,
  emptyLabel = 'Not set',
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: React.ReactNode
  valueClass?: string
  emptyLabel?: string
}) {
  const isEmpty =
    value == null || (typeof value === 'string' && value.trim() === '')
  return (
    <li className="flex items-start gap-3 text-[13px]">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted/40 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
        {isEmpty ? (
          <p className="mt-0.5 break-words text-[12px] italic text-muted-foreground/70">
            — {emptyLabel}
          </p>
        ) : (
          <p className={cn('mt-0.5 break-words font-medium text-accent', valueClass)}>{value}</p>
        )}
      </div>
    </li>
  )
}

function SingleEventDetails({ ev }: { ev: ClinicCalendarEvent }) {
  const styles = CATEGORY_CELL_STYLES[ev.category]
  const hasSummary = !!ev.summary && ev.summary.trim() !== ''
  return (
    <div className={cn('rounded-xl border p-4 shadow-sm', styles.card)}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={cn('text-[10px] font-semibold uppercase tracking-wide', styles.accent)}>
            {CATEGORY_LABEL[ev.category]}
          </p>
          <h3 className="mt-1 break-words text-base font-semibold leading-snug text-accent">
            {ev.taskTitle}
          </h3>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold',
            styles.accent
          )}
        >
          {ev.id}
        </span>
      </div>

      <p
        className={cn(
          'mb-3 rounded-lg bg-card/60 p-2.5 text-[12px] leading-relaxed',
          hasSummary ? 'text-accent/90' : 'italic text-muted-foreground/70'
        )}
      >
        {hasSummary ? ev.summary : '— No summary added yet'}
      </p>

      <ul className="space-y-2.5">
        <DetailRow
          icon={User}
          label="Patient"
          value={ev.patientName}
          emptyLabel="No patient assigned"
        />
        <DetailRow
          icon={UserRound}
          label="Staff"
          value={ev.staffName}
          valueClass={styles.accent}
          emptyLabel="Staff not assigned"
        />
        <DetailRow
          icon={DoorOpen}
          label="Room / Location"
          value={ev.room}
          emptyLabel="No room set"
        />
        <DetailRow icon={Clock} label="Time" value={ev.time} />
        <DetailRow
          icon={Tag}
          label="Category"
          value={CATEGORY_LABEL[ev.category]}
          valueClass={styles.accent}
        />
      </ul>
    </div>
  )
}

const EventDetailsPanel: React.FC<EventDetailsPanelProps> = ({
  events,
  slotLabel,
  dayLabel,
  onClose,
}) => {
  const hasEvents = events.length > 0
  const count = events.length

  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <header className="flex items-start justify-between gap-3 border-b border-border bg-muted/20 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Slot details
          </p>
          {hasEvents ? (
            <h2 className="mt-1 truncate text-sm font-semibold text-accent">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-primary" />
                {dayLabel ?? '—'}
              </span>
              <span className="mx-1.5 text-muted-foreground">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {slotLabel}
              </span>
            </h2>
          ) : (
            <h2 className="mt-1 text-sm font-semibold text-accent">No slot selected</h2>
          )}
          {hasEvents && (
            <p className="mt-1 text-[11px] text-muted-foreground">
              {count} {count === 1 ? 'item' : 'items'} in this slot
            </p>
          )}
        </div>
        {hasEvents && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/40 hover:text-accent"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 [scrollbar-width:thin]">
        <AnimatePresence mode="wait">
          {hasEvents ? (
            <motion.div
              key={`${dayLabel}-${slotLabel}-${count}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-3"
            >
              {events.map((ev) => (
                <SingleEventDetails key={ev.id} ev={ev} />
              ))}
              {count > 1 && (
                <p className="pt-1 text-center text-[11px] text-muted-foreground">
                  End of slot — {count} entries shown
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/40 text-primary">
                <ClipboardList className="h-6 w-6" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-accent">Pick a slot to view details</p>
                <p className="mx-auto max-w-[16rem] text-[11px] leading-relaxed text-muted-foreground">
                  Click any appointment card in the calendar grid. Every entry in that time slot
                  will appear here — scroll the panel for stacked visits.
                </p>
              </div>
              <ul className="mt-1 space-y-1 text-[11px] text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <FileText className="h-3 w-3" /> Patient, staff and room
                </li>
                <li className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" /> Time and category
                </li>
                <li className="flex items-center gap-1.5">
                  <StickyNote className="h-3 w-3" /> Visit summary notes
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  )
}

export default EventDetailsPanel
