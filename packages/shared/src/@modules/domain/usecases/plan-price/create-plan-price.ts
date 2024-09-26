import {
  IPlanPriceRepository,
  PlanPriceCreateDTO,
} from '../../../interfaces/repositories/plan-price'
import { PlanPrice } from '../../entities/PlanPrice'

/**
 * Represents the use case for creating a plan price.
 * This class encapsulates the logic for creating a plan price in the repository.
 */
export class CreatePlanPriceUseCase {
  /**
   * Constructs a new instance of the CreatePlanPriceUseCase.
   *
   * @param {IPlanPriceRepository} planPriceRepository - The repository for managing plan prices.
   */
  constructor(private planPriceRepository: IPlanPriceRepository) {}

  /**
   * Executes the use case for creating a plan price.
   *
   * @param {PlanPriceCreateDTO} planPriceDto - The data for creating the plan price.
   * @returns {Promise<PlanPrice>} A promise that resolves to the created PlanPrice entity.
   */
  async execute(planPriceDto: PlanPriceCreateDTO): Promise<PlanPrice> {
    const planPrice = await this.planPriceRepository.create(planPriceDto)
    return planPrice
  }
}
