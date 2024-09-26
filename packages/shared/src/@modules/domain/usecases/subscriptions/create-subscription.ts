import { IPlanPriceRepository } from '../../../interfaces/repositories/plan-price'
import {
  ISubscriptionRepository,
  SubscriptionCreateDTO,
} from '../../../interfaces/repositories/subscription'
import { ITenantRepository } from '../../../interfaces/repositories/tenant'
import { Subscription } from '../../entities/Subscription'

/**
 * Represents the use case for creating a subscription.
 * This class encapsulates the logic for creating a subscription in the repository.
 */
export class CreateSubscriptionUseCase {
  /**
   * Constructs a new instance of the CreateSubscriptionUseCase.
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
   * Executes the use case for creating a subscription.
   * This method checks if the tenant and plan price exist before creating a new subscription.
   *
   * @param {SubscriptionCreateDTO} dto - The data for creating the subscription.
   * @returns {Promise<Subscription>} A promise that resolves to the created Subscription entity.
   */
  async execute(dto: SubscriptionCreateDTO): Promise<Subscription> {
    const tenantExists = await this.tenantRepository.getById(dto.tenantId)
    if (!tenantExists) {
      throw new Error('Tenant does not exist')
    }

    const planPriceExists = await this.planPriceRepository.getById(
      dto.priceId as string,
    )
    if (!planPriceExists) {
      throw new Error('Plan price does not exist')
    }

    const subscription = await this.subscriptionRepository.create(dto)
    return subscription
  }
}
