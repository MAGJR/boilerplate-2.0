import { IMembershipRepository } from '../../../interfaces/repositories/membership'
import { ITenantRepository } from '../../../interfaces/repositories/tenant'
import { IUserRepository } from '../../../interfaces/repositories/user'

/**
 * Represents the use case for deleting a membership on a tenant.
 * This class encapsulates the logic for deleting a membership, including verifying the existence of the tenant,
 * user, and membership, as well as ensuring the user has the necessary permissions to delete the membership.
 */
export class DeleteMembershipOnTenantUseCase {
  /**
   * Constructs a new instance of the DeleteMembershipOnTenantUseCase.
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
   * Executes the use case for deleting a membership on a tenant.
   *
   * @param {{ currentUserId: string; currentTenantId: string; membershipToDeleteId: string }} params - The parameters for the use case execution.
   * @param {string} params.currentUserId - The unique identifier of the current user.
   * @param {string} params.currentTenantId - The unique identifier of the current tenant.
   * @param {string} params.membershipToDeleteId - The unique identifier of the membership to be deleted.
   * @returns {Promise<void>} A promise that resolves when the membership has been successfully deleted.
   */
  async execute({
    currentTenantId,
    currentUserId,
    membershipToDeleteId,
  }: {
    currentUserId: string
    currentTenantId: string
    membershipToDeleteId: string
  }): Promise<void> {
    const tenantExists = await this.tenantRepository.getById(currentTenantId)
    if (!tenantExists) {
      throw new Error('Tenant does not exist')
    }

    const userExists = await this.userRepository.getById(currentUserId)
    if (!userExists) {
      throw new Error('User does not exist')
    }

    const currentUserMembership =
      await this.membershipRepository.getByUserOnTenant(
        currentUserId,
        currentTenantId,
      )

    if (!currentUserMembership || currentUserMembership.role !== 'owner') {
      throw new Error('Current user is not an owner')
    }

    const membershipToDelete =
      await this.membershipRepository.getById(membershipToDeleteId)

    if (!membershipToDelete) {
      throw new Error('Membership not found')
    }

    await this.membershipRepository.delete(membershipToDeleteId)
  }
}
