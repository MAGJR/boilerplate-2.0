import { client } from '@/services/actions/clients/public.client'
import { formatNumber, interpolate, shared } from '@app/shared'

/**
 * Retrieves public plans, enriches them with formatted features, and sorts them by price.
 *
 * This action fetches plans from the `shared.usecases.plan.getPlans.execute()` method,
 * maps over each plan to create a new array of plans with their features formatted,
 * and finally sorts the plans by their price in ascending order.
 *
 * @returns {Promise<any>} A promise that resolves to an array of plans sorted by price.
 */
export const getPublicPlansAction = client.action({
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
              value: formatNumber(Number(plan.metadata[key])),
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
