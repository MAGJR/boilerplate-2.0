import { IInviteRepository } from '../../../interfaces/repositories/invite'
import { IMembershipRepository } from '../../../interfaces/repositories/membership'
import { ITenantRepository } from '../../../interfaces/repositories/tenant'
import { IUserRepository } from '../../../interfaces/repositories/user'
import { Invite } from '../../entities/Invite'

/**
 * Represents the use case for accepting an invite.
 * This class encapsulates the logic for accepting an invite, including updating the invite status,
 * verifying the existence of the tenant and user, ensuring the user does not already have a membership,
 * and creating a new membership for the user in the tenant.
 */
export class AcceptInviteUseCase {
  /**
   * Constructs a new instance of the AcceptInviteUseCase.
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
   * Executes the use case for accepting an invite.
   *
   * @param {{ userId: string; inviteId: string }} params - The parameters for the use case execution.
   * @param {string} params.userId - The unique identifier of the user accepting the invite.
   * @param {string} params.inviteId - The unique identifier of the invite being accepted.
   * @returns {Promise<Invite>} A promise that resolves to the updated invite entity.
   */
  async execute({
    userId,
    inviteId,
  }: {
    userId: string
    inviteId: string
  }): Promise<Invite> {
    const invite = await this.inviteRepository.update(inviteId, {
      acceptedAt: new Date(),
    })
    if (!invite) {
      throw new Error('Invite not found or already accepted')
    }

    const tenantExists = await this.tenantRepository.getById(invite.tenantId)
    if (!tenantExists) {
      throw new Error('Tenant does not exist')
    }

    const userExists = await this.userRepository.getById(userId)
    if (!userExists) {
      throw new Error('User does not exist')
    }

    const userMembership = await this.membershipRepository.getByUserOnTenant(
      userId,
      tenantExists.id,
    )
    if (userMembership) {
      throw new Error('User already has a membership in this tenant')
    }

    if (userExists.email !== invite.email) {
      throw new Error('User email does not match invite email')
    }

    await this.membershipRepository.create({
      tenantId: tenantExists.id,
      userId,
      role: invite.role,
    })

    return invite
  }
}
