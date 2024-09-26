import { shared } from '../..'
import { PlanPrice } from './PlanPrice'

/**
 * Represents a plan available for subscription.
 *
 * @property {string} id - The unique identifier of the plan.
 * @property {string} paymentProviderId - The unique identifier of the payment provider.
 * @property {string} name - The name of the plan.
 * @property {(string | null)} description - Optional. A description of the plan.
 * @property {any} metadata - Optional. Additional metadata about the plan.
 * @property {boolean} active - Indicates if the plan is active.
 * @property {PlanPrice[]} prices - Optional. An array of prices associated with the plan.
 */
export type Plan = {
  id: string
  paymentProviderId: string
  name: string
  description?: string | null
  metadata?: Record<
    keyof typeof shared.config.application.providers.billing.meta,
    string
  >
  active: boolean
  prices?: PlanPrice[]
}
