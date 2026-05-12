export type ClinicEventCategory =
  | 'consultation'
  | 'follow_up'
  | 'diagnostics'
  | 'procedure'
  | 'staff'
  | 'admin'

export interface ClinicCalendarEvent {
  id: string
  dayIndex: number
  time: string
  category: ClinicEventCategory
  /** Short task / visit title */
  taskTitle: string
  /** One-line explanation for staff (optional — some draft entries skip it). */
  summary?: string
  /** Optional — admin / staff blocks may not have a patient. */
  patientName?: string
  /** Optional — virtual / off-site visits may not record a room. */
  room?: string
  /** Doctor, nurse, or coordinator (optional — assignment may be pending). */
  staffName?: string
  /** Absolute column date (ISO); set by `resolveClinicCalendarEvents`. */
  dateISO: string
  /** `client-list` entry id for full profile navigation. */
  patientId?: string
}

/** Seed rows before anchor dates and client ids are applied */
export type ClinicCalendarEventInput = Omit<ClinicCalendarEvent, 'dateISO' | 'patientId'>

function calendarDayPlus(anchorIso: string, add: number): string {
  const d = new Date(anchorIso + 'T12:00:00')
  d.setDate(d.getDate() + add)
  return d.toISOString().split('T')[0]
}

function patientIdFromPatientName(patientName?: string): string | undefined {
  const n = patientName?.trim() ?? ''
  if (!n || n.startsWith('—')) return undefined
  let h = 0
  for (let i = 0; i < n.length; i++) h = (Math.imul(31, h) + n.charCodeAt(i)) | 0
  return `cl-${(Math.abs(h) % 150) + 1}`
}

export const CATEGORY_FILTER_OPTIONS: { value: ClinicEventCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All activities' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'diagnostics', label: 'Diagnostics' },
  { value: 'procedure', label: 'Procedure' },
  { value: 'staff', label: 'Staff / Handover' },
  { value: 'admin', label: 'Administrative' },
]

export const CATEGORY_CELL_STYLES: Record<
  ClinicEventCategory,
  { card: string; accent: string }
> = {
  consultation: {
    card: 'bg-sky-50 border-sky-200/80 dark:bg-sky-500/10 dark:border-sky-500/20',
    accent: 'text-sky-700 dark:text-sky-300',
  },
  follow_up: {
    card: 'bg-violet-50 border-violet-200/80 dark:bg-violet-500/10 dark:border-violet-500/20',
    accent: 'text-violet-700 dark:text-violet-300',
  },
  diagnostics: {
    card: 'bg-amber-50 border-amber-200/80 dark:bg-amber-500/10 dark:border-amber-500/20',
    accent: 'text-amber-800 dark:text-amber-300',
  },
  procedure: {
    card: 'bg-rose-50 border-rose-200/80 dark:bg-rose-500/10 dark:border-rose-500/20',
    accent: 'text-rose-700 dark:text-rose-300',
  },
  staff: {
    card: 'bg-muted/40 border-border dark:bg-muted/25',
    accent: 'text-accent/80',
  },
  admin: {
    card: 'bg-emerald-50 border-emerald-200/80 dark:bg-emerald-500/10 dark:border-emerald-500/20',
    accent: 'text-emerald-800 dark:text-emerald-300',
  },
}

