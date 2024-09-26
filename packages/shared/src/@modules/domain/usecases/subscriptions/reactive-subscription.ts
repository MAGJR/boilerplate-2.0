import { IPlanRepository } from '../../../interfaces/repositories/plan'
import { IPlanPriceRepository } from '../../../interfaces/repositories/plan-price'
import {
  ISubscriptionRepository,
  SubscriptionUpdateDTO,
} from '../../../interfaces/repositories/subscription'
import { ITenantRepository } from '../../../interfaces/repositories/tenant'
import { Subscription } from '../../entities/Subscription'

/**
 * Represents the use case for reactivating a subscription.
 * This class encapsulates the logic for reactivating a subscription in the repository.
 */
export class ReactiveSubscriptionUseCase {
  /**
   * Constructs a new instance of the ReactiveSubscriptionUseCase.
   *
   * @param {ISubscriptionRepository} subscriptionRepository - The repository for managing subscriptions.
   * @param {ITenantRepository} tenantRepository - The repository for managing tenants.
   * @param {IPlanPriceRepository} planPriceRepository - The repository for managing plan prices.
   * @param {IPlanRepository} planRepository - The repository for managing plans.
   */
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private tenantRepository: ITenantRepository,
    private planPriceRepository: IPlanPriceRepository,
    private planRepository: IPlanRepository,
  ) {}

  /**
   * Executes the use case for reactivating a subscription.
   * This method first checks if the subscription, tenant, plan price, and plan exist.
   * If all exist, it updates the subscription status to 'active' and removes the cancellation date.
   *
   * @param {string} subscriptionId - The unique identifier of the subscription to be reactivated.
   * @returns {Promise<Subscription>} A promise that resolves to the reactivated Subscription entity.
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

    const planExists = await this.planRepository.findByPlanId(
      planPriceExists.planId,
    )
    if (!planExists) {
      throw new Error('Plan does not exist')
    }

    const updatedSubscription = await this.subscriptionRepository.update({
      ...subscription,
      status: 'active',
      canceledAt: undefined,
    } as SubscriptionUpdateDTO)

    return updatedSubscription
  }
}
