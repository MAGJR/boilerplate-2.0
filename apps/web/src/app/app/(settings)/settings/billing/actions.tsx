'use server'

import { client } from '@/services/actions/clients/tenant.client'
import { getUrl, interpolate, shared } from '@app/shared'
import { z } from 'zod'
import { createCheckoutSessionSchema } from './schemas'

/**
 * Action to create a checkout session for a tenant.
 *
 * This action handles the creation of a checkout session for the specified
 * price ID. It uses the tenant's payment provider ID and the current subscription
 * payment provider ID to create the session. Upon successful creation, it returns
 * the session details.
 *
 * @param {Object} input - The input data for creating the checkout session.
 * @param {string} input.priceId - The ID of the price for the checkout session.
 * @param {Object} context - The context object containing tenant information.
 * @param {Object} context.tenant - The current tenant object, which includes payment provider details.
 * @returns {Promise<Object>} A promise that resolves to the created checkout session object.
 */
export const createCheckoutSessionAction = client.action({
  name: 'app.checkout.session',
  type: 'mutate',
  schema: createCheckoutSessionSchema,
  handler: async ({ input, context }) => {
    const { tenant } = context
    const { priceId } = input

    return shared.provider.payment.createCheckoutSession({
      customerId: tenant.paymentProviderId,
      subscriptionId:
        tenant.subscription.currentPlan.subscriptionPaymentProviderId,
      priceId,
      successUrl: getUrl('/app/settings/billing?success=true'),
      cancelUrl: getUrl('/app/settings/billing?success=false'),
    })
  },
})

/**
 * Action to create a customer portal session for a tenant.
 *
 * This action handles the creation of a customer portal session for the tenant.
 * It uses the tenant's payment provider ID to create the session and returns the
 * session details.
 *
 * @param {Object} context - The context object containing tenant information.
 * @param {Object} context.tenant - The current tenant object, which includes payment provider details.
 * @returns {Promise<Object>} A promise that resolves to the created customer portal session object.
 */
export const createManagerSessionAction = client.action({
  name: 'app.account-manager.session',
  type: 'mutate',
  handler: async ({ context }) => {
    const { tenant } = context

    return shared.provider.payment.createCustomerPortalSession({
      customerId: tenant.paymentProviderId,
      returnUrl: getUrl('/app/settings/billing?success=true'),
    })
  },
})

/**
 * Action to retrieve available plans.
 *
 * This action fetches the available plans from the system and returns them
 * ordered by price. Each plan includes its features, which are derived from
 * the plan's metadata.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of available plans,
 *                                    each containing its features and pricing information.
 */
export const getPlansAction = client.action({
  name: 'app.plans.get',
  type: 'query',
  handler: async () => {
    const plans = await shared.usecases.plan.getPlans.execute()

    const plansWithFeatured = plans.map((plan) => ({
      ...plan,
      features: Object.keys(plan.metadata).map((key) => {
        return {
          id: key,
          value: plan.metadata[key],
          label: interpolate(
            shared.config.application.providers.billing.meta[key].label,
            {
              value: plan.metadata[key],
            },
          ),
        }
      }),
    }))

    const plansOrderedByPrice = plansWithFeatured.sort(
      (a, b) => a.prices[0].price - b.prices[0].price,
    )

    return plansOrderedByPrice
  },
})

export const getFeatureQuotaAction = client.action({
  name: 'app.feature.quota',
  type: 'query',
  schema: z.object({
    feature: z.string(),
  }),
  handler: async ({ input, context }) => {
    const { feature } = input
    const { tenant } = context

    return shared.provider.quota.getFeatureQuota(tenant.id, feature)
  },
})
