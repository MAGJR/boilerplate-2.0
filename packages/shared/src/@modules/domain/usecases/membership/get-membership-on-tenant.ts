import { IMembershipRepository } from '../../../interfaces/repositories/membership'
import { ITenantRepository } from '../../../interfaces/repositories/tenant'
import { IUserRepository } from '../../../interfaces/repositories/user'
import { Membership } from '../../entities/Membership'

/**
 * Represents the use case for retrieving a membership on a tenant.
 * This class encapsulates the logic for fetching a membership from the repository based on the user and tenant IDs.
 */
export class GetMembershipOnTenantUseCase {
  /**
   * The repository responsible for managing memberships.
   */
  private membershipRepository: IMembershipRepository

  /**
   * The repository responsible for managing tenants.
   */
  private tenantRepository: ITenantRepository

  /**
   * The repository responsible for managing users.
   */
  private userRepository: IUserRepository

  /**
   * Constructs a new instance of the GetMembershipOnTenantUseCase.
   *
   * @param {IMembershipRepository} membershipRepository - The repository for managing memberships.
   * @param {ITenantRepository} tenantRepository - The repository for managing tenants.
   * @param {IUserRepository} userRepository - The repository for managing users.
   */
  constructor(
    membershipRepository: IMembershipRepository,
    tenantRepository: ITenantRepository,
    userRepository: IUserRepository,
  ) {
    this.membershipRepository = membershipRepository
    this.tenantRepository = tenantRepository
    this.userRepository = userRepository
  }

  /**
   * Executes the use case for retrieving a membership on a tenant.
   *
   * @param {string} tenantId - The unique identifier of the tenant.
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<Membership | null>} A promise that resolves to the Membership entity if found, or null if not found.
   */
  async execute(tenantId: string, userId: string): Promise<Membership | null> {
    const tenant = await this.tenantRepository.getById(tenantId)
    if (!tenant) {
      throw new Error('Tenant does not exist')
    }

    const user = await this.userRepository.getById(userId)
    if (!user) {
      throw new Error('User does not exist')
    }

    const membership = await this.membershipRepository.getByUserOnTenant(
      userId,
      tenantId,
    )
    if (!membership) {
      return null
    }

    return membership
  }
}
