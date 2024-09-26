import {
  IMembershipRepository,
  UpdateMembershipDTO,
} from '../../../interfaces/repositories/membership'
import { Membership } from '../../entities/Membership'

/**
 * Represents the use case for updating a membership on a tenant.
 * This class encapsulates the logic for updating a membership, including verifying the existence of the membership,
 * and updating the membership.
 */
export class UpdateMembershipOnTenantUseCase {
  /**
   * Constructs a new instance of the UpdateMembershipOnTenantUseCase.
   *
   * @param {IMembershipRepository} membershipRepository - The repository for managing memberships.
   */
  constructor(private readonly membershipRepository: IMembershipRepository) {}

  /**
   * Executes the use case for updating a membership on a tenant.
   *
   * @param {string} membershipId - The unique identifier of the membership to be updated.
   * @param {UpdateMembershipDTO} data - The data for updating the membership.
   * @returns {Promise<Membership>} A promise that resolves to the updated Membership entity.
   */
  async execute(
    membershipId: string,
    data: UpdateMembershipDTO,
  ): Promise<Membership> {
    const existingMembership =
      await this.membershipRepository.getById(membershipId)
    if (!existingMembership) {
      throw new Error('Membership not found')
    }

    const updatedMembership = await this.membershipRepository.update(
      membershipId,
      data,
    )

    return updatedMembership
  }
}
