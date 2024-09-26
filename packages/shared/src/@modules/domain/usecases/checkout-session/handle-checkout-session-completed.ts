import { shared } from '@app/shared'
import Stripe from 'stripe'
import { ISubscriptionRepository } from '../../../interfaces/repositories/subscription'

/**
 * This use case handles the completion of a checkout session.
 * It updates the subscription status based on the session data.
 */
export class HandleCheckoutSessionCompletedUseCase {
  /**
   * Creates a new instance of the HandleCheckoutSessionCompletedUseCase.
   * @param {ISubscriptionRepository} subscriptionRepository - The repository for managing subscriptions.
   */
  constructor(private subscriptionRepository: ISubscriptionRepository) {}

  /**
   * Executes the use case.
   * @param {Stripe.Checkout.Session} session - The checkout session to be handled.
   * @returns {Promise<void>} A promise that resolves when the session is handled.
   */
  async execute(session: Stripe.Checkout.Session): Promise<void> {
    const stripeSubscription = await shared.provider.payment.getSubscription(
      session.subscription as string,
    )

    const subscription = await this.subscriptionRepository.findUnique({
      paymentProviderId: session.subscription as string,
    })

    if (!session.client_reference_id) {
      throw new Error('Tenant not found')
    }

    if (!subscription) {
      await this.subscriptionRepository.create({
        tenantId: session.client_reference_id,
        status: stripeSubscription?.status ?? 'active',
        priceId: stripeSubscription?.priceId as string,
      })
    } else {
      await this.subscriptionRepository.update({
        paymentProviderId: session.subscription as string,
        status: stripeSubscription?.status ?? 'active',
        priceId: stripeSubscription?.priceId as string,
      })
    }
  }
}