/** Same format as `CalendarView` time rows (`en-US`, top of each hour). */
function clinicCalendarTimeLabel(hour24: number): string {
  const date = new Date(2024, 0, 1, ((hour24 % 24) + 24) % 24, 0, 0, 0)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Extra dummy visits so the grid is easy to understand at a glance (especially 12 AM–5 AM,
 * which are otherwise empty). Some entries intentionally leave fields blank to show how
 * partial / draft bookings render. Safe to remove when wiring a real API.
 */
const clinicCalendarEventsVisualDemo: ClinicCalendarEventInput[] = (() => {
  const cats: ClinicEventCategory[] = [
    'consultation',
    'follow_up',
    'diagnostics',
    'procedure',
    'staff',
    'admin',
  ]
  const tasks = [
    'Sample vitals round',
    'Demo telehealth slot',
    'Placeholder follow-up',
    'Sample blood draw',
    'Demo booking — physio',
    'Sample nurse triage',
    'Demo prescription review',
    'Walk-in preview (sample)',
  ]
  const patients = [
    'Demo: A. Karim',
    'Demo: S. Nahar',
    'Demo: R. Islam',
    'Demo: M. Chowdhury',
    'Demo: L. Akter',
    'Demo: K. Hassan',
  ]
  const staff = ['Dr. Preview', 'Nurse Demo', 'PT Demo', 'Night RN demo', 'Front desk demo']
  const rooms = ['Ward A (demo)', 'Urgent bay (demo)', 'Imaging B (demo)', 'Virtual', 'Treatment 1']
  const summaries = [
    'Demo data so you can see how busy slots look. Click the slot to open full details on the right.',
    'Sample daytime visit for the preview grid — click to see every value on the right.',
    'Quick preview booking. Click for full details.',
  ]

  /**
   * Build a partial event. We deterministically blank some fields based on `i` so the
   * grid + side panel show realistic mixes of complete and draft bookings.
   */
  const buildPartial = (
    base: Pick<ClinicCalendarEventInput, 'id' | 'dayIndex' | 'time' | 'category' | 'taskTitle'>,
    i: number
  ): ClinicCalendarEventInput => {
    const variant = i % 6
    const ev: ClinicCalendarEventInput = { ...base }
    // variant 0 → all four fields filled
    // variant 1 → no patient
    // variant 2 → no room
    // variant 3 → no staff
    // variant 4 → no summary
    // variant 5 → only patient + summary (room & staff blank)
    if (variant !== 1 && variant !== 5) ev.patientName = patients[i % patients.length]
    if (variant === 5) ev.patientName = patients[i % patients.length]
    if (variant !== 2 && variant !== 5) ev.room = rooms[i % rooms.length]
    if (variant !== 3 && variant !== 5) ev.staffName = staff[i % staff.length]
    if (variant !== 4) ev.summary = summaries[i % summaries.length]
    return ev
  }

  const rows: ClinicCalendarEventInput[] = []
  let n = 0

  // Overnight (12 AM – 5 AM): fill ~half of the cells, leave the rest truly empty
  // so the grid shows realistic gaps instead of a solid block of demo cards.
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    for (let h = 0; h < 6; h++) {
      // Pseudo-random skip pattern: keeps roughly 1 in 2 slots empty.
      if ((dayIndex * 7 + h * 3) % 5 === 0 || (dayIndex + h) % 3 === 2) continue
      const i = n++
      rows.push(
        buildPartial(
          {
            id: `DMO-N${dayIndex}-${h}`,
            dayIndex,
            time: clinicCalendarTimeLabel(h),
            category: cats[i % cats.length],
            taskTitle: `${tasks[i % tasks.length]} · overnight`,
          },
          i
        )
      )
    }
  }

  // Daytime (6 AM – 11 PM): sparse, so most slots stay empty.
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    for (let h = 6; h <= 23; h++) {
      if ((dayIndex + h * 2) % 5 !== 0) continue
      // Extra carve-outs so some daytime slots are obviously blank.
      if (h === 12 || h === 17) continue
      if (dayIndex === 2 && h >= 9 && h <= 11) continue
      if (dayIndex === 5 && h >= 14 && h <= 19) continue
      const i = n++
      rows.push(
        buildPartial(
          {
            id: `DMO-D${dayIndex}-${h}`,
            dayIndex,
            time: clinicCalendarTimeLabel(h),
            category: cats[(i + 1) % cats.length],
            taskTitle: tasks[i % tasks.length],
          },
          i
        )
      )
    }
  }

  return rows
})()

