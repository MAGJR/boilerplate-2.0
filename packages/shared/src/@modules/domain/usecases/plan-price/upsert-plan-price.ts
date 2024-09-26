import {
  IPlanPriceRepository,
  PlanPriceCreateDTO,
} from '../../../interfaces/repositories/plan-price'
import { PlanPrice } from '../../entities/PlanPrice'

/**
 * Represents the use case for upserting a plan price.
 * This class encapsulates the logic for upserting a plan price in the repository.
 */
export class UpsertPlanPriceUseCase {
  /**
   * Constructs a new instance of the UpsertPlanPriceUseCase.
   *
   * @param {IPlanPriceRepository} planPriceRepository - The repository for managing plan prices.
   */
  constructor(private planPriceRepository: IPlanPriceRepository) {}

  /**
   * Executes the use case for upserting a plan price.
   * This method checks if a plan price exists for the given payment provider ID.
   * If it exists, it updates the plan price; otherwise, it creates a new plan price.
   *
   * @param {PlanPriceCreateDTO} dto - The data for upserting the plan price.
   * @returns {Promise<PlanPrice>} A promise that resolves to the upserted PlanPrice entity.
   */
  async execute(dto: PlanPriceCreateDTO): Promise<PlanPrice> {
    const existingPlanPrice = await this.planPriceRepository.getByProviderId(
      dto.paymentProviderId,
    )

    if (existingPlanPrice) {
      const updatedPlanPrice = await this.planPriceRepository.update({
        id: existingPlanPrice.id,
        ...dto,
      })
      return updatedPlanPrice
    } else {
      const newPlanPrice = await this.planPriceRepository.create(dto)
      return newPlanPrice
    }
  }
}
