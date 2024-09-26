import Stripe from 'stripe'
import { error, log } from '../../interfaces/core/log'

import {
  CreateCheckoutSessionDTO,
  CreateCustomerPortalSessionDTO,
  CreateSubscriptionDTO,
  IPaymentProvider,
  PaymentProviderCreatePlanDTO,
  PaymentProviderCustomer,
  PaymentProviderSubscription,
  UpsertCustomerDTO,
} from '../../interfaces/providers/payment'

/**
 * Implements the IPaymentProvider interface to interact with Stripe for payment operations.
 */
export class StripePaymentProvider implements IPaymentProvider {
  /**
   * The Stripe client instance.
   */
  stripe: Stripe

  /**
   * Initializes the StripePaymentProvider with a Stripe client instance.
   */
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2024-04-10',
    })
    log({ provider: 'StripePaymentProvider', message: 'Initialized' })
  }

  /**
   * Upserts a customer in Stripe. If the customer does not exist, it creates a new one. Otherwise, it updates the existing customer.
   * @param dto The data transfer object containing the customer details.
   * @returns A Promise that resolves to the upserted customer.
   */
  async upsertCustomer(
    dto: UpsertCustomerDTO,
  ): Promise<PaymentProviderCustomer> {
    log({ provider: 'StripePaymentProvider', message: 'Upserting customer' })
    const { name, email } = dto
    const customers = await this.stripe.customers.list({ email })
    if (customers.data.length === 0) {
      const customer = await this.stripe.customers.create({
        name,
        email,
      })

      log({ provider: 'StripePaymentProvider', message: 'Customer created' })
      return {
        id: customer.id,
      }
    } else {
      const customer = await this.stripe.customers.update(
        customers.data[0].id,
        {
          name,
        },
      )

      log({ provider: 'StripePaymentProvider', message: 'Customer updated' })
      return {
        id: customer.id,
      }
    }
  }

  /**
   * Creates a new subscription for a customer in Stripe.
   * @param dto The data transfer object containing the subscription details.
   * @returns A Promise that resolves to the created subscription.
   */
  async createSubscription(
    dto: CreateSubscriptionDTO,
  ): Promise<PaymentProviderSubscription> {
    log({ provider: 'StripePaymentProvider', message: 'Creating subscription' })
    const { customerId, planId } = dto

    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ plan: planId }],
    })

    log({ provider: 'StripePaymentProvider', message: 'Subscription created' })
    return {
      paymentProviderId: subscription.id,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cancelAt: this.parseDate(subscription.cancel_at),
      canceledAt: this.parseDate(subscription.canceled_at),
      currentPeriodStart: this.parseDate(subscription.current_period_start),
      currentPeriodEnd: this.parseDate(subscription.current_period_end),
      endedAt: this.parseDate(subscription.ended_at),
      trialStart: this.parseDate(subscription.trial_start),
      trialEnd: this.parseDate(subscription.trial_end),
      createdAt: this.parseDate(subscription.created),
      priceId: subscription.items.data[0].price.id,
    }
  }

  /**
   * Creates a checkout session for a subscription update.
   * @param dto The data transfer object containing the checkout session details.
   * @returns A Promise that resolves to the URL of the checkout session.
   */
  async createCheckoutSession(dto: CreateCheckoutSessionDTO): Promise<string> {
    log({
      provider: 'StripePaymentProvider',
      message: 'Creating checkout session',
    })
    const subscription = await this.stripe.subscriptionItems.list({
      subscription: dto.subscriptionId,
      limit: 1,
    })

    const stripeSession = await this.stripe.billingPortal.sessions.create({
      customer: dto.customerId,
      return_url: dto.successUrl,
      flow_data: {
        type: 'subscription_update_confirm',
        after_completion: {
          type: 'redirect',
          redirect: {
            return_url: dto.successUrl,
          },
        },
        subscription_update_confirm: {
          subscription: dto.subscriptionId,
          items: [
            {
              id: subscription.data[0].id,
              price: dto.priceId,
              quantity: 1,
            },
          ],
        },
      },
    })

    log({
      provider: 'StripePaymentProvider',
      message: 'Checkout session created',
    })
    return stripeSession.url
  }

  /**
   * Creates a customer portal session for managing subscriptions.
   * @param dto The data transfer object containing the customer portal session details.
   * @returns A Promise that resolves to the URL of the customer portal session.
   */
  async createCustomerPortalSession(
    dto: CreateCustomerPortalSessionDTO,
  ): Promise<string> {
    log({
      provider: 'StripePaymentProvider',
      message: 'Creating customer portal session',
    })
    const session = await this.stripe.billingPortal.sessions.create({
      customer: dto.customerId,
      return_url: dto.returnUrl,
    })

    log({
      provider: 'StripePaymentProvider',
      message: 'Customer portal session created',
    })
    return session.url
  }

  /**
   * Retrieves a subscription by its ID from Stripe.
   * @param subscriptionId The ID of the subscription to be retrieved.
   * @returns A Promise that resolves to the subscription if found, or undefined if not found.
   */
  async getSubscription(
    subscriptionId: string,
  ): Promise<PaymentProviderSubscription | undefined> {
    log({
      provider: 'StripePaymentProvider',
      message: 'Retrieving subscription',
    })
    const subscription =
      await this.stripe.subscriptions.retrieve(subscriptionId)

    if (!subscription) {
      log({
        provider: 'StripePaymentProvider',
        message: 'Subscription not found',
      })
      return undefined
    }

    log({
      provider: 'StripePaymentProvider',
      message: 'Subscription retrieved',
    })
    return {
      paymentProviderId: subscription.id,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cancelAt: this.parseDate(subscription.cancel_at),
      canceledAt: this.parseDate(subscription.canceled_at),
      currentPeriodStart: this.parseDate(subscription.current_period_start),
      currentPeriodEnd: this.parseDate(subscription.current_period_end),
      endedAt: this.parseDate(subscription.ended_at),
      trialStart: this.parseDate(subscription.trial_start),
      trialEnd: this.parseDate(subscription.trial_end),
      createdAt: this.parseDate(subscription.created),
      priceId: subscription.items.data[0].price.id,
    }
  }

  /**
   * Creates a new plan in Stripe.
   * @param data The data transfer object containing the plan details.
   * @returns A Promise that resolves to the created plan.
   */
  async createPlan(
    data: PaymentProviderCreatePlanDTO,
  ): Promise<Stripe.Product> {
    log({ provider: 'StripePaymentProvider', message: 'Creating plan' })
    const priceMonth = data.prices.find(
      (price) => price.recurring.interval === 'month',
    )

    if (!priceMonth) {
      error({
        provider: 'StripePaymentProvider',
        message: 'Monthly pricing data is missing',
      })
      throw new Error('Monthly pricing data is missing for this plan.')
    }

    const product = await this.stripe.products.create({
      name: data.name,
      description: data.description,
      default_price_data: {
        currency: priceMonth.currency,
        unit_amount: priceMonth.unit_amount,
        recurring: {
          interval: priceMonth.recurring.interval,
        },
      },
      metadata: data.metadata,
    })

    const pricesWithoutMonth = data.prices.filter(
      (price) => price.recurring.interval !== 'month',
    )

    for (const price of pricesWithoutMonth) {
      await this.stripe.prices.create({
        product: product.id,
        currency: price.currency,
        unit_amount: price.unit_amount,
        recurring: {
          interval: price.recurring.interval,
        },
      })
    }

    log({ provider: 'StripePaymentProvider', message: 'Plan created' })
    return product
  }

  /**
   * Parses a Unix timestamp to a Date object.
   * @param timestamp The Unix timestamp to be parsed.
   * @returns A Date object if the timestamp is not null, otherwise null.
   */
  private parseDate(timestamp: number | null): Date | null {
    return timestamp ? new Date(timestamp * 1000) : null
  }

  async listProducts(): Promise<Stripe.Product[]> {
    log({ provider: 'StripePaymentProvider', message: 'Listing products' })
    const products = await this.stripe.products.list({ active: true })
    log({ provider: 'StripePaymentProvider', message: 'Products listed' })
    return products.data
  }

  async listPrices(): Promise<Stripe.Price[]> {
    log({ provider: 'StripePaymentProvider', message: 'Listing prices' })
    const prices = await this.stripe.prices.list({ active: true })
    log({ provider: 'StripePaymentProvider', message: 'Prices listed' })
    return prices.data
  }
}
