import Stripe from 'stripe'

import { toDateTime } from '@app/shared'
import { ISubscriptionRepository } from '../../../interfaces/repositories/subscription'

/**
 * Represents the use case for handling invoice payment succeeded events.
 * This class is responsible for updating the subscription details upon successful invoice payment.
 */
export class HandleInvoicePaymentSucceededUseCase {
  /**
   * Creates a new instance of the HandleInvoicePaymentSucceededUseCase.
   * @param {ISubscriptionRepository} subscriptionRepository - The repository for managing subscriptions.
   */
  constructor(private subscriptionRepository: ISubscriptionRepository) {}

  /**
   * Executes the use case.
   * This method updates the subscription details based on the provided invoice data.
   * @param {Stripe.Invoice} data - The invoice data from Stripe.
   * @returns {Promise<void>} A promise that resolves when the subscription is updated.
   */
  async execute(data: Stripe.Invoice): Promise<void> {
    await this.subscriptionRepository.update({
      paymentProviderId: data.subscription as string,
      currentPeriodStart: toDateTime(data.period_start),
      currentPeriodEnd: toDateTime(data.period_end),
    })
  }
}
