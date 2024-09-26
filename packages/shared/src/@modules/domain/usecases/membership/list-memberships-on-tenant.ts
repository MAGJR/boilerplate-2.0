import { IMembershipRepository } from '../../../interfaces/repositories/membership'
import { ITenantRepository } from '../../../interfaces/repositories/tenant'
import { IUserRepository } from '../../../interfaces/repositories/user'
import { Membership } from '../../entities/Membership'

/**
 * Represents the use case for listing memberships on a tenant.
 * This class encapsulates the logic for listing memberships, including verifying the existence of the tenant,
 * user, and user's membership in the tenant.
 */
export class ListMembershipsOnTenantUseCase {
  /**
   * Constructs a new instance of the ListMembershipsOnTenantUseCase.
   *
   * @param {IMembershipRepository} membershipRepository - The repository for managing memberships.
   * @param {ITenantRepository} tenantRepository - The repository for managing tenants.
   * @param {IUserRepository} userRepository - The repository for managing users.
   */
  constructor(
    private readonly membershipRepository: IMembershipRepository,
    private readonly tenantRepository: ITenantRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * Executes the use case for listing memberships on a tenant.
   *
   * @param {{ tenantId: string; userId: string }} params - The parameters for the use case execution.
   * @param {string} params.tenantId - The unique identifier of the tenant.
   * @param {string} params.userId - The unique identifier of the user.
   * @returns {Promise<Membership[]>} A promise that resolves to an array of Membership entities.
   */
  async execute({
    tenantId,
    userId,
  }: {
    tenantId: string
    userId: string
  }): Promise<Membership[]> {
    const tenant = await this.tenantRepository.getById(tenantId)
    if (!tenant) {
      throw new Error('Tenant not found')
    }

    const user = await this.userRepository.getById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const existingMembership =
      await this.membershipRepository.getByUserOnTenant(userId, tenantId)
    if (!existingMembership) {
      throw new Error('User dont has a membership')
    }

    const memberships = await this.membershipRepository.list(tenantId)

    return memberships
  }
}
