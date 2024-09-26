import { IPlanRepository } from '../../../interfaces/repositories/plan'
import { Plan } from '../../entities/Plan'

/**
 * Use case to get a plan by provider ID
 */
export class GetPlanByProviderIdUseCase {
  /**
   * Constructor for the use case
   * @param {IPlanRepository} planRepository - The plan repository
   */
  constructor(private planRepository: IPlanRepository) {}

  /**
   * Execute the use case
   * @param {string} planId - The ID of the plan
   * @returns {Promise<Plan | undefined>} - The plan or undefined if not found
   */
  async execute(planId: string): Promise<Plan | undefined> {
    const plan = await this.planRepository.findByProviderId(planId)
    return plan
  }
}
