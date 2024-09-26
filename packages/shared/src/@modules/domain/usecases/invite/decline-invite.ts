import { IInviteRepository } from '../../../interfaces/repositories/invite'
import { ITenantRepository } from '../../../interfaces/repositories/tenant'
import { IUserRepository } from '../../../interfaces/repositories/user'

/**
 * Represents the use case for declining an invite.
 * This class encapsulates the logic for declining an invite, including updating the invite status,
 * verifying the existence of the tenant and user, ensuring the invite has not already been accepted,
 * and deleting the invite.
 */
export class DeclineInviteUseCase {
  /**
   * Constructs a new instance of the DeclineInviteUseCase.
   *
   * @param {IInviteRepository} inviteRepository - The repository for managing invites.
   * @param {IUserRepository} userRepository - The repository for managing users.
   * @param {ITenantRepository} tenantRepository - The repository for managing tenants.
   */
  constructor(
    private readonly inviteRepository: IInviteRepository,
    private readonly userRepository: IUserRepository,
    private readonly tenantRepository: ITenantRepository,
  ) {}

  /**
   * Executes the use case for declining an invite.
   *
   * @param {{ userId: string; inviteId: string }} params - The parameters for the use case execution.
   * @returns {Promise<void>} A promise that resolves when the invite has been declined.
   */
  async execute({
    userId,
    inviteId,
  }: {
    userId: string
    inviteId: string
  }): Promise<void> {
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

    if (invite.acceptedAt) {
      throw new Error('Invite already accepted')
    }

    await this.inviteRepository.delete(inviteId)
  }
}
