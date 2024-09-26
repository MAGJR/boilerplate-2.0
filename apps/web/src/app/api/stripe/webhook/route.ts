import { http } from '@/services/http'
import { sessionMiddleware } from '@/services/http/middlewares/session'
import { shared } from '@app/shared'
import { z } from 'zod'

/**
 * Defines the POST route for handling Stripe webhooks.
 *
 * This route is responsible for handling various Stripe webhook events.
 * It ensures the session middleware is applied and validates the request body.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 *
 * @returns {Promise} A promise that resolves to the response.
 */
export const POST = http.post({
  name: 'handleStripeWebhooks',
  summary: 'Handles Stripe webhooks',
  description: 'Handles various Stripe webhook events',
  tags: ['stripe', 'webhook'],
  beforeMiddlewares: [sessionMiddleware],
  schema: {
    body: z.string(),
  },
  handler: async (req: any, res) => {
    const body = await req.text()
    const signature = req.headers.get('Stripe-Signature') as string

    let event

    try {
      event = shared.provider.payment.stripe.webhooks.constructEvent(
        body,
        signature,
        shared.config.application.providers.billing.keys.webhook as string,
      )
    } catch (error: any) {
      console.error(`Webhook Error: ${error.message}`)
      return res.json({ error: `Webhook Error: ${error.message}` }, 400)
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await shared.usecases.checkout.handleCheckoutSessionCompleted.execute(
          event.data.object,
        )
        break
      case 'invoice.payment_succeeded':
        await shared.usecases.checkout.handleInvoicePaymentSucceeded.execute(
          event.data.object,
        )
        break
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await shared.usecases.subscription.handleSubscriptionUpsert.execute(
          event.data.object,
        )
        break
      case 'product.created':
      case 'product.updated':
        await shared.usecases.plan.handlePlanUpsert.execute(event.data.object)
        break
      case 'price.created':
      case 'price.updated':
        await shared.usecases.planPrice.handlePriceUpsert.execute(
          event.data.object,
        )
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return res.json({ received: true })
  },
})
