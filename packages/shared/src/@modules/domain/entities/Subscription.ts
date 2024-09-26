/**
 * Represents a subscription to a plan.
 *
 * @property {string} id - The unique identifier of the subscription.
 * @property {string} tenantId - The unique identifier of the tenant.
 * @property {string} paymentProviderId - The unique identifier of the payment provider.
 * @property {string} status - The status of the subscription.
 * @property {boolean} cancelAtPeriodEnd - Indicates if the subscription should be canceled at the end of the period.
 * @property {(Date | null)} cancelAt - Optional. The date and time the subscription was canceled.
 * @property {(Date | null)} canceledAt - Optional. The date and time the subscription was marked as canceled.
 * @property {(Date | null)} currentPeriodStart - Optional. The start date and time of the current period.
 * @property {(Date | null)} currentPeriodEnd - Optional. The end date and time of the current period.
 * @property {(Date | null)} endedAt - Optional. The date and time the subscription ended.
 * @property {(Date | null)} trialStart - Optional. The start date and time of the trial period.
 * @property {(Date | null)} trialEnd - Optional. The end date and time of the trial period.
 * @property {string} priceId - The unique identifier of the price plan.
 * @property {Date} createdAt - The date and time the subscription was created.
 */
export type Subscription = {
  id: string
  tenantId: string
  paymentProviderId: string
  status: string
  cancelAtPeriodEnd: boolean
  cancelAt?: Date | null
  canceledAt?: Date | null
  currentPeriodStart?: Date | null
  currentPeriodEnd?: Date | null
  endedAt?: Date | null
  trialStart?: Date | null
  trialEnd?: Date | null
  priceId: string
  createdAt: Date
}
