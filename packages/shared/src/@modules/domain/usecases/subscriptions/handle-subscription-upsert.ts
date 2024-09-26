import { toDateTime } from '@app/shared'
import Stripe from 'stripe'
import { ISubscriptionRepository } from '../../../interfaces/repositories/subscription'

/**
 * Represents the use case for handling subscription upsert operations.
 * This class is responsible for updating the subscription details based on the provided Stripe subscription data.
 */
export class HandleSubscriptionUpsertUseCase {
  /**
   * Initializes the use case with the necessary subscription repository.
   * @param {ISubscriptionRepository} subscriptionRepository - The repository for managing subscriptions.
   */
  constructor(private subscriptionRepository: ISubscriptionRepository) {}

  /**
   * Executes the upsert operation for a given Stripe subscription.
   * This method updates the subscription details based on the provided Stripe subscription data.
   * @param {Stripe.Subscription} data - The Stripe subscription data.
   * @returns {Promise<void>} A promise that resolves when the upsert operation is complete.
   */
  async execute(data: Stripe.Subscription): Promise<void> {
    await this.subscriptionRepository.update({
      paymentProviderId: data.id,
      status: data.status,
      cancelAtPeriodEnd: data.cancel_at_period_end,
      cancelAt: toDateTime(data.cancel_at),
      canceledAt: toDateTime(data.canceled_at),
      currentPeriodStart: toDateTime(data.current_period_start),
      currentPeriodEnd: toDateTime(data.current_period_end),
      endedAt: toDateTime(data.ended_at),
      trialStart: toDateTime(data.trial_start),
      trialEnd: toDateTime(data.trial_end),
      createdAt: toDateTime(data.created),
      priceId: data.items.data[0].price.id,
    })
  }
}
