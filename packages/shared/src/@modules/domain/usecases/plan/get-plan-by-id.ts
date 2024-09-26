import { IPlanRepository } from '../../../interfaces/repositories/plan'
import { Plan } from '../../entities/Plan'

/**
 * Represents the use case for retrieving a plan by its identifier.
 * This class encapsulates the logic for fetching a plan from the repository based on its unique identifier.
 */
export class GetPlanByIdUseCase {
  /**
   * Constructs a new instance of the GetPlanByIdUseCase.
   *
   * @param {IPlanRepository} planRepository - The repository for managing plans.
   */
  constructor(private planRepository: IPlanRepository) {}

  /**
   * Executes the use case for retrieving a plan by its identifier.
   *
   * @param {string} planId - The unique identifier of the plan to be retrieved.
   * @returns {Promise<Plan | undefined>} A promise that resolves to the Plan entity if found, or undefined if not found.
   */
  async execute(planId: string): Promise<Plan | undefined> {
    const plan = await this.planRepository.findByPlanId(planId)
    return plan
  }
}
