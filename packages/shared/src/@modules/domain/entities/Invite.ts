import { MembershipRole } from './Membership'

/**
 * Represents an invitation to join a tenant.
 *
 * @property {string} id - The unique identifier of the invite.
 * @property {string} email - The email address of the invitee.
 * @property {string} tenantId - The unique identifier of the tenant.
 *
 * @property {MembershipRole} role - The role the invitee will have within the tenant.
 * @property {(tenant?: {id: string, name: string, slug: string, logo: string})} tenant - Optional. The tenant details.
 *
 * @property {Date} createdAt - The date and time the invite was created.
 * @property {Date} updatedAt - The date and time the invite was last updated.
 * @property {Date} expiresAt - The date and time the invite expires.
 * @property {(Date | undefined)} acceptedAt - Optional. The date and time the invite was accepted.
 */
export interface Invite {
  id: string
  email: string
  tenantId: string

  role: MembershipRole
  tenant?: {
    id: string
    name: string
    slug: string
    logo: string
  }

  createdAt: Date
  updatedAt: Date
  expiresAt: Date
  acceptedAt?: Date
}
