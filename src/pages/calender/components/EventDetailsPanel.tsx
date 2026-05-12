import React from 'react'
import { Link } from 'react-router-dom'
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
import { isPatientCancellableCalendarEvent } from '@/pages/WaitingList/waitlistFlow'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

export type EventDetailsPanelVariant = 'slot' | 'day'

function compareTimes12h(a: string, b: string): number {
  const parse = (s: string) => {
    const m = s.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
    if (!m) return 0
    let h = parseInt(m[1], 10)
    const min = parseInt(m[2], 10)
    const ap = m[3].toUpperCase()
    if (ap === 'PM' && h !== 12) h += 12
    if (ap === 'AM' && h === 12) h = 0
    return h * 60 + min
  }
  return parse(a) - parse(b)
}

interface EventDetailsPanelProps {
  variant?: EventDetailsPanelVariant
  events: ClinicCalendarEvent[]
  slotLabel?: string
  dayLabel?: string
  /** e.g. "Wed 14" when variant is day */
  daySummaryTitle?: string
  onClose: () => void
  /** When set, patient-facing visits show a cancel control that frees the slot for the waitlist flow (demo). */
  onPatientCancel?: (ev: ClinicCalendarEvent) => void
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
          <div className={cn('mt-0.5 break-words text-[12px] font-medium text-accent', valueClass)}>
            {value}
          </div>
        )}
      </div>
    </li>
  )
}

function SingleEventDetails({
  ev,
  onPatientCancel,
}: {
  ev: ClinicCalendarEvent
  onPatientCancel?: (ev: ClinicCalendarEvent) => void
}) {
  const styles = CATEGORY_CELL_STYLES[ev.category]
  const hasSummary = !!ev.summary && ev.summary.trim() !== ''

  const patientValue =
    ev.patientId && ev.patientName ? (
      <Link
        to={`/client-list/${ev.patientId}`}
        className="inline font-semibold text-primary underline-offset-2 hover:underline"
      >
        {ev.patientName}
      </Link>
    ) : (
      ev.patientName
    )

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
          value={patientValue}
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
      {onPatientCancel && isPatientCancellableCalendarEvent(ev) ? (
        <div className="mt-4 border-t border-border pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onPatientCancel(ev)}
          >
            Cancel appointment
          </Button>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Removes this slot from the schedule. If patients are waitlisted for this doctor, the first
            in queue receives an earlier-slot message (demo).
          </p>
        </div>
      ) : null}
    </div>
  )
}

const EventDetailsPanel: React.FC<EventDetailsPanelProps> = ({
  variant = 'slot',
  events,
  slotLabel,
  dayLabel,
  daySummaryTitle,
  onClose,
  onPatientCancel,
}) => {
  const isDay = variant === 'day'
  const hasEvents = events.length > 0
  const count = events.length

  const sortedEvents = React.useMemo(
    () => (isDay ? [...events].sort((a, b) => compareTimes12h(a.time, b.time)) : events),
    [isDay, events]
  )

  const headerEyebrow = isDay ? 'Day details' : 'Slot details'

  const hasSelection = isDay ? Boolean(daySummaryTitle) : hasEvents

  const showCloseButton = isDay ? Boolean(daySummaryTitle) : hasEvents

  const emptyStateKey = isDay ? 'day-empty' : 'slot-empty'

  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <header className="flex items-start justify-between gap-3 border-b border-border bg-muted/20 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {headerEyebrow}
          </p>
          {isDay ? (
            daySummaryTitle ? (
              <h2 className="mt-1 truncate text-sm font-semibold text-accent">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 shrink-0 text-primary" />
                  {daySummaryTitle}
                </span>
                <span className="mx-1.5 text-muted-foreground">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
                  Full day
                </span>
              </h2>
            ) : (
              <h2 className="mt-1 text-sm font-semibold text-accent">No day selected</h2>
            )
          ) : hasEvents ? (
            <h2 className="mt-1 truncate text-sm font-semibold text-accent">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 shrink-0 text-primary" />
                {dayLabel ?? '—'}
              </span>
              <span className="mx-1.5 text-muted-foreground">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
                {slotLabel}
              </span>
            </h2>
          ) : (
            <h2 className="mt-1 text-sm font-semibold text-accent">No slot selected</h2>
          )}
          {hasSelection && hasEvents && (
            <p className="mt-1 text-[11px] text-muted-foreground">
              {count} {count === 1 ? 'item' : 'items'} {isDay ? 'this day' : 'in this slot'}
            </p>
          )}
        </div>
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/40 hover:text-accent"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 [scrollbar-width:thin]">
        <AnimatePresence mode="wait">
          {isDay && daySummaryTitle && hasEvents ? (
            <motion.div
              key={`day-${daySummaryTitle}-${count}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-3"
            >
              {sortedEvents.map((ev) => (
                <SingleEventDetails key={`${ev.id}-${ev.dateISO}`} ev={ev} onPatientCancel={onPatientCancel} />
              ))}
              {count > 1 && (
                <p className="pt-1 text-center text-[11px] text-muted-foreground">
                  End of day — {count} entries shown
                </p>
              )}
            </motion.div>
          ) : isDay && daySummaryTitle && !hasEvents ? (
            <motion.div
              key="day-no-activities"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-2 py-10 text-center"
            >
              <ClipboardList className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-accent">No activities this day</p>
              <p className="max-w-[14rem] text-[11px] text-muted-foreground">
                Try another date or clear filters.
              </p>
            </motion.div>
          ) : isDay && !daySummaryTitle ? (
            <motion.div
              key="day-pick"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/40 text-primary">
                <CalendarDays className="h-6 w-6" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-accent">Select a day</p>
                <p className="mx-auto max-w-[16rem] text-[11px] leading-relaxed text-muted-foreground">
                  Click a day card on the left. Details appear here — tap the patient name to open
                  their profile.
                </p>
              </div>
            </motion.div>
          ) : !isDay && hasEvents ? (
            <motion.div
              key={`${dayLabel}-${slotLabel}-${count}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-3"
            >
              {sortedEvents.map((ev) => (
                <SingleEventDetails key={`${ev.id}-${ev.dateISO}`} ev={ev} onPatientCancel={onPatientCancel} />
              ))}
              {count > 1 && (
                <p className="pt-1 text-center text-[11px] text-muted-foreground">
                  End of slot — {count} entries shown
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={emptyStateKey}
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
                  Click a time cell in the calendar. Every entry in that slot appears here — tap the
                  patient name to open their profile.
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
