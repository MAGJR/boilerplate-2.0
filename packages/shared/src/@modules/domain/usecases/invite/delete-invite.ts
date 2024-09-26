import { IInviteRepository } from '../../../interfaces/repositories/invite'
import { IMembershipRepository } from '../../../interfaces/repositories/membership'
import { ITenantRepository } from '../../../interfaces/repositories/tenant'
import { IUserRepository } from '../../../interfaces/repositories/user'

/**
 * Represents the use case for deleting an invite.
 * This class encapsulates the logic for deleting an invite, including verifying the existence of the tenant,
 * user, and invite, as well as ensuring the user has the necessary permissions to delete the invite.
 */
export class DeleteInvitesUseCase {
  /**
   * Constructs a new instance of the DeleteInvitesUseCase.
   *
   * @param {IInviteRepository} inviteRepository - The repository for managing invites.
   * @param {ITenantRepository} tenantRepository - The repository for managing tenants.
   * @param {IUserRepository} userRepository - The repository for managing users.
   * @param {IMembershipRepository} membershipRepository - The repository for managing memberships.
   */
  constructor(
    private readonly inviteRepository: IInviteRepository,
    private readonly tenantRepository: ITenantRepository,
    private readonly userRepository: IUserRepository,
    private readonly membershipRepository: IMembershipRepository,
  ) {}

  /**
   * Executes the use case for deleting an invite.
   *
   * @param {{ userId: string; tenantId: string; inviteId: string }} params - The parameters for the use case execution.
   * @param {string} params.userId - The unique identifier of the user deleting the invite.
   * @param {string} params.tenantId - The unique identifier of the tenant associated with the invite.
   * @param {string} params.inviteId - The unique identifier of the invite being deleted.
   * @returns {Promise<void>} A promise that resolves when the invite is successfully deleted.
   */
  async execute({
    userId,
    tenantId,
    inviteId,
  }: {
    userId: string
    tenantId: string
    inviteId: string
  }): Promise<void> {
    const tenantExists = await this.tenantRepository.getById(tenantId)
    if (!tenantExists) {
      throw new Error('Tenant does not exist')
    }

    const userExists = await this.userRepository.getById(userId)
    if (!userExists) {
      throw new Error('User does not exist')
    }

    const userMembership = await this.membershipRepository.getByUserOnTenant(
      userId,
      tenantId,
    )
    if (!userMembership || userMembership.role !== 'owner') {
      throw new Error('User does not have a membership')
    }

    const invite = await this.inviteRepository.getById(inviteId)

    if (!invite) {
      throw new Error('Invite not found')
    }

    await this.inviteRepository.delete(inviteId)
  }
}
