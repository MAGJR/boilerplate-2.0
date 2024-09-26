import { z } from 'zod'

/**
 * Schema for creating a checkout session.
 *
 * This schema defines the structure of the input required to create
 * a checkout session, including the price ID for the session.
 *
 * @typedef {Object} CreateCheckoutSessionInput
 * @property {string} priceId - The ID of the price for the checkout session.
 */
export const createCheckoutSessionSchema = z.object({
  priceId: z.string(),
})
