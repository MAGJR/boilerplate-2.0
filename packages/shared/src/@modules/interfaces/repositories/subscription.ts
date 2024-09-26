import { Subscription } from '../../domain/entities/Subscription'
import { CoreRepository } from '../core/repository'

/**
 * Represents a unique subscription identifier.
 */
export interface SubscriptionUniqueDTO {
  paymentProviderId: string
}

/**
 * Represents the data required to update a subscription.
 */
export interface SubscriptionUpdateDTO {
  paymentProviderId?: string
  status?: string
  cancelAtPeriodEnd?: boolean
  cancelAt?: Date
  canceledAt?: Date
  currentPeriodStart?: Date
  currentPeriodEnd?: Date
  endedAt?: Date
  trialStart?: Date
  trialEnd?: Date
  createdAt?: Date
  priceId?: string
}

/**
 * Represents the data required to find the first subscription.
 */
export interface SubscriptionFirstDTO {
  tenantId: string
}

/**
 * Represents the data required to create a new subscription.
 * Extends SubscriptionUpdateDTO to include tenantId, status, and priceId.
 */
export interface SubscriptionCreateDTO extends SubscriptionUpdateDTO {
  tenantId: string
  status: string
  priceId: string
}

/**
 * Defines the interface for the SubscriptionRepository.
 */
export interface ISubscriptionRepository extends CoreRepository<Subscription> {
  /**
   * Finds a unique subscription based on the provided DTO.
   * @param dto The SubscriptionUniqueDTO containing the paymentProviderId.
   * @returns A Promise that resolves to the found Subscription or null if not found.
   */
  findUnique(dto: SubscriptionUniqueDTO): Promise<Subscription>

  /**
   * Updates a subscription with the provided DTO.
   * @param dto The SubscriptionUpdateDTO containing the update details.
   * @returns A Promise that resolves to the updated Subscription.
   */
  update(dto: SubscriptionUpdateDTO): Promise<Subscription>

  /**
   * Finds the first subscription based on the provided DTO.
   * @param dto The SubscriptionFirstDTO containing the tenantId.
   * @returns A Promise that resolves to the found Subscription or null if not found.
   */
  findFirst(dto: SubscriptionFirstDTO): Promise<Subscription | null>

  /**
   * Creates a new subscription based on the provided DTO.
   * @param dto The SubscriptionCreateDTO containing the creation details.
   * @returns A Promise that resolves to the created Subscription.
   */
  create(dto: SubscriptionCreateDTO): Promise<Subscription>
}
