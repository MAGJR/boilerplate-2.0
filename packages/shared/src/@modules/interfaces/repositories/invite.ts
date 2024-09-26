import { Invite } from '../../domain/entities/Invite'
import { MembershipRole } from '../../domain/entities/Membership'
import { CoreRepository } from '../core/repository'

/**
 * Represents the data transfer object for creating an invite.
 */
export interface CreateInviteDTO {
  email: string
  role: MembershipRole

  expiresAt: Date
  acceptedAt?: Date
}

/**
 * Represents the data transfer object for updating an invite.
 */
export interface UpdateInviteDTO {
  role: MembershipRole
  expiresAt: Date
  acceptedAt: Date
}

/**
 * Represents the repository for managing invites.
 */
export interface IInviteRepository extends CoreRepository<Invite> {
  create: (tenantId: string, data: CreateInviteDTO) => Promise<Invite>
  getById: (id: string) => Promise<Invite | null>
  update: (id: string, data: Partial<UpdateInviteDTO>) => Promise<Invite>
  delete: (id: string) => Promise<void>
  list: (tenantId: string) => Promise<Invite[]>
  getByEmailAndTenantId: (
    email: string,
    tenantId: string,
  ) => Promise<Invite | null>
}
