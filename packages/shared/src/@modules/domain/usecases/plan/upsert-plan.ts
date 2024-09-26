import {
  IPlanRepository,
  PlanUpsertDTO,
} from '../../../interfaces/repositories/plan'
import { Plan } from '../../entities/Plan'

/**
 * Represents the use case for upserting a plan.
 * This class encapsulates the logic for upserting a plan in the repository.
 */
export class UpsertPlanUseCase {
  /**
   * Constructs a new instance of the UpsertPlanUseCase.
   *
   * @param {IPlanRepository} planRepository - The repository for managing plans.
   */
  constructor(private planRepository: IPlanRepository) {}

  /**
   * Executes the use case for upserting a plan.
   *
   * @param {PlanUpsertDTO} planDto - The data for upserting the plan.
   * @returns {Promise<Plan>} A promise that resolves to the upserted Plan entity.
   */
  async execute(planDto: PlanUpsertDTO): Promise<Plan> {
    const plan = await this.planRepository.upsert(planDto)
    return plan
  }
}
