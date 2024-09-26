import { IPlanRepository } from '../../../interfaces/repositories/plan'
import { Plan } from '../../entities/Plan'

/**
 * Represents a use case for retrieving a list of plans.
 */
export class GetPlansUseCase {
  /**
   * Initializes the use case with a plan repository.
   * @param {IPlanRepository} planRepository - The plan repository to use for listing plans.
   */
  constructor(private planRepository: IPlanRepository) {}

  /**
   * Executes the use case to retrieve a list of plans.
   * @returns {Promise<Plan[]>} A promise that resolves to an array of Plan objects.
   */
  async execute(): Promise<Plan[]> {
    return this.planRepository.list()
  }
}
