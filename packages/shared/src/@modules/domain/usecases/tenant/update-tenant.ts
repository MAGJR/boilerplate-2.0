/**
 * Import necessary modules and interfaces for the UpdateTenantUseCase.
 */
import { IMembershipRepository } from '../../../interfaces/repositories/membership'
import {
  ITenantRepository,
  UpdateTenantDTO,
} from '../../../interfaces/repositories/tenant'
import { IUserRepository } from '../../../interfaces/repositories/user'
import { Tenant } from '../../entities/Tenant'

/**
 * UpdateTenantUseCase is a class that handles the business logic for updating a tenant.
 * It interacts with the tenant, user, and membership repositories to validate and update tenant information.
 */
export class UpdateTenantUseCase {
  /**
   * Constructor for UpdateTenantUseCase.
   * @param {IUserRepository} useRepository - The user repository for user operations.
   * @param {ITenantRepository} tenantRepository - The tenant repository for tenant operations.
   * @param {IMembershipRepository} membershipRepository - The membership repository for membership operations.
   */
  constructor(
    private readonly useRepository: IUserRepository,
    private readonly tenantRepository: ITenantRepository,
    private readonly membershipRepository: IMembershipRepository,
  ) {}

  /**
   * Executes the update tenant operation.
   * @param {string} userId - The ID of the user performing the update.
   * @param {string} tenantId - The ID of the tenant to be updated.
   * @param {Omit<UpdateTenantDTO, 'slug'>} data - The update data for the tenant.
   * @returns {Promise<Tenant>} - A promise that resolves to the updated tenant.
   */
  async execute(
    userId: string,
    tenantId: string,
    data: Omit<UpdateTenantDTO, 'slug'>,
  ): Promise<Tenant> {
    /**
     * Check if the tenant exists.
     */
    const tenantAlreadyExists = await this.tenantRepository.getById(tenantId)
    if (!tenantAlreadyExists) {
      throw new Error('Tenant not exists')
    }

    /**
     * Check if the user exists.
     */
    const userExists = await this.useRepository.getById(userId)
    if (!userExists) {
      throw new Error('User does not exist')
    }

    /**
     * Check if the user has a membership on the tenant.
     */
    const membership = await this.membershipRepository.getByUserOnTenant(
      userId,
      tenantId,
    )

    if (!membership) {
      throw new Error('Tenant not exists')
    }

    /**
     * Update the tenant with the provided data.
     */
    const tenant = await this.tenantRepository.update(tenantId, {
      name: data.name,
      logo: data.logo,
      settings: data.settings,
      paymentProviderId: data.paymentProviderId,
    })

    return tenant
  }
}
