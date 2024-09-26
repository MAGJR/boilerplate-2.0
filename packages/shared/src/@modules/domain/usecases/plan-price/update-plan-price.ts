import {
  IPlanPriceRepository,
  PlanPriceUpdateDTO,
} from '../../../interfaces/repositories/plan-price'
import { PlanPrice } from '../../entities/PlanPrice'

/**
 * Represents the use case for updating a plan price.
 * This class encapsulates the logic for updating a plan price in the repository.
 */
export class UpdatePlanPriceUseCase {
  /**
   * Constructs a new instance of the UpdatePlanPriceUseCase.
   *
   * @param {IPlanPriceRepository} planPriceRepository - The repository for managing plan prices.
   */
  constructor(private planPriceRepository: IPlanPriceRepository) {}

  /**
   * Executes the use case for updating a plan price.
   *
   * @param {PlanPriceUpdateDTO} planPriceDto - The data for updating the plan price.
   * @returns {Promise<PlanPrice>} A promise that resolves to the updated PlanPrice entity.
   */
  async execute(planPriceDto: PlanPriceUpdateDTO): Promise<PlanPrice> {
    const planPriceExists = await this.planPriceRepository.getById(
      planPriceDto.id,
    )
    if (!planPriceExists) {
      throw new Error('Plan price does not exist')
    }

    const updatedPlanPrice = await this.planPriceRepository.update(planPriceDto)
    return updatedPlanPrice
  }
}
