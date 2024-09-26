import {
  CreateMembershipDTO,
  IMembershipRepository,
} from '../../../interfaces/repositories/membership'
import { ITenantRepository } from '../../../interfaces/repositories/tenant'
import { IUserRepository } from '../../../interfaces/repositories/user'
import { Membership } from '../../entities/Membership'

/**
 * Represents the use case for creating a membership on a tenant.
 * This class encapsulates the logic for creating a membership, including verifying the existence of the tenant and user,
 * ensuring the membership does not already exist, and creating the membership.
 */
export class CreateMembershipOnTenantUseCase {
  /**
   * Constructs a new instance of the CreateMembershipOnTenantUseCase.
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
   * Executes the use case for creating a membership on a tenant.
   *
   * @param {CreateMembershipDTO} data - The data for creating the membership.
   * @returns {Promise<Membership>} A promise that resolves to the created Membership entity.
   */
  async execute({
    tenantId,
    userId,
    role,
  }: CreateMembershipDTO): Promise<Membership> {
    const tenant = await this.tenantRepository.getById(tenantId)
    if (!tenant) {
      throw new Error('Tenant not found')
    }

    const user = await this.userRepository.getById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const existingMembership =
      await this.membershipRepository.getByUserOnTenant(tenantId, userId)
    if (existingMembership) {
      throw new Error('Membership already exists')
    }

    const membership = await this.membershipRepository.create({
      tenantId,
      userId,
      role,
    })

    return membership
  }
}
