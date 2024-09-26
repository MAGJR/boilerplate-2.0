import { http } from '@/services/http'
import { shared } from '@app/shared'

/**
 * Defines the GET route for synchronizing products and prices from Stripe.
 *
 * This route is responsible for handling the synchronization of products and prices from Stripe.
 * It fetches active products from Stripe, creates default products if none are found, updates existing products
 * in the local database, and fetches and updates prices associated with those products.
 *
 * @returns {Promise} A promise that resolves to the response.
 */
export const GET = http.get({
  name: 'syncStripeProducts',
  summary: 'Synchronizes products and prices from payment provider',
  description:
    'Fetches active products from the payment provider, creates default products if none are found, updates existing products in the local database, and fetches and updates prices associated with those products.',
  tags: ['stripe', 'sync'],
  beforeMiddlewares: [],
  schema: {},
  handler: async (req: any, res) => {
    try {
      await shared.usecases.plan.syncPlans.execute()
      return res.json({ status: 'SYNC_COMPLETED' })
    } catch (error) {
      console.error('Error syncing plans:', error)
      return res.json({ status: 'SYNC_FAILED', error: error.message }, 500)
    }
  },
})
