import Stripe from 'stripe'

/**
 * Represents the data required to upsert a customer.
 * @property {string} name - The customer's name.
 * @property {string} email - The customer's email address.
 */
export interface UpsertCustomerDTO {
  name: string
  email: string
}

/**
 * Represents the data required to create a subscription.
 * @property {string} customerId - The ID of the customer.
 * @property {string} planId - The ID of the plan.
 */
export interface CreateSubscriptionDTO {
  customerId: string
  planId: string
}

/**
 * Represents the data required to create a checkout session.
 * @property {string} customerId - The ID of the customer.
 * @property {string} subscriptionId - The ID of the subscription.
 * @property {string} priceId - The ID of the price.
 * @property {string} successUrl - The URL to redirect to on success.
 * @property {string} cancelUrl - The URL to redirect to on cancel.
 */
export interface CreateCheckoutSessionDTO {
  customerId: string
  subscriptionId: string
  priceId: string
  successUrl: string
  cancelUrl: string
}

/**
 * Represents the data required to create a customer portal session.
 * @property {string} customerId - The ID of the customer.
 * @property {string} returnUrl - The URL to return to after the session.
 */
export interface CreateCustomerPortalSessionDTO {
  customerId: string
  returnUrl: string
}

/**
 * Represents a subscription managed by a payment provider.
 * @property {string} paymentProviderId - The ID of the payment provider.
 * @property {string} status - The status of the subscription.
 * @property {boolean} cancelAtPeriodEnd - Indicates if the subscription should be canceled at the end of the period.
 * @property {(Date | null)} cancelAt - The date when the subscription was canceled.
 * @property {(Date | null)} canceledAt - The date when the subscription was canceled.
 * @property {(Date | null)} currentPeriodStart - The start date of the current period.
 * @property {(Date | null)} currentPeriodEnd - The end date of the current period.
 * @property {(Date | null)} endedAt - The date when the subscription ended.
 * @property {(Date | null)} trialStart - The start date of the trial period.
 * @property {(Date | null)} trialEnd - The end date of the trial period.
 * @property {(Date | null)} createdAt - The date when the subscription was created.
 * @property {string} priceId - The ID of the price.
 */
export interface PaymentProviderSubscription {
  paymentProviderId: string
  status: string
  cancelAtPeriodEnd: boolean
  cancelAt: Date | null
  canceledAt: Date | null
  currentPeriodStart: Date | null
  currentPeriodEnd: Date | null
  endedAt: Date | null
  trialStart: Date | null
  trialEnd: Date | null
  createdAt: Date | null
  priceId: string
}

/**
 * Represents the data required to create a plan.
 * @property {string} name - The name of the plan.
 * @property {string} description - The description of the plan.
 * @property {Record<string, string>} metadata - Additional metadata for the plan.
 * @property {{recurring: {interval: 'day' | 'week' | 'month' | 'year'}, currency: 'usd' | 'brl', unit_amount: number}[]} prices - The prices for the plan.
 */
export interface PaymentProviderCreatePlanDTO {
  name: string
  description: string
  metadata: Record<string, string>
  prices: {
    recurring: {
      interval: 'day' | 'week' | 'month' | 'year'
    }
    currency: 'usd' | 'brl'
    unit_amount: number
  }[]
}

/**
 * Represents a customer managed by a payment provider.
 * @property {string} id - The ID of the customer.
 */
export interface PaymentProviderCustomer {
  id: string
}

/**
 * Defines the interface for a payment provider.
 * @property {(dto: UpsertCustomerDTO) => Promise<PaymentProviderCustomer>} upsertCustomer - Upserts a customer.
 * @property {(dto: CreateSubscriptionDTO) => Promise<PaymentProviderSubscription>} createSubscription - Creates a subscription.
 * @property {(subscriptionId: string) => Promise<PaymentProviderSubscription | undefined>} getSubscription - Retrieves a subscription.
 * @property {(dto: CreateCheckoutSessionDTO) => Promise<string>} createCheckoutSession - Creates a checkout session.
 * @property {(dto: CreateCustomerPortalSessionDTO) => Promise<string>} createCustomerPortalSession - Creates a customer portal session.
 * @property {(dto: PaymentProviderCreatePlanDTO) => Promise<Stripe.Product>} createPlan - Creates a plan.
 */
export interface IPaymentProvider {
  upsertCustomer(dto: UpsertCustomerDTO): Promise<PaymentProviderCustomer>
  createSubscription(
    dto: CreateSubscriptionDTO,
  ): Promise<PaymentProviderSubscription>
  getSubscription(
    subscriptionId: string,
  ): Promise<PaymentProviderSubscription | undefined>
  createCheckoutSession(dto: CreateCheckoutSessionDTO): Promise<string>
  createCustomerPortalSession(
    dto: CreateCustomerPortalSessionDTO,
  ): Promise<string>
  createPlan(dto: PaymentProviderCreatePlanDTO): Promise<Stripe.Product>

  /**
   * Lists all active products.
   * @returns {Promise<Stripe.Product[]>} A promise that resolves to an array of Stripe Product objects.
   */
  listProducts(): Promise<Stripe.Product[]>

  /**
   * Lists all active prices.
   * @returns {Promise<Stripe.Price[]>} A promise that resolves to an array of Stripe Price objects.
   */
  listPrices(): Promise<Stripe.Price[]>

  /**
   * Creates a new plan (product) with associated prices.
   * @param {PaymentProviderCreatePlanDTO} dto - The data for creating the plan.
   * @returns {Promise<Stripe.Product>} A promise that resolves to the created Stripe Product object.
   */
  createPlan(dto: PaymentProviderCreatePlanDTO): Promise<Stripe.Product>
}
