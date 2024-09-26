/**
 * Represents a price plan for a subscription.
 *
 * @property {string} id - The unique identifier of the plan price.
 * @property {string} planId - The unique identifier of the plan associated with this price.
 * @property {string} paymentProviderId - The unique identifier of the payment provider.
 * @property {boolean} active - Indicates if the plan price is active.
 * @property {string} type - The type of the plan price, e.g., "recurring".
 * @property {number} price - The price of the plan, stored as an integer (e.g., cents).
 * @property {string} currency - The currency of the plan price.
 * @property {string} interval - The interval at which the plan price is charged, e.g., "month", "year".
 * @property {number} intervalCount - The number of intervals between charges.
 * @property {(number | null)} trialPeriodDays - Optional. The number of days in the trial period, or null if no trial period.
 */
export type PlanPrice = {
  id: string
  planId: string
  paymentProviderId: string
  active: boolean
  type: string // e.g., "recurring"
  price: number // Assuming price is stored as an integer (e.g., cents)
  currency: string
  interval: string // e.g., "month", "year"
  intervalCount: number
  trialPeriodDays?: number | null
}
