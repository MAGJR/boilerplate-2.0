import { PrismaClient } from '@prisma/client'
import { PlanPrice } from '../../../domain/entities/PlanPrice'
import { CoreRepository } from '../../../interfaces/core/repository'
import {
  IPlanPriceRepository,
  PlanPriceCreateDTO,
  PlanPriceFindDTO,
  PlanPriceUpdateDTO,
} from '../../../interfaces/repositories/plan-price'

/**
 * Implements the IPlanPriceRepository interface to interact with the database for plan price operations.
 */
export class PrismaPlanPriceRepository
  extends CoreRepository<PlanPrice>
  implements IPlanPriceRepository
{
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  /**
   * Creates a new plan price in the database.
   * @param dto The data for the plan price to be created.
   * @returns A Promise that resolves to the created PlanPrice entity.
   */
  async create(dto: PlanPriceCreateDTO): Promise<PlanPrice> {
    const planPrice = await this.prisma.planPrice.create({
      data: dto,
    })

    return planPrice as PlanPrice
  }

  /**
   * Updates an existing plan price in the database.
   * @param dto The partial data for the plan price to be updated.
   * @returns A Promise that resolves to the updated PlanPrice entity.
   */
  async update(dto: PlanPriceUpdateDTO): Promise<PlanPrice> {
    const planPrice = await this.prisma.planPrice.update({
      where: { id: dto.id },
      data: dto,
    })
    return planPrice as PlanPrice
  }

  /**
   * Retrieves a unique plan price by its ID from the database.
   * @param dto The data for the plan price to be retrieved.
   * @returns A Promise that resolves to the PlanPrice entity if found, or null if not found.
   */
  async findUnique(dto: PlanPriceFindDTO): Promise<PlanPrice | null> {
    const planPrice = await this.prisma.planPrice.findUnique({
      where: { id: dto.id },
    })
    return planPrice as PlanPrice | null
  }

  /**
   * Retrieves a plan price by its ID from the database.
   * @param id The ID of the plan price to be retrieved.
   * @returns A Promise that resolves to the PlanPrice entity if found, or null if not found.
   */
  async getById(id: string): Promise<PlanPrice | null> {
    const planPrice = await this.prisma.planPrice.findUnique({
      where: { id },
    })
    return planPrice as PlanPrice | null
  }

  /**
   * Retrieves a plan price by its provider ID from the database.
   * @param providerId The ID of the provider for whom to retrieve the plan price.
   * @returns A Promise that resolves to the PlanPrice entity if found, or null if not found.
   */
  async getByProviderId(providerId: string): Promise<PlanPrice | null> {
    const planPrice = await this.prisma.planPrice.findFirst({
      where: { paymentProviderId: providerId },
    })
    return planPrice as PlanPrice | null
  }

  /**
   * Retrieves the free plan price from the database.
   * @returns A Promise that resolves to the PlanPrice entity if found, or null if not found.
   */
  async getFreePlanPrice(): Promise<PlanPrice | null> {
    const planPrice = await this.prisma.planPrice.findFirst({
      where: { price: 0, interval: 'month' },
    })
    return planPrice as PlanPrice | null
  }

  protected async toSave(
    data: Partial<PlanPrice>,
  ): Promise<Partial<PlanPrice>> {
    // Implement any necessary logic for saving PlanPrice data
    return data
  }

  protected toRead(model: any): PlanPrice {
    // Implement logic to convert database model to PlanPrice entity
    return model as PlanPrice
  }

  /**
   * Upserts a plan price in the database.
   * If a plan price with the given payment provider ID exists, it updates it.
   * Otherwise, it creates a new plan price.
   * @param dto The data for the plan price to be upserted.
   * @returns A Promise that resolves to the upserted PlanPrice entity.
   */
  async upsert(dto: PlanPriceCreateDTO): Promise<PlanPrice> {
    const existingPlanPrice = await this.getByProviderId(dto.paymentProviderId)

    if (existingPlanPrice) {
      const updatedPlanPrice = await this.prisma.planPrice.update({
        where: { id: existingPlanPrice.id },
        data: {
          active: dto.active,
          type: dto.type,
          price: dto.price,
          currency: dto.currency,
          interval: dto.interval,
          intervalCount: dto.intervalCount,
          trialPeriodDays: dto.trialPeriodDays,
          planId: dto.planId,
        },
      })
      return updatedPlanPrice as PlanPrice
    } else {
      const newPlanPrice = await this.prisma.planPrice.create({
        data: dto,
      })
      return newPlanPrice as PlanPrice
    }
  }
}
