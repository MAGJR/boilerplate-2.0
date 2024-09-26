import { PrismaClient } from '@prisma/client'
import { Subscription } from '../../../domain/entities/Subscription'
import { CoreRepository } from '../../../interfaces/core/repository'
import {
  ISubscriptionRepository,
  SubscriptionCreateDTO,
  SubscriptionFirstDTO,
  SubscriptionUniqueDTO,
  SubscriptionUpdateDTO,
} from '../../../interfaces/repositories/subscription'

/**
 * Implements the ISubscriptionRepository interface to interact with the database for subscription operations.
 */
export class PrismaSubscriptionRepository
  extends CoreRepository<Subscription>
  implements ISubscriptionRepository
{
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  /**
   * Retrieves a unique subscription by its payment provider ID from the database.
   * @param dto The data for the subscription to be retrieved.
   * @returns A Promise that resolves to the Subscription entity if found, or throws an error if not found.
   */
  async findUnique(dto: SubscriptionUniqueDTO): Promise<Subscription> {
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        paymentProviderId: dto.paymentProviderId,
      },
    })

    if (!subscription) {
      throw new Error('Subscription not found')
    }

    return subscription as Subscription
  }

  /**
   * Updates an existing subscription in the database.
   * @param dto The partial data for the subscription to be updated.
   * @returns A Promise that resolves to the updated Subscription entity.
   */
  async update(dto: SubscriptionUpdateDTO): Promise<Subscription> {
    const subscription = await this.prisma.subscription.update({
      where: {
        paymentProviderId: dto.paymentProviderId,
      },
      data: dto,
    })

    return subscription as Subscription
  }

  /**
   * Retrieves the first subscription for a given tenant from the database.
   * @param dto The data for the subscription to be retrieved.
   * @returns A Promise that resolves to the Subscription entity if found, or null if not found.
   */
  async findFirst(dto: SubscriptionFirstDTO): Promise<Subscription | null> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        tenantId: dto.tenantId,
      },
    })

    return subscription as Subscription | null
  }

  /**
   * Creates a new subscription in the database.
   * @param dto The data for the subscription to be created.
   * @returns A Promise that resolves to the created Subscription entity.
   */
  async create(dto: SubscriptionCreateDTO): Promise<Subscription> {
    const subscription = await this.prisma.subscription.create({
      data: dto,
    })

    return subscription as Subscription
  }

  protected async toSave(
    data: Partial<Subscription>,
  ): Promise<Partial<Subscription>> {
    // Implement any necessary logic for saving Subscription data
    return data
  }

  protected toRead(model: any): Subscription {
    // Implement logic to convert database model to Subscription entity
    return model as Subscription
  }
}
