import { IInviteRepository } from '../../../interfaces/repositories/invite'
import { IMembershipRepository } from '../../../interfaces/repositories/membership'
import { ITenantRepository } from '../../../interfaces/repositories/tenant'
import { IUserRepository } from '../../../interfaces/repositories/user'
import { Invite } from '../../entities/Invite'

/**
 * Represents the use case for listing invites.
 * This class encapsulates the logic for listing invites, including verifying the existence of the tenant,
 * user, and user's membership in the tenant.
 */
export class ListInvitesUseCase {
  /**
   * Constructs a new instance of the ListInvitesUseCase.
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
   * Executes the use case for listing invites.
   *
   * @param {{ userId: string; tenantId: string }} params - The parameters for the use case execution.
   * @param {string} params.userId - The unique identifier of the user.
   * @param {string} params.tenantId - The unique identifier of the tenant.
   * @returns {Promise<Invite[]>} A promise that resolves to an array of Invite entities.
   */
  async execute({
    userId,
    tenantId,
  }: {
    userId: string
    tenantId: string
  }): Promise<Invite[]> {
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
    if (!userMembership) {
      throw new Error('User dont has a membership')
    }

    const invites = await this.inviteRepository.list(tenantId)

    return invites
  }
}
