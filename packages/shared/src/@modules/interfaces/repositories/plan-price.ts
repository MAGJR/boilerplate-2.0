import { PlanPrice } from '../../domain/entities/PlanPrice'
import { CoreRepository } from '../core/repository'

/**
 * Represents the data transfer object for creating a plan price.
 * This interface defines the structure of the data required to create a new plan price.
 */
export interface PlanPriceCreateDTO {
  /**
   * The unique identifier of the payment provider.
   */
  paymentProviderId: string
  /**
   * The unique identifier of the plan.
   */
  planId: string
  /**
   * Indicates if the plan price is active.
   */
  active: boolean
  /**
   * The type of the plan price, either 'one_time' or 'recurring'.
   */
  type: 'one_time' | 'recurring'
  /**
   * The price of the plan.
   */
  price: number
  /**
   * The currency of the plan price.
   */
  currency: string
  /**
   * The interval at which the plan price is charged, can be 'day', 'week', 'month', or 'year'.
   */
  interval: 'day' | 'week' | 'month' | 'year'
  /**
   * The count of the interval at which the plan price is charged.
   */
  intervalCount: number
  /**
   * The number of days in the trial period, optional.
   */
  trialPeriodDays?: number
}

/**
 * Represents the data transfer object for updating a plan price.
 * This interface defines the structure of the data required to update an existing plan price.
 */
export interface PlanPriceUpdateDTO {
  /**
   * The unique identifier of the plan price to be updated.
   */
  id: string
  /**
   * Indicates if the plan price is active, optional.
   */
  active?: boolean
  /**
   * The price of the plan, optional.
   */
  price?: number
  /**
   * The count of the interval at which the plan price is charged, optional.
   */
  intervalCount?: number
  /**
   * The number of days in the trial period, optional.
   */
  trialPeriodDays?: number
}

/**
 * Represents the data transfer object for finding a plan price.
 * This interface defines the structure of the data required to find a plan price.
 */
export interface PlanPriceFindDTO {
  /**
   * The unique identifier of the plan price to be found.
   */
  id: string
}

/**
 * Represents the repository for managing plan prices.
 * This interface defines the methods for CRUD operations on plan prices.
 */
export interface IPlanPriceRepository extends CoreRepository<PlanPrice> {
  /**
   * Creates a new plan price.
   * @param {PlanPriceCreateDTO} dto - The data required to create a new plan price.
   * @returns {Promise<PlanPrice>} A promise that resolves to the created PlanPrice object.
   */
  create(dto: PlanPriceCreateDTO): Promise<PlanPrice>
  /**
   * Updates an existing plan price.
   * @param {PlanPriceUpdateDTO} dto - The data required to update an existing plan price.
   * @returns {Promise<PlanPrice>} A promise that resolves to the updated PlanPrice object.
   */
  update(dto: PlanPriceUpdateDTO): Promise<PlanPrice>
  /**
   * Retrieves a plan price by its ID.
   * @param {string} id - The unique identifier of the plan price to be retrieved.
   * @returns {Promise<PlanPrice | null>} A promise that resolves to the PlanPrice object or null if not found.
   */
  getById(id: string): Promise<PlanPrice | null>
  /**
   * Retrieves a plan price by its payment provider ID.
   * @param {string} providerId - The unique identifier of the payment provider.
   * @returns {Promise<PlanPrice | null>} A promise that resolves to the PlanPrice object or null if not found.
   */
  getByProviderId(providerId: string): Promise<PlanPrice | null>
  /**
   * Retrieves the free plan price.
   * @returns {Promise<PlanPrice | null>} A promise that resolves to the PlanPrice object or null if not found.
   */
  getFreePlanPrice(): Promise<PlanPrice | null>
  /**
   * Upserts a plan price.
   * If a plan price with the given payment provider ID exists, it updates it.
   * Otherwise, it creates a new plan price.
   * @param {PlanPriceCreateDTO} dto - The data for upserting the plan price.
   * @returns {Promise<PlanPrice>} A promise that resolves to the upserted PlanPrice object.
   */
  upsert(dto: PlanPriceCreateDTO): Promise<PlanPrice>
}
