import { IQuotaProvider } from '../../../interfaces/providers/quota-provider'
import {
  CreateInviteDTO,
  IInviteRepository,
} from '../../../interfaces/repositories/invite'
import { ITenantRepository } from '../../../interfaces/repositories/tenant'
import { Invite } from '../../entities/Invite'
import { QuotaExceededError } from '../../errors/quota-exceeded-error'

/**
 * Represents the use case for creating an invite.
 * This class encapsulates the logic for creating an invite, including verifying the existence of the tenant,
 * checking available quota, setting the expiration date, and creating or updating the invite.
 */
export class CreateInviteUseCase {
  /**
   * Constructs a new instance of the CreateInviteUseCase.
   *
   * @param {IInviteRepository} inviteRepository - The repository for managing invites.
   * @param {ITenantRepository} tenantRepository - The repository for managing tenants.
   * @param {IQuotaProvider} quotaProvider - The provider for checking feature quotas.
   */
  constructor(
    private readonly inviteRepository: IInviteRepository,
    private readonly tenantRepository: ITenantRepository,
    private readonly quotaProvider: IQuotaProvider,
  ) {}

  /**
   * Executes the use case.
   *
   * @param {string} tenantId - The unique identifier of the tenant.
   * @param {Omit<CreateInviteDTO, 'expiresAt' | 'acceptedAt'>} data - The data for creating the invite.
   * @returns {Promise<Invite>} - The created or updated invite.
   * @throws {Error} If the tenant does not exist.
   * @throws {QuotaExceededError} If the invite quota has been exceeded.
   */
  async execute(
    tenantId: string,
    data: Omit<CreateInviteDTO, 'expiresAt' | 'acceptedAt'>,
  ): Promise<Invite> {
    const tenantExists = await this.tenantRepository.getById(tenantId)
    if (!tenantExists) {
      throw new Error('Tenant does not exist')
    }

    // Check quota before creating invite
    const inviteQuota = await this.quotaProvider.getFeatureQuota(
      tenantId,
      'TEAM_MEMBERS',
    )

    if (
      !inviteQuota.available ||
      (inviteQuota.quota && inviteQuota.quota.available <= 0)
    ) {
      throw new QuotaExceededError('invites')
    }

    const sevenDaysLater = new Date()
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)
    const expiresAt = sevenDaysLater

    const existingInvite = await this.inviteRepository.getByEmailAndTenantId(
      data.email,
      tenantId,
    )

    let invite
    if (existingInvite) {
      invite = await this.inviteRepository.update(existingInvite.id, {
        ...existingInvite,
        expiresAt,
      })
    } else {
      invite = await this.inviteRepository.create(tenantId, {
        email: data.email,
        role: data.role,
        expiresAt,
      })
    }

    return invite
  }
}
