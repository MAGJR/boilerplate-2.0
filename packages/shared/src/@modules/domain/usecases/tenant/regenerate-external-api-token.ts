import { NodeUUIDProvider } from '../../../infrastructure/uuid/node-uuid';
import { IMembershipRepository } from '../../../interfaces/repositories/membership';
import { ITenantRepository } from '../../../interfaces/repositories/tenant';
import { IUserRepository } from '../../../interfaces/repositories/user';

/**
 * Represents the use case for regenerating an external API token for a tenant.
 * This class encapsulates the logic for regenerating the external API token of a tenant.
 */
export class RegenerateExternalApiToken {
  /**
   * Constructs a new instance of the RegenerateExternalApiToken.
   *
   * @param {IUserRepository} userRepository - The repository for managing users.
   * @param {ITenantRepository} tenantRepository - The repository for managing tenants.
   * @param {IMembershipRepository} membershipRepository - The repository for managing memberships.
   */
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tenantRepository: ITenantRepository,
    private readonly membershipRepository: IMembershipRepository,
  ) {}

  /**
   * Executes the use case for regenerating an external API token.
   * This method first checks if the tenant and user exist, then regenerates the external API token for the tenant.
   * It updates the tenant's settings with the new token and returns the token.
   *
   * @param {string} userId - The unique identifier of the user.
   * @param {string} tenantId - The unique identifier of the tenant.
   * @returns {Promise<{ privateToken: string; publicToken: string }>} A promise that resolves to the new external API token.
   */
  async execute(
    userId: string,
    tenantId: string,
  ): Promise<{ privateToken: string; publicToken: string }> {
    const tenantAlreadyExists = await this.tenantRepository.getById(tenantId)
    if (!tenantAlreadyExists) {
      throw new Error('Tenant not exists')
    }

    const userExists = await this.userRepository.getById(userId)
    if (!userExists) {
      throw new Error('User does not exist')
    }

    const membership = await this.membershipRepository.getByUserOnTenant(
      userId,
      tenantId,
    )

    if (!membership) {
      throw new Error('Tenant not exists')
    }

    const newTokens = {
      privateToken: NodeUUIDProvider.generate(),
      publicToken: NodeUUIDProvider.generate(),
    }

    await this.tenantRepository.update(tenantId, {
      settings: {
        integrations: newTokens,
      },
    })

    return newTokens
  }
}
