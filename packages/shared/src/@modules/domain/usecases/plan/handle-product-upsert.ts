import Stripe from 'stripe'
import { IPlanRepository } from '../../../interfaces/repositories/plan'

/**
 * Represents the use case for handling product upsert operations.
 * This class is responsible for upserting a product in the database based on the provided Stripe product data.
 */
export class HandleProductUpsertUseCase {
  /**
   * Initializes the use case with the necessary plan repository.
   * @param {IPlanRepository} planRepository - The repository for managing plans.
   */
  constructor(private planRepository: IPlanRepository) {}

  /**
   * Executes the upsert operation for a given Stripe product.
   * This method upserts a product in the database based on the provided Stripe product data.
   * @param {Stripe.Product} data - The Stripe product data.
   * @returns {Promise<void>} A promise that resolves when the upsert operation is complete.
   */
  async execute(data: Stripe.Product): Promise<void> {
    await this.planRepository.upsert({
      paymentProviderId: data.id,
      active: data.active as boolean,
      name: data.name,
      description: data.description || '',
      metadata: data.metadata,
    })
  }
}
