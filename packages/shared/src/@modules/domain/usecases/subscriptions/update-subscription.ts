import {
  ISubscriptionRepository,
  SubscriptionUpdateDTO,
} from '../../../interfaces/repositories/subscription'
import { Subscription } from '../../entities/Subscription'

/**
 * Represents the use case for updating a subscription.
 * This class encapsulates the logic for updating a subscription in the repository.
 */
export class UpdateSubscriptionUseCase {
  /**
   * Constructs a new instance of the UpdateSubscriptionUseCase.
   *
   * @param {ISubscriptionRepository} subscriptionRepository - The repository for managing subscriptions.
   */
  constructor(private subscriptionRepository: ISubscriptionRepository) {}

  /**
   * Executes the use case for updating a subscription.
   * This method first checks if the subscription exists.
   * If it exists, it updates the subscription with the provided data; otherwise, it throws an error.
   *
   * @param {SubscriptionUpdateDTO} dto - The data for updating the subscription.
   * @returns {Promise<Subscription>} A promise that resolves to the updated Subscription entity.
   */
  async execute(dto: SubscriptionUpdateDTO): Promise<Subscription> {
    const subscriptionExists = await this.subscriptionRepository.findUnique({
      paymentProviderId: dto.paymentProviderId as string,
    })
    if (!subscriptionExists) {
      throw new Error('Subscription does not exist')
    }

    const updatedSubscription = await this.subscriptionRepository.update(dto)
    return updatedSubscription
  }
}
