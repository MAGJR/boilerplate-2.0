import {
  ISubscriptionRepository,
  SubscriptionFirstDTO,
} from '../../../interfaces/repositories/subscription'
import { ITenantRepository } from '../../../interfaces/repositories/tenant'
import { Subscription } from '../../entities/Subscription'

/**
 * Represents the use case for retrieving the first subscription of a tenant.
 * This class encapsulates the logic for fetching the first subscription associated with a given tenant from the repository.
 */
export class GetFirstSubscriptionOfTenantUseCase {
  /**
   * Constructs a new instance of the GetFirstSubscriptionOfTenantUseCase.
   *
   * @param {ISubscriptionRepository} subscriptionRepository - The repository for managing subscriptions.
   * @param {ITenantRepository} tenantRepository - The repository for managing tenants.
   */
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private tenantRepository: ITenantRepository,
  ) {}

  /**
   * Executes the use case for retrieving the first subscription of a tenant.
   * This method first checks if the tenant exists, then attempts to find the first subscription associated with the tenant.
   * If a subscription is found, it is returned; otherwise, null is returned.
   *
   * @param {string} tenantId - The unique identifier of the tenant for whom to retrieve the first subscription.
   * @returns {Promise<Subscription | null>} A promise that resolves to the first Subscription entity found, or null if no subscription is found.
   */
  async execute(tenantId: string): Promise<Subscription | null> {
    const tenantExists = await this.tenantRepository.getById(tenantId)
    if (!tenantExists) {
      throw new Error('Tenant does not exist')
    }

    const subscription = await this.subscriptionRepository.findFirst({
      tenantId,
    } as SubscriptionFirstDTO)
    if (!subscription) {
      return null
    }

    return subscription
  }
}
