import type { BillingCycle, FeatureGroup, SubscriptionManagePackage } from './types'
import { createId } from '@/utils/id'

function seedGroups(): FeatureGroup[] {
  return [
    {
      id: 'core',
      title: 'Core Features',
      items: [
        { id: 'basic-pm', label: 'Basic Patient Management', enabled: true },
        { id: 'appointment', label: 'Appointment Scheduling', enabled: true },
        { id: 'notes', label: 'Clinical Notes', enabled: false },
      ],
    },
    {
      id: 'ai',
      title: 'AI Features',
      items: [
        { id: 'auto-summary-1', label: 'Clinical Auto–Summarization', enabled: true },
        { id: 'auto-summary-2', label: 'Clinical Auto–Summarization', enabled: true },
        { id: 'auto-summary-3', label: 'Clinical Auto–Summarization', enabled: false },
      ],
    },
    {
      id: 'billing',
      title: 'Billing Features',
      items: [
        { id: 'basic-invoicing', label: 'Basic Invoicing', enabled: true },
        { id: 'reminders', label: 'Automated Payment Reminders', enabled: true },
        { id: 'bulk', label: 'Bulk Invoice Processing', enabled: false },
      ],
    },
  ]
}

function makePackage(
  name: string,
  price: number,
  cycle: BillingCycle,
  enabled: boolean
): SubscriptionManagePackage {
  return {
    id: createId(),
    name,
    price,
    cycle,
    enabled,
    featureGroups: seedGroups(),
  }
}

export const mockSubscriptionManagePackages: SubscriptionManagePackage[] = [
  makePackage('Basic', 50, 'monthly', true),
  makePackage('Advanced', 50, 'monthly', true),
  makePackage('Premium', 50, 'monthly', true),
  makePackage('Basic', 399, 'annual', true),
  makePackage('Advanced', 499, 'annual', false),
  makePackage('Premium', 599, 'annual', true),
  makePackage('Free Trial', 0, 'trial', true),
]

