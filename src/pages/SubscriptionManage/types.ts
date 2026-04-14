export type BillingCycle = 'monthly' | 'annual' | 'trial'

export interface FeatureItem {
  id: string
  label: string
  enabled: boolean
}

export interface FeatureGroup {
  id: string
  title: string
  items: FeatureItem[]
}

export interface SubscriptionManagePackage {
  id: string
  name: string
  price: number
  cycle: BillingCycle
  enabled: boolean
  featureGroups: FeatureGroup[]
}

