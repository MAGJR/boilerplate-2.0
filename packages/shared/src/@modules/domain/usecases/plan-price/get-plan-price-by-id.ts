import { IPlanPriceRepository } from '../../../interfaces/repositories/plan-price'
import { PlanPrice } from '../../entities/PlanPrice'

/**
 * Represents the use case for retrieving a plan price by its identifier.
 * This class encapsulates the logic for fetching a plan price from the repository based on its unique identifier.
 */
export class GetPlanPriceByIdUseCase {
  /**
   * Constructs a new instance of the GetPlanPriceByIdUseCase.
   *
   * @param {IPlanPriceRepository} planPriceRepository - The repository for managing plan prices.
   */
  constructor(private planPriceRepository: IPlanPriceRepository) {}

  /**
   * Executes the use case for retrieving a plan price by its identifier.
   *
   * @param {string} planPriceId - The unique identifier of the plan price to be retrieved.
   * @returns {Promise<PlanPrice | null>} A promise that resolves to the PlanPrice entity if found, or null if not found.
   */
  async execute(planPriceId: string): Promise<PlanPrice | null> {
    const planPrice = await this.planPriceRepository.getById(planPriceId)
    if (!planPrice) {
      throw new Error('Plan price does not exist')
    }

    return planPrice
  }
}