/** Core mock clinic schedule (10+ day indices; grid clips to active view range) */
const clinicCalendarEventsCore: ClinicCalendarEventInput[] = [
  {
    id: 'APT-1001',
    dayIndex: 0,
    time: '8:00 AM',
    category: 'consultation',
    taskTitle: 'Initial MSK consult',
    summary: 'New patient intake, ROM baseline, treatment plan draft.',
    patientName: 'Michael Don',
    room: 'Rm 204',
    staffName: 'Dr. Rahman',
  },
  {
    id: 'APT-1002',
    dayIndex: 0,
    time: '8:00 AM',
    category: 'follow_up',
    taskTitle: 'Post-op check',
    summary: 'Suture review, pain score, physiotherapy referral.',
    patientName: 'Sarah Johnson',
    room: 'Rm 201',
    staffName: 'Dr. Alam',
  },
  {
    id: 'APT-1003',
    dayIndex: 0,
    time: '8:00 AM',
    category: 'diagnostics',
    taskTitle: 'MRI slot — knee',
    summary: 'Radiology prep; contrast checklist completed.',
    patientName: 'John Smith',
    room: 'Imaging B',
    staffName: 'Tech. R. Karim',
  },
  {
    id: 'APT-1004',
    dayIndex: 0,
    time: '2:00 PM',
    category: 'consultation',
    taskTitle: 'Cardiology review',
    summary: 'ECG results discussion, medication adjustment.',
    patientName: 'Emma Wilson',
    room: 'Rm 112',
    staffName: 'Dr. Chowdhury',
  },
  {
    id: 'APT-1005',
    dayIndex: 0,
    time: '2:00 PM',
    category: 'admin',
    taskTitle: 'Insurance prior-auth call',
    summary: 'Follow up on denied claim for orthotic device.',
    patientName: '— Admin',
    room: 'Front desk',
    staffName: 'N. Ahmed',
  },
  {
    id: 'APT-2001',
    dayIndex: 1,
    time: '9:00 AM',
    category: 'procedure',
    taskTitle: 'Minor wound dressing',
    summary: 'Sterile change; patient education on home care.',
    patientName: 'Lisa Anderson',
    room: 'Treatment 3',
    staffName: 'Nurse F. Das',
  },
  {
    id: 'APT-2002',
    dayIndex: 1,
    time: '11:00 AM',
    category: 'consultation',
    taskTitle: 'Diabetes education',
    summary: 'HbA1c trends, dietitian handout issued.',
    patientName: 'Robert Taylor',
    room: 'Rm 305',
    staffName: 'Dr. Sen',
  },
  {
    id: 'APT-2003',
    dayIndex: 1,
    time: '3:00 PM',
    category: 'follow_up',
    taskTitle: 'Physio progress',
    summary: 'Week 4 MSK protocol; goal: full extension.',
    patientName: 'Maria Garcia',
    room: 'Gym A',
    staffName: 'PT J. Lee',
  },
  {
    id: 'APT-2004',
    dayIndex: 1,
    time: '3:00 PM',
    category: 'staff',
    taskTitle: 'Shift handover',
    summary: 'Bed status, two pending labs, on-call roster.',
    patientName: '— Staff',
    room: 'Nurse station',
    staffName: 'Charge RN',
  },
  {
    id: 'APT-3001',
    dayIndex: 2,
    time: '10:00 AM',
    category: 'diagnostics',
    taskTitle: 'Blood panel — fasting',
    summary: 'Lipid + LFT; results to portal by EOD.',
    patientName: 'William Harris',
    room: 'Lab 1',
    staffName: 'Phlebotomy',
  },
  {
    id: 'APT-3002',
    dayIndex: 2,
    time: '1:00 PM',
    category: 'consultation',
    taskTitle: 'Geriatric fall risk',
    summary: 'TUG test, home safety checklist.',
    patientName: 'Jennifer Clark',
    room: 'Rm 118',
    staffName: 'Dr. Hoque',
  },
  {
    id: 'APT-3003',
    dayIndex: 2,
    time: '5:00 PM',
    category: 'admin',
    taskTitle: 'Weekly supply audit',
    summary: 'Dressings & syringe par level restock list.',
    patientName: '— Admin',
    room: 'Store',
    staffName: 'Ops',
  },
  {
    id: 'APT-4001',
    dayIndex: 3,
    time: '7:00 AM',
    category: 'procedure',
    taskTitle: 'Joint injection',
    summary: 'Consent signed; ultrasound-guided.',
    patientName: 'Susan Walker',
    room: 'Proc 2',
    staffName: 'Dr. N. Islam',
  },
  {
    id: 'APT-4002',
    dayIndex: 3,
    time: '12:00 PM',
    category: 'follow_up',
    taskTitle: 'Telehealth callback',
    summary: 'Review home BP log from past 7 days.',
    patientName: 'Joseph Hall',
    room: 'Virtual',
    staffName: 'Dr. Rahman',
  },
  {
    id: 'APT-4003',
    dayIndex: 3,
    time: '12:00 PM',
    category: 'diagnostics',
    taskTitle: 'X-ray — chest',
    summary: 'Routine pre-employment screening.',
    patientName: 'Nancy Allen',
    room: 'Imaging A',
    staffName: 'Tech. S. Khan',
  },
  {
    id: 'APT-4004',
    dayIndex: 3,
    time: '4:00 PM',
    category: 'consultation',
    taskTitle: 'Pediatric fever',
    summary: 'Rule out UTI; parental counselling.',
    patientName: 'Thomas Young',
    room: 'Rm 402',
    staffName: 'Dr. M. Ali',
  },
  {
    id: 'APT-5001',
    dayIndex: 4,
    time: '6:00 AM',
    category: 'staff',
    taskTitle: 'OR briefing',
    summary: 'First case start 7:00; instrument tray check.',
    patientName: '— Staff',
    room: 'OR suite',
    staffName: 'Anesthesia lead',
  },
  {
    id: 'APT-5002',
    dayIndex: 4,
    time: '9:00 AM',
    category: 'procedure',
    taskTitle: 'Endoscopy list',
    summary: 'Three elective scopes; recovery beds staged.',
    patientName: 'Karen King',
    room: 'Endo',
    staffName: 'Dr. Chowdhury',
  },
  {
    id: 'APT-6001',
    dayIndex: 5,
    time: '8:00 AM',
    category: 'consultation',
    taskTitle: 'Hypertension follow-up',
    summary: 'Home BP averages; titrate ACE inhibitor.',
    patientName: 'Betty Lopez',
    room: 'Rm 210',
    staffName: 'Dr. Sen',
  },
  {
    id: 'APT-6002',
    dayIndex: 5,
    time: '2:00 PM',
    category: 'follow_up',
    taskTitle: 'Wound review',
    summary: 'Healing edge pink; no signs of infection.',
    patientName: 'Daniel Hill',
    room: 'Treatment 1',
    staffName: 'Nurse F. Das',
  },
  {
    id: 'APT-6003',
    dayIndex: 5,
    time: '2:00 PM',
    category: 'admin',
    taskTitle: 'Compliance training',
    summary: 'Annual HIPAA refresher — ward clerks.',
    patientName: '— Admin',
    room: 'Conf room',
    staffName: 'HR',
  },
  {
    id: 'APT-7001',
    dayIndex: 6,
    time: '10:00 AM',
    category: 'diagnostics',
    taskTitle: 'Ultrasound — abdomen',
    summary: 'Fasting 6h; report to ordering physician.',
    patientName: 'Matthew Adams',
    room: 'Imaging B',
    staffName: 'Tech. R. Karim',
  },
  {
    id: 'APT-7002',
    dayIndex: 6,
    time: '6:00 PM',
    category: 'consultation',
    taskTitle: 'Evening walk-in triage',
    summary: 'Acute back spasm; NSAID pathway.',
    patientName: 'Sharon Baker',
    room: 'Urgent',
    staffName: 'Dr. Alam',
  },
  {
    id: 'APT-8001',
    dayIndex: 7,
    time: '11:00 AM',
    category: 'staff',
    taskTitle: 'Quality huddle',
    summary: 'Discuss two near-miss reports; action owners.',
    patientName: '— Staff',
    room: 'Board room',
    staffName: 'CNO',
  },
  {
    id: 'APT-8002',
    dayIndex: 7,
    time: '11:00 AM',
    category: 'consultation',
    taskTitle: 'Anticoagulation clinic',
    summary: 'INR 2.4; maintain current warfarin dose.',
    patientName: 'Anthony Nelson',
    room: 'Rm 156',
    staffName: 'Dr. N. Islam',
  },
  {
    id: 'APT-8003',
    dayIndex: 7,
    time: '11:00 AM',
    category: 'procedure',
    taskTitle: 'Catheter change',
    summary: 'Scheduled maintenance; sterile field.',
    patientName: 'Michelle Carter',
    room: 'Bed 12',
    staffName: 'RN team',
  },
  {
    id: 'APT-9001',
    dayIndex: 8,
    time: '1:00 PM',
    category: 'follow_up',
    taskTitle: 'Oncology survivorship',
    summary: 'Late effects screening questionnaire.',
    patientName: 'Laura Perez',
    room: 'Rm 501',
    staffName: 'Dr. Hoque',
  },
  {
    id: 'APT-A001',
    dayIndex: 9,
    time: '9:00 AM',
    category: 'consultation',
    taskTitle: 'Pre-admission assessment',
    summary: 'Upcoming day surgery; anesthesia questionnaire.',
    patientName: 'Steven Roberts',
    room: 'Rm 008',
    staffName: 'Dr. Rahman',
  },
  {
    id: 'APT-A002',
    dayIndex: 9,
    time: '9:00 AM',
    category: 'diagnostics',
    taskTitle: 'ECG serial',
    summary: 'Compare to baseline from last admission.',
    patientName: 'Donna Turner',
    room: 'Cardio lab',
    staffName: 'Tech. S. Khan',
  },
  {
    id: 'APT-A003',
    dayIndex: 9,
    time: '2:00 AM',
    category: 'staff',
    taskTitle: 'Night inventory',
    summary: 'Crash cart seal check; narcotics count.',
    patientName: '— Staff',
    room: 'Ward 2',
    staffName: 'Night RN',
  },
]

