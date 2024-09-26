import { PrismaClient } from '@prisma/client'
import { MembershipRole } from '../../../domain/entities'
import { Invite } from '../../../domain/entities/Invite'
import { CoreRepository } from '../../../interfaces/core/repository'
import {
  CreateInviteDTO,
  IInviteRepository,
  UpdateInviteDTO,
} from '../../../interfaces/repositories/invite'

/**
 * Implements the IInviteRepository interface to interact with the database for invite operations.
 */
export class PrismaInviteRepository
  extends CoreRepository<Invite>
  implements IInviteRepository
{
  /**
   * Initializes the PrismaInviteRepository with a PrismaClient instance.
   * @param prisma The PrismaClient instance to use for database operations.
   */
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  /**
   * Creates a new invite in the database.
   * @param tenantId The ID of the tenant for whom the invite is being created.
   * @param data The data for the invite to be created.
   * @returns A Promise that resolves to the created Invite entity.
   */
  async create(tenantId: string, data: CreateInviteDTO): Promise<Invite> {
    const invite = await this.prisma.invite.create({
      data: {
        email: data.email,
        role: data.role as MembershipRole,
        expiresAt: data.expiresAt,
        acceptedAt: data.acceptedAt,
        tenantId,
      },
    })

    return this.toRead(invite)
  }

  /**
   * Updates an existing invite in the database.
   * @param id The ID of the invite to be updated.
   * @param data The partial data for the invite to be updated.
   * @returns A Promise that resolves to the updated Invite entity.
   */
  async update(id: string, data: Partial<UpdateInviteDTO>): Promise<Invite> {
    const updatedInvite = await this.prisma.invite.update({
      where: { id },
      data: (await this.toSave(data)) as UpdateInviteDTO,
    })

    return this.toRead(updatedInvite)
  }

  /**
   * Retrieves an invite by its ID from the database.
   * @param id The ID of the invite to be retrieved.
   * @returns A Promise that resolves to the Invite entity if found, or null if not found.
   */
  async getById(id: string): Promise<Invite | null> {
    const invite = await this.prisma.invite.findUnique({
      where: { id },
      include: {
        tenant: true,
      },
    })

    return invite ? this.toRead(invite) : null
  }

  /**
   * Deletes an invite from the database.
   * @param id The ID of the invite to be deleted.
   * @returns A Promise that resolves when the invite is deleted.
   */
  async delete(id: string): Promise<void> {
    await this.prisma.invite.delete({
      where: { id },
    })
  }

  /**
   * Lists all invites for a given tenant from the database.
   * @param tenantId The ID of the tenant for whom to list invites.
   * @returns A Promise that resolves to an array of Invite entities.
   */
  async list(tenantId: string): Promise<Invite[]> {
    const invites = await this.prisma.invite.findMany({
      where: { tenantId },
    })

    return invites as any[] as Invite[]
  }

  /**
   * Retrieves an invite by its email and tenant ID from the database.
   * @param email The email of the invite to be retrieved.
   * @param tenantId The ID of the tenant for whom to retrieve the invite.
   * @returns A Promise that resolves to the Invite entity if found, or null if not found.
   */
  async getByEmailAndTenantId(
    email: string,
    tenantId: string,
  ): Promise<Invite | null> {
    const invite = await this.prisma.invite.findFirst({
      where: {
        email,
        tenantId,
      },
    })
    return invite ? this.toRead(invite) : null
  }

  /**
   * Converts entity data read from the database to the application format.
   * @param data The entity data read from the database.
   * @returns The mapped Invite entity.
   */
  protected toRead(data: any): Invite {
    return {
      id: data.id,
      tenantId: data.tenantId,
      email: data.email,
      role: data.role,
      tenant: data.tenant,
      expiresAt: data.expiresAt,
      acceptedAt: data.acceptedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }

  protected async toSave(data: Partial<Invite>): Promise<Partial<Invite>> {
    return data
  }
}
