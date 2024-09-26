import { Plan } from '../../domain/entities/Plan'
import { CoreRepository } from '../core/repository'

/**
 * Represents the data transfer object for upserting a plan.
 * This interface defines the structure of the data required to create or update a plan.
 */
export interface PlanUpsertDTO {
  /**
   * The unique identifier of the payment provider.
   */
  paymentProviderId: string
  /**
   * The name of the plan.
   */
  name: string
  /**
   * A description of the plan.
   */
  description: string
  /**
   * Indicates if the plan is active.
   */
  active: boolean
  /**
   * Additional metadata for the plan.
   */
  metadata: Record<string, unknown>
}

/**
 * Represents the repository for managing plans.
 * This interface defines the methods for CRUD operations on plans.
 * @extends CoreRepository<Plan>
 */
export interface IPlanRepository extends CoreRepository<Plan> {
  /**
   * Upserts a plan.
   * This method creates or updates a plan based on the provided data transfer object.
   * @param {PlanUpsertDTO} dto - The data transfer object containing the plan's details.
   * @returns {Promise<Plan>} A promise that resolves to the upserted Plan object.
   */
  upsert(dto: PlanUpsertDTO): Promise<Plan>

  /**
   * Finds a plan by its ID.
   * This method retrieves a plan by its unique identifier.
   * @param {string} planId - The unique identifier of the plan to be found.
   * @returns {Promise<Plan | undefined>} A promise that resolves to the Plan object or undefined if not found.
   */
  findByPlanId(planId: string): Promise<Plan | undefined>

  /**
   * Finds a plan by its provider ID.
   * This method retrieves a plan by its associated payment provider's unique identifier.
   * @param {string} providerId - The unique identifier of the payment provider.
   * @returns {Promise<Plan | undefined>} A promise that resolves to the Plan object or undefined if not found.
   */
  findByProviderId(providerId: string): Promise<Plan | undefined>

  /**
   * Lists all plans.
   * This method retrieves a list of all plans.
   * @returns {Promise<Plan[]>} A promise that resolves to an array of Plan objects.
   */
  list(): Promise<Plan[]>

  /**
   * Finds a plan by its price ID.
   * This method retrieves a plan associated with a specific price identifier.
   * @param {string} priceId - The unique identifier of the price associated with the plan.
   * @returns {Promise<Plan | undefined>} A promise that resolves to the Plan object or undefined if not found.
   */
  findByPriceId(priceId: string): Promise<Plan | undefined>

  /**
   * Finds a plan by its provider price ID.
   * This method retrieves a plan associated with a specific provider price identifier.
   * @param {string} providerPriceId - The unique identifier of the provider price associated with the plan.
   * @returns {Promise<Plan | undefined>} A promise that resolves to the Plan object or undefined if not found.
   */
  findByProviderPriceId(providerPriceId: string): Promise<Plan | undefined>
}
