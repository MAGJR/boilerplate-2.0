import { PrismaClient } from '@prisma/client'
import { Membership, MembershipRole } from '../../../domain/entities/Membership'
import { CoreRepository } from '../../../interfaces/core/repository'
import {
  CreateMembershipDTO,
  IMembershipRepository,
  UpdateMembershipDTO,
} from '../../../interfaces/repositories/membership'

/**
 * Implements the IMembershipRepository interface to interact with the database for membership operations.
 */
export class PrismaMembershipRepository
  extends CoreRepository<Membership>
  implements IMembershipRepository
{
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  /**
   * Retrieves a list of memberships for a given tenant.
   * @param tenantId The ID of the tenant for whom to retrieve memberships.
   * @returns A Promise that resolves to an array of Membership entities.
   */
  async list(tenantId: string): Promise<Membership[]> {
    const memberships = await this.prisma.membership.findMany({
      where: {
        tenantId,
      },
      include: {
        user: true,
        tenant: true,
      },
    })

    return memberships.map(this.mapToDomain)
  }

  /**
   * Creates a new membership in the database.
   * @param data The data for the membership to be created.
   * @returns A Promise that resolves to the created Membership entity.
   */
  async create(data: CreateMembershipDTO): Promise<Membership> {
    const membership = await this.prisma.membership.create({
      data: {
        userId: data.userId,
        tenantId: data.tenantId,
        role: data.role,
      },
    })

    return this.mapToDomain(membership)
  }

  /**
   * Updates an existing membership in the database.
   * @param membershipId The ID of the membership to be updated.
   * @param data The partial data for the membership to be updated.
   * @returns A Promise that resolves to the updated Membership entity.
   */
  async update(
    membershipId: string,
    data: UpdateMembershipDTO,
  ): Promise<Membership> {
    const membership = await this.prisma.membership.update({
      where: { id: membershipId },
      data: {
        role: data.role as MembershipRole,
      },
    })

    return this.mapToDomain(membership)
  }

  /**
   * Deletes a membership from the database.
   * @param membershipId The ID of the membership to be deleted.
   * @returns A Promise that resolves when the membership is deleted.
   */
  async delete(membershipId: string): Promise<void> {
    await this.prisma.membership.deleteMany({
      where: {
        id: membershipId,
      },
    })
  }

  /**
   * Retrieves a membership by its ID from the database.
   * @param membershipId The ID of the membership to be retrieved.
   * @returns A Promise that resolves to the Membership entity if found, or null if not found.
   */
  async getById(membershipId: string): Promise<Membership | null> {
    const membership = await this.prisma.membership.findUnique({
      where: { id: membershipId },
      include: {
        user: true,
        tenant: true,
      },
    })

    if (!membership) return null
    return this.mapToDomain(membership)
  }

  /**
   * Retrieves a membership by user ID and tenant ID from the database.
   * @param userId The ID of the user for whom to retrieve the membership.
   * @param tenantId The ID of the tenant for whom to retrieve the membership.
   * @returns A Promise that resolves to the Membership entity if found, or null if not found.
   */
  async getByUserOnTenant(
    userId: string,
    tenantId: string,
  ): Promise<Membership | null> {
    const membership = await this.prisma.membership.findFirst({
      where: {
        userId,
        tenantId,
      },
      include: {
        user: true,
        tenant: true,
      },
    })

    if (!membership) return null
    return this.mapToDomain(membership)
  }

  /**
   * Maps a Prisma membership object to a Membership domain entity.
   * @param membership The Prisma membership object to map.
   * @returns The mapped Membership domain entity.
   */
  private mapToDomain(membership: any): Membership {
    return {
      id: membership.id,
      tenantId: membership.tenantId,
      userId: membership.userId,
      role: membership.role,

      user: membership.user,
      tenant: membership.tenant,

      createdAt: membership.createdAt,
      updatedAt: membership.updatedAt,
      deletedAt: membership.deletedAt,
    }
  }

  protected async toSave(
    data: Partial<Membership>,
  ): Promise<Partial<Membership>> {
    return data
  }

  protected toRead(model: any): Membership {
    return {
      id: model.id,
      tenantId: model.tenantId,
      userId: model.userId,
      role: model.role,
      user: model.user,
      tenant: model.tenant,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
}
