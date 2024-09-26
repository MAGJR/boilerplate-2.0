import { IPlanPriceRepository } from '../../../interfaces/repositories/plan-price'
import {
  ISubscriptionRepository,
  SubscriptionUpdateDTO,
} from '../../../interfaces/repositories/subscription'
import { ITenantRepository } from '../../../interfaces/repositories/tenant'
import { Subscription } from '../../entities/Subscription'

/**
 * Represents the use case for cancelling a subscription.
 * This class encapsulates the logic for cancelling a subscription in the repository.
 */
export class CancelSubscriptionUseCase {
  /**
   * Constructs a new instance of the CancelSubscriptionUseCase.
   *
   * @param {ISubscriptionRepository} subscriptionRepository - The repository for managing subscriptions.
   * @param {ITenantRepository} tenantRepository - The repository for managing tenants.
   * @param {IPlanPriceRepository} planPriceRepository - The repository for managing plan prices.
   */
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private tenantRepository: ITenantRepository,
    private planPriceRepository: IPlanPriceRepository,
  ) {}

  /**
   * Executes the use case for cancelling a subscription.
   * This method first checks if the subscription, tenant, and plan price exist.
   * If all exist, it updates the subscription status to 'cancelled' and sets the cancellation date.
   *
   * @param {string} subscriptionId - The unique identifier of the subscription to be cancelled.
   * @returns {Promise<Subscription>} A promise that resolves to the updated Subscription entity.
   */
  async execute(subscriptionId: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findUnique({
      paymentProviderId: subscriptionId,
    })
    if (!subscription) {
      throw new Error('Subscription does not exist')
    }

    const tenantExists = await this.tenantRepository.getById(
      subscription.tenantId,
    )
    if (!tenantExists) {
      throw new Error('Tenant does not exist')
    }

    const planPriceExists = await this.planPriceRepository.getById(
      subscription.priceId,
    )
    if (!planPriceExists) {
      throw new Error('Plan price does not exist')
    }

    const updatedSubscription = await this.subscriptionRepository.update({
      ...subscription,
      status: 'cancelled',
      canceledAt: new Date(),
    } as SubscriptionUpdateDTO)

    return updatedSubscription
  }
}