/** Extra dense slots (6–9 items) to demo vertical scroll inside cells */
const clinicCalendarEventsHighLoad: ClinicCalendarEventInput[] = (() => {
  const categories: ClinicEventCategory[] = [
    'consultation',
    'follow_up',
    'diagnostics',
    'procedure',
    'staff',
    'admin',
  ]
  const rows: ClinicCalendarEventInput[] = []
  const pushBlock = (dayIndex: number, time: string, count: number, prefix: string) => {
    for (let i = 0; i < count; i++) {
      rows.push({
        id: `${prefix}-${i + 1}`,
        dayIndex,
        time,
        category: categories[i % categories.length],
        taskTitle: `High-load ${prefix} #${i + 1}`,
        summary:
          'Demo stacked visit in a busy slot — scroll the cell to see every item, then click to open full details on the right.',
        patientName: `Client ${prefix}-${i + 1}`,
        room: `Rm ${320 + i}`,
        staffName: `Dr. Batch ${i + 1}`,
      })
    }
  }
  // Day 0: 8:00 AM → 3 existing + 6 = 9 total
  pushBlock(0, '8:00 AM', 6, 'HL-D0-8')
  // Day 0: 2:00 PM → 2 existing + 5 = 7 total
  pushBlock(0, '2:00 PM', 5, 'HL-D0-14')
  // Day 1: 3:00 PM → 2 existing + 6 = 8 total
  pushBlock(1, '3:00 PM', 6, 'HL-D1-15')
  // Day 7: 11:00 AM → 3 existing + 6 = 9 total (visible when range ≥ 8 days)
  pushBlock(7, '11:00 AM', 6, 'HL-D7-11')
  return rows
})()

const clinicCalendarEventsAllInput: ClinicCalendarEventInput[] = [
  ...clinicCalendarEventsCore,
  ...clinicCalendarEventsHighLoad,
  ...clinicCalendarEventsVisualDemo,
]

export function resolveClinicCalendarEvents(firstVisibleDayIso: string): ClinicCalendarEvent[] {
  const anchor =
    firstVisibleDayIso && firstVisibleDayIso.length >= 10
      ? firstVisibleDayIso.slice(0, 10)
      : new Date().toISOString().split('T')[0]
  return clinicCalendarEventsAllInput.map((ev) => ({
    ...ev,
    dateISO: calendarDayPlus(anchor, ev.dayIndex),
    patientId: patientIdFromPatientName(ev.patientName),
  }))
}
