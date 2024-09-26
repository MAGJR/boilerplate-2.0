import Stripe from 'stripe'

import { APP_CONFIGS } from '../../../../boilerplate.config'
import { plans } from '../../../../boilerplate.plans'
import { log } from '../../../interfaces/core/log'
import { IPaymentProvider } from '../../../interfaces/providers/payment'
import { IPlanRepository } from '../../../interfaces/repositories/plan'
import { IPlanPriceRepository } from '../../../interfaces/repositories/plan-price'

/**
 * Represents the use case for synchronizing plans with the payment provider.
 * This class is responsible for fetching products from the payment provider, creating default products if none are found,
 * updating existing products in the local database, and fetching and updating prices associated with those products.
 */
export class SyncPlansUseCase {
  /**
   * Creates a new instance of the SyncPlansUseCase.
   * @param {IPlanRepository} planRepository - The repository for managing plans.
   * @param {IPlanPriceRepository} planPriceRepository - The repository for managing plan prices.
   * @param {IPaymentProvider} paymentProvider - The payment provider for managing products and prices.
   */
  constructor(
    private planRepository: IPlanRepository,
    private planPriceRepository: IPlanPriceRepository,
    private paymentProvider: IPaymentProvider,
  ) {}

  /**
   * Executes the use case.
   * This method synchronizes plans with the payment provider by fetching products, creating default products if necessary,
   * updating existing products, and fetching and updating prices.
   * @returns {Promise<void>} A promise that resolves when the synchronization is complete.
   */
  async execute(): Promise<void> {
    log({
      provider: 'SyncPlansUseCase',
      message: 'Fetching products from payment provider',
    })
    let products = await this.paymentProvider.listProducts()

    // Check if there are any valid plans in the Stripe
    const validStripePlans = products.filter((product) =>
      this.isPlanValid(product, APP_CONFIGS.providers.billing.meta),
    )
    log({
      provider: 'SyncPlansUseCase',
      message: `Found ${validStripePlans.length} valid plans in Stripe.`,
    })

    // Check if there are any plans in the database
    const dbPlans = await this.planRepository.list()
    log({
      provider: 'SyncPlansUseCase',
      message: `Found ${dbPlans.length} plans in the database.`,
    })

    // If there are no valid plans in Stripe, create default plans
    if (validStripePlans.length === 0) {
      log({
        provider: 'SyncPlansUseCase',
        message: 'No valid plans found in Stripe, creating default plans...',
      })
      for (const planData of plans) {
        const product = await this.paymentProvider.createPlan(planData as any)
        log({
          provider: 'SyncPlansUseCase',
          message: `Product created: ${product.name}`,
        })
        await this.upsertPlan(product)
      }
      products = await this.paymentProvider.listProducts()
    }

    // Upsert plans in the database
    for (const product of products) {
      if (this.isPlanValid(product, APP_CONFIGS.providers.billing.meta)) {
        await this.upsertPlan(product)
      } else {
        log({
          provider: 'SyncPlansUseCase',
          message: `Plan ${product.id} is not valid, archiving...`,
        })
        // Archive the plan
      }
    }

    log({
      provider: 'SyncPlansUseCase',
      message: 'Products updated successfully!',
    })
    log({
      provider: 'SyncPlansUseCase',
      message: 'Fetching prices from payment provider',
    })

    const prices = await this.paymentProvider.listPrices()
    log({ provider: 'SyncPlansUseCase', message: 'Updating Prices' })

    for (const price of prices) {
      const plan = await this.planRepository.findByProviderId(
        price.product as string,
      )

      if (!plan) {
        log({
          provider: 'SyncPlansUseCase',
          message: `Plan not found for product: ${price.product}`,
        })
        continue
      }

      await this.upsertPlanPrice(price, plan.id)
    }

    log({
      provider: 'SyncPlansUseCase',
      message: 'Prices updated successfully!',
    })
  }

  /**
   * Checks if a plan is valid based on the expected metadata.
   * @param {Stripe.Product} product - The product data from the payment provider.
   * @param {Record<string, unknown>} expectedMetadata - The expected metadata for the plan.
   * @returns {boolean} True if the plan is valid, false otherwise.
   */
  private isPlanValid(
    product: Stripe.Product,
    expectedMetadata: Record<string, unknown>,
  ): boolean {
    return Object.keys(expectedMetadata).every(
      (key) => product.metadata[key] !== undefined,
    )
  }

  /**
   * Upserts a plan in the local database.
   * This method updates or inserts a plan based on the provided product data.
   * @param {Stripe.Product} product - The product data from the payment provider.
   * @returns {Promise<void>} A promise that resolves when the plan is upserted.
   */
  private async upsertPlan(product: Stripe.Product): Promise<void> {
    log({
      provider: 'SyncPlansUseCase',
      message: `Upserting Product: ${product.id}`,
    })
    await this.planRepository.upsert({
      paymentProviderId: product.id,
      active: product.active,
      name: product.name,
      description: product.description || '',
      metadata: product.metadata,
    })
  }

  /**
   * Upserts a plan price in the local database.
   * This method updates or inserts a plan price based on the provided price data.
   * @param {Stripe.Price} price - The price data from the payment provider.
   * @param {string} planId - The ID of the plan to associate with the price.
   * @returns {Promise<void>} A promise that resolves when the plan price is upserted.
   */
  private async upsertPlanPrice(
    price: Stripe.Price,
    planId: string,
  ): Promise<void> {
    await this.planPriceRepository.upsert({
      paymentProviderId: price.id,
      planId,
      active: price.active,
      type: price.type,
      price: price.unit_amount || 0,
      currency: price.currency,
      interval: price.recurring?.interval || 'month',
      intervalCount: price.recurring?.interval_count || 1,
      trialPeriodDays: price.recurring?.trial_period_days || undefined,
    })
  }
}
