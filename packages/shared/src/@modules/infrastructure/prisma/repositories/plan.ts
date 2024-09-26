import { PrismaClient } from '@prisma/client'
import { Plan } from '../../../domain/entities/Plan'
import { CoreRepository } from '../../../interfaces/core/repository'
import {
  IPlanRepository,
  PlanUpsertDTO,
} from '../../../interfaces/repositories/plan'

/**
 * Implements the IPlanRepository interface to interact with the database for plan operations.
 * This class extends the CoreRepository to inherit common CRUD operations and adds specific methods for plan management.
 */
export class PrismaPlanRepository
  extends CoreRepository<Plan>
  implements IPlanRepository
{
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  /**
   * Upserts a plan in the database. If a plan with the given paymentProviderId exists, it updates the plan. Otherwise, it creates a new plan.
   * @param dto The data transfer object containing the plan details.
   * @returns A Promise that resolves to the upserted Plan entity.
   */
  async upsert(dto: PlanUpsertDTO): Promise<Plan> {
    const plan = await this.prisma.plan.upsert({
      where: { paymentProviderId: dto.paymentProviderId },
      update: {
        ...dto,
        metadata: dto.metadata as any,
      },
      create: {
        ...dto,
        metadata: dto.metadata as any,
      },
    })

    return this.toRead(plan)
  }

  /**
   * Finds a plan by its ID in the database.
   * @param planId The ID of the plan to find.
   * @returns A Promise that resolves to the Plan entity if found, or undefined if not found.
   */
  async findByPlanId(planId: string): Promise<Plan | undefined> {
    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
    })

    return plan ? this.toRead(plan) : undefined
  }

  /**
   * Finds a plan by its payment provider ID in the database.
   * @param providerId The payment provider ID of the plan to find.
   * @returns A Promise that resolves to the Plan entity if found, or undefined if not found.
   */
  async findByProviderId(providerId: string): Promise<Plan | undefined> {
    const plan = await this.prisma.plan.findFirst({
      where: { paymentProviderId: providerId },
    })

    return plan ? this.toRead(plan) : undefined
  }

  /**
   * Lists all plans from the database, including their prices.
   * @returns A Promise that resolves to an array of Plan entities.
   */
  async list(): Promise<Plan[]> {
    const plans = await this.prisma.plan.findMany({
      include: {
        prices: true,
      },
    })

    return plans.map((plan) => this.toRead(plan))
  }

  protected async toSave(data: Partial<Plan>): Promise<Partial<Plan>> {
    // Implement any necessary logic for saving Plan data
    return data
  }

  protected toRead(model: any): Plan {
    return {
      id: model.id,
      paymentProviderId: model.paymentProviderId,
      name: model.name,
      description: model.description,
      metadata: model.metadata,
      active: model.active,
      prices: model.prices
        ? model.prices.map(
            (price: {
              id: any
              price: any
              currency: any
              active: any
              interval: any
              intervalCount: any
              trialPeriodDays: any
              paymentProviderId: any
              planId: any
            }) => ({
              id: price.id,
              price: price.price,
              currency: price.currency,
              active: price.active,
              interval: price.interval,
              intervalCount: price.intervalCount,
              trialPeriodDays: price.trialPeriodDays,
              planId: price.planId,
              paymentProviderId: price.paymentProviderId,
            }),
          )
        : [],
    }
  }

  async findByPriceId(priceId: string): Promise<Plan | undefined> {
    const plan = await this.prisma.plan.findFirst({
      where: { prices: { some: { id: priceId } } },
    })

    return plan ? this.toRead(plan) : undefined
  }

  async findByProviderPriceId(
    providerPriceId: string,
  ): Promise<Plan | undefined> {
    const plan = await this.prisma.plan.findFirst({
      where: { prices: { some: { paymentProviderId: providerPriceId } } },
    })

    return plan ? this.toRead(plan) : undefined
  }
}
