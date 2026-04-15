export type NotificationVariant = 'email' | 'user'
export type NotificationBox = 'inbox' | 'sent'

export interface NotificationEntry {
  id: string
  box: NotificationBox
  variant: NotificationVariant
  title: string
  description: string
  /** ISO date displayed on the right side */
  date: string
  /** Only for "sent" list to show who received it */
  recipientsLabel?: string
  /** For variant user */
  avatarUrl?: string
}

export const NOTIFICATION_SAMPLE_TITLE = 'Email Notification'
export const NOTIFICATION_SAMPLE_DESCRIPTION =
  'Receive email updates about your account'

const avatar = (seed: string) => `https://picsum.photos/seed/${seed}/96/96`

export const MOCK_NOTIFICATIONS: NotificationEntry[] = [
  {
    id: '1',
    box: 'inbox',
    variant: 'email',
    title: NOTIFICATION_SAMPLE_TITLE,
    description: NOTIFICATION_SAMPLE_DESCRIPTION,
    date: new Date(2026, 0, 2).toISOString(),
  },
  {
    id: '2',
    box: 'inbox',
    variant: 'user',
    title: NOTIFICATION_SAMPLE_TITLE,
    description: NOTIFICATION_SAMPLE_DESCRIPTION,
    date: new Date(2026, 0, 2).toISOString(),
    avatarUrl: avatar('n1'),
  },
  {
    id: '3',
    box: 'inbox',
    variant: 'email',
    title: NOTIFICATION_SAMPLE_TITLE,
    description: NOTIFICATION_SAMPLE_DESCRIPTION,
    date: new Date(2026, 0, 2).toISOString(),
  },
  {
    id: '4',
    box: 'inbox',
    variant: 'user',
    title: NOTIFICATION_SAMPLE_TITLE,
    description: NOTIFICATION_SAMPLE_DESCRIPTION,
    date: new Date(2026, 0, 2).toISOString(),
    avatarUrl: avatar('n2'),
  },
  {
    id: '5',
    box: 'sent',
    variant: 'email',
    title: NOTIFICATION_SAMPLE_TITLE,
    description: NOTIFICATION_SAMPLE_DESCRIPTION,
    date: new Date(2026, 0, 2).toISOString(),
    recipientsLabel: 'Pattie: Ali, saadil and 8 others',
  },
  {
    id: '6',
    box: 'sent',
    variant: 'user',
    title: NOTIFICATION_SAMPLE_TITLE,
    description: NOTIFICATION_SAMPLE_DESCRIPTION,
    date: new Date(2026, 0, 2).toISOString(),
    recipientsLabel: 'Pattie: Ali, saadil and 8 others',
    avatarUrl: avatar('n3'),
  },
  {
    id: '7',
    box: 'sent',
    variant: 'email',
    title: NOTIFICATION_SAMPLE_TITLE,
    description: NOTIFICATION_SAMPLE_DESCRIPTION,
    date: new Date(2026, 0, 2).toISOString(),
    recipientsLabel: 'Pattie: Ali, saadil and 8 others',
  },
  {
    id: '8',
    box: 'sent',
    variant: 'user',
    title: NOTIFICATION_SAMPLE_TITLE,
    description: NOTIFICATION_SAMPLE_DESCRIPTION,
    date: new Date(2026, 0, 2).toISOString(),
    recipientsLabel: 'Pattie: Ali, saadil and 8 others',
    avatarUrl: avatar('n4'),
  },
  {
    id: '9',
    box: 'inbox',
    variant: 'email',
    title: NOTIFICATION_SAMPLE_TITLE,
    description: NOTIFICATION_SAMPLE_DESCRIPTION,
    date: new Date(2026, 0, 2).toISOString(),
  },
  {
    id: '10',
    box: 'inbox',
    variant: 'user',
    title: NOTIFICATION_SAMPLE_TITLE,
    description: NOTIFICATION_SAMPLE_DESCRIPTION,
    date: new Date(2026, 0, 2).toISOString(),
    avatarUrl: avatar('n5'),
  },
]

export const NOTIFICATION_MODAL_PREVIEW_COUNT = 3
