export type PlanFeature = {
  id: string
  value: string
  label?: string
}
export type SubscriptionHistory = {
  date: Date
  action: string
  details: string
}

export type FeatureInfo = {
  id: string
  available: boolean
  quota?: {
    available: number
    total: number
    usage: number
    usageRate: number
  }
}

export type TenantSubscription = {
  currentPlan: {
    id: string
    subscriptionPaymentProviderId: string
    planPaymentProviderId: string
    pricePaymentProviderId: string
    name: string
    metadata: Record<string, unknown>
    features: PlanFeature[]
    status: string
    startDate: Date
    endDate: Date | null
    price: number
    paymentInterval: string
  }

  features: FeatureInfo[]

  trialInfo: {
    isInTrial: boolean
    trialStartDate: Date | null
    trialEndDate: Date | null
  }

  billingDetails: {
    nextPaymentDue: Date | null
    lastPaymentDate: Date | null
  }

  history?: SubscriptionHistory[]
}
