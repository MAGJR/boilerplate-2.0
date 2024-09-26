import { Membership, MembershipRole } from '../../domain/entities/Membership'
import { CoreRepository } from '../core/repository'

/**
 * Represents the data transfer object for creating a membership.
 * This interface defines the structure of the data required to create a new membership.
 */
export interface CreateMembershipDTO {
  tenantId: string // The unique identifier of the tenant.
  userId: string // The unique identifier of the user.
  role: MembershipRole // The role of the user within the tenant.
}

/**
 * Represents the data transfer object for updating a membership.
 * This interface defines the structure of the data required to update an existing membership.
 */
export interface UpdateMembershipDTO {
  role: MembershipRole // The role of the user within the tenant.
}

/**
 * Represents the repository for managing memberships.
 * This interface defines the methods for CRUD operations on memberships.
 */
export interface IMembershipRepository extends CoreRepository<Membership> {
  /**
   * Lists all memberships for a given tenant.
   * @param {string} tenantId - The unique identifier of the tenant.
   * @returns {Promise<Membership[]>} A promise that resolves to an array of Membership objects.
   */
  list: (tenantId: string) => Promise<Membership[]>
  /**
   * Deletes a membership by its ID.
   * @param {string} membershipId - The unique identifier of the membership to be deleted.
   * @returns {Promise<void>} A promise that resolves when the deletion is complete.
   */
  delete: (membershipId: string) => Promise<void>
  /**
   * Creates a new membership.
   * @param {CreateMembershipDTO} data - The data required to create a new membership.
   * @returns {Promise<Membership>} A promise that resolves to the created Membership object.
   */
  create: (data: CreateMembershipDTO) => Promise<Membership>
  /**
   * Retrieves a membership by user ID and tenant ID.
   * @param {string} userId - The unique identifier of the user.
   * @param {string} tenantId - The unique identifier of the tenant.
   * @returns {Promise<Membership | null>} A promise that resolves to the Membership object or null if not found.
   */
  getByUserOnTenant: (
    userId: string,
    tenantId: string,
  ) => Promise<Membership | null>
  /**
   * Retrieves a membership by its ID.
   * @param {string} membershipId - The unique identifier of the membership.
   * @returns {Promise<Membership | null>} A promise that resolves to the Membership object or null if not found.
   */
  getById: (membershipId: string) => Promise<Membership | null>
  /**
   * Updates an existing membership.
   * @param {string} membershipId - The unique identifier of the membership to be updated.
   * @param {UpdateMembershipDTO} data - The data required to update the membership.
   * @returns {Promise<Membership>} A promise that resolves to the updated Membership object.
   */
  update: (
    membershipId: string,
    data: UpdateMembershipDTO,
  ) => Promise<Membership>
}
