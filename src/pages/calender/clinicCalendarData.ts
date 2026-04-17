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
  /** One-line explanation for staff */
  summary: string
  patientName: string
  room: string
  /** Doctor, nurse, or coordinator */
  staffName: string
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
  consultation: { card: 'bg-sky-50 border-sky-200/80', accent: 'text-sky-700' },
  follow_up: { card: 'bg-violet-50 border-violet-200/80', accent: 'text-violet-700' },
  diagnostics: { card: 'bg-amber-50 border-amber-200/80', accent: 'text-amber-800' },
  procedure: { card: 'bg-rose-50 border-rose-200/80', accent: 'text-rose-700' },
  staff: { card: 'bg-slate-100 border-slate-200/80', accent: 'text-slate-700' },
  admin: { card: 'bg-emerald-50 border-emerald-200/80', accent: 'text-emerald-800' },
}

/** Core mock clinic schedule (10+ day indices; grid clips to active view range) */
const clinicCalendarEventsCore: ClinicCalendarEvent[] = [
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
const clinicCalendarEventsHighLoad: ClinicCalendarEvent[] = (() => {
  const categories: ClinicEventCategory[] = [
    'consultation',
    'follow_up',
    'diagnostics',
    'procedure',
    'staff',
    'admin',
  ]
  const rows: ClinicCalendarEvent[] = []
  const pushBlock = (dayIndex: number, time: string, count: number, prefix: string) => {
    for (let i = 0; i < count; i++) {
      rows.push({
        id: `${prefix}-${i + 1}`,
        dayIndex,
        time,
        category: categories[i % categories.length],
        taskTitle: `High-load ${prefix} #${i + 1}`,
        summary:
          'Demo stacked visit in a busy slot — scroll the cell to see every item, or hover a card for full details.',
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

export const CLINIC_CALENDAR_EVENTS: ClinicCalendarEvent[] = [
  ...clinicCalendarEventsCore,
  ...clinicCalendarEventsHighLoad,
]
