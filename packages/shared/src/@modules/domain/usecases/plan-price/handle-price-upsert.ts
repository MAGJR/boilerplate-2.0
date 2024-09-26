import Stripe from 'stripe'
import { IPlanRepository } from '../../../interfaces/repositories/plan'
import { IPlanPriceRepository } from '../../../interfaces/repositories/plan-price'

/**
 * Handles the upsert operation for a price in the payment webhook.
 */
export class HandlePriceUpsertUseCase {
  /**
   * Initializes the use case with the necessary repositories.
   *
   * @param planRepository - The repository for managing plans.
   * @param planPriceRepository - The repository for managing plan prices.
   */
  constructor(
    private planRepository: IPlanRepository,
    private planPriceRepository: IPlanPriceRepository,
  ) {}

  /**
   * Executes the upsert operation for a given Stripe price.
   *
   * @param data - The Stripe price data.
   * @returns A promise that resolves when the operation is complete.
   * @throws Throws an error if the plan associated with the price is not found.
   */
  async execute(data: Stripe.Price): Promise<void> {
    const plan = await this.planRepository.findByProviderId(
      data.product as string,
    )

    if (!plan) {
      throw new Error('Plan not found')
    }

    await this.planPriceRepository.upsert({
      paymentProviderId: data.id,
      active: data.active,
      type: data.type,
      price: data.unit_amount ?? 0,
      currency: data.currency,
      interval: data.recurring?.interval ?? 'month',
      intervalCount: data.recurring?.interval_count ?? 1,
      trialPeriodDays: data.recurring?.trial_period_days ?? undefined,
      planId: plan.id,
    })
  }
}
