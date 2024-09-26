/**
 * Defines the roles a member can have within a tenant.
 * @enum {string}
 */
export type MembershipRole = 'owner' | 'member'

/**
 * Represents a membership within a tenant.
 *
 * @property {string} id - The unique identifier of the membership.
 * @property {string} userId - The unique identifier of the user.
 * @property {string} tenantId - The unique identifier of the tenant.
 * @property {MembershipRole} role - The role of the user within the tenant.
 *
 * @property {(user?: {id: string, name: string, email: string, username: string, image?: string})} user - Optional. The user details.
 * @property {(tenant?: {id: string, name: string, slug: string, logo?: string})} tenant - Optional. The tenant details.
 *
 * @property {Date} createdAt - The date and time the membership was created.
 * @property {Date} updatedAt - The date and time the membership was last updated.
 * @property {(Date | undefined)} deletedAt - Optional. The date and time the membership was deleted.
 */
export interface Membership {
  id: string
  userId: string
  tenantId: string
  role: MembershipRole

  user?: {
    id: string
    name: string
    email: string
    username: string
    image?: string
  }

  tenant?: {
    id: string
    name: string
    slug: string
    logo?: string
  }

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
