import { shared } from '..'

/**
 * Represents the metadata for a plan, where keys are from the billing configuration
 * and values are strings.
 */
export type PlanMetadata = Record<
  keyof typeof shared.config.application.providers.billing.meta,
  string
>

/**
 * Represents the actual keys of the billing metadata configuration as a union type.
 */
export type PlanMetadataKeyLiteral =
  keyof typeof shared.config.application.providers.billing.meta

/**
 * Represents the price structure for a plan.
 *
 * @property {Object} recurring - The recurring payment details.
 * @property {('month' | 'year')} recurring.interval - The interval of recurring payments.
 * @property {string} currency - The currency of the price.
 * @property {number} unit_amount - The amount per unit in the smallest currency unit (e.g., cents for USD).
 */
export type PlanPrice = {
  recurring: {
    interval: 'month' | 'year'
  }
  currency: string
  unit_amount: number
}

/**
 * Represents a plan available for subscription.
 *
 * @property {string} name - The name of the plan.
 * @property {string} description - A description of the plan.
 * @property {PlanMetadata} metadata - Additional metadata about the plan.
 * @property {Array<PlanPrice>} prices - An array of prices associated with the plan.
 */
export type Plan = {
  name: string
  description: string
  metadata: PlanMetadata
  prices: PlanPrice[]
}
