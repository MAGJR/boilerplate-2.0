import {
  ISubscriptionRepository,
  SubscriptionUniqueDTO,
} from '../../../interfaces/repositories/subscription'
import { Subscription } from '../../entities/Subscription'

/**
 * Represents the use case for retrieving a subscription by provider ID.
 * This class encapsulates the logic for fetching a subscription associated with a given provider ID from the repository.
 */
export class GetSubscriptionByProviderIdUseCase {
  /**
   * Constructs a new instance of the GetSubscriptionByProviderIdUseCase.
   *
   * @param {ISubscriptionRepository} subscriptionRepository - The repository for managing subscriptions.
   */
  constructor(private subscriptionRepository: ISubscriptionRepository) {}

  /**
   * Executes the use case for retrieving a subscription by provider ID.
   * This method first checks if the subscription exists.
   * If it exists, it returns the subscription; otherwise, it throws an error.
   *
   * @param {string} providerId - The unique identifier of the provider.
   * @returns {Promise<Subscription>} A promise that resolves to the fetched Subscription entity.
   */
  async execute(providerId: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findUnique({
      paymentProviderId: providerId,
    } as SubscriptionUniqueDTO)
    if (!subscription) {
      throw new Error('Subscription does not exist')
    }

    return subscription
  }
}
