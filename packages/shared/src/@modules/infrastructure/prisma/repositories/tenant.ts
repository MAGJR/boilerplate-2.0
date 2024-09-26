import { JsonParserDateObject } from '@app/db/prisma/utils/json-parser'
import { PrismaClient } from '@prisma/client'
import {
  TenantMetadata,
  tenantMetadataDefault,
  tenantMetadataSchema,
} from '../../../../@data/schemas'
import { Tenant } from '../../../domain/entities/Tenant'
import { CoreRepository } from '../../../interfaces/core/repository'
import {
  CreateTenantDTO,
  ITenantRepository,
  UpdateTenantDTO,
} from '../../../interfaces/repositories/tenant'

/**
 * Implements the ITenantRepository interface to interact with the database for tenant operations.
 */
export class PrismaTenantRepository
  extends CoreRepository<Tenant>
  implements ITenantRepository
{
  protected prisma: PrismaClient

  /**
   * Initializes the PrismaTenantRepository with a PrismaClient instance.
   * @param prisma The PrismaClient instance to use for database operations.
   */
  constructor(prisma: PrismaClient) {
    super(prisma)
    this.prisma = prisma
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tenant.delete({
      where: { id },
    })
  }

  async list(): Promise<Tenant[]> {
    const tenants = await this.prisma.tenant.findMany()
    return tenants as Tenant[]
  }

  /**
   * Retrieves a tenant by its slug from the database.
   * @param slug The slug of the tenant to be retrieved.
   * @returns A Promise that resolves to the Tenant entity if found, or undefined if not found.
   */
  async getBySlug(slug: string): Promise<Tenant | undefined> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
    })

    if (!tenant) return undefined

    return this.toRead(tenant)
  }

  /**
   * Retrieves a tenant by its ID from the database.
   * @param tenantId The ID of the tenant to be retrieved.
   * @returns A Promise that resolves to the Tenant entity if found, or undefined if not found.
   */
  async getById(id: string): Promise<Tenant | null> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
    })

    if (!tenant) return null

    return this.toRead(tenant)
  }

  /**
   * Retrieves a tenant by its external API token from the database.
   * @param token The external API token of the tenant to be retrieved.
   * @returns A Promise that resolves to the Tenant entity if found, or undefined if not found.
   */
  async getByExternalApiToken(token: string): Promise<Tenant | undefined> {
    const tenant = await this.prisma.tenant.findFirst({
      where: {
        settings: {
          path: ['integrations', 'external', 'token'],
          equals: token,
        },
      },
    })

    if (!tenant) return undefined

    return this.toRead(tenant)
  }

  /**
   * Creates a new tenant in the database.
   * @param data The data transfer object containing the tenant details.
   * @returns A Promise that resolves to the created Tenant entity.
   */
  async create(data: Partial<CreateTenantDTO>): Promise<Tenant> {
    const tenantData = await this.toSave(data as Tenant)

    const tenant = await this.prisma.tenant.create({
      data: {
        name: tenantData.name as string,
        slug: tenantData.slug as string,
        logo: tenantData.logo,
        paymentProviderId: tenantData.paymentProviderId,
        settings: tenantData.settings as TenantMetadata,
      },
    })

    return this.toRead(tenant)
  }

  /**
   * Updates an existing tenant in the database.
   * @param tenantId The ID of the tenant to be updated.
   * @param data The partial data transfer object containing the tenant details to be updated.
   * @returns A Promise that resolves to the updated Tenant entity.
   */
  async update(
    tenantId: string,
    data: Partial<UpdateTenantDTO>,
  ): Promise<Tenant> {
    const tenantData = await this.toSave(data as Tenant)

    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: tenantData,
    })

    return this.toRead(tenant)
  }

  /**
   * Converts entity data for saving to the database.
   * @param data The entity data to be saved.
   * @returns The converted data ready for database insertion.
   */
  protected async toSave(data: Partial<Tenant>): Promise<Partial<Tenant>> {
    let currentTenant

    if (data.id) {
      currentTenant = await this.prisma.tenant.findUnique({
        where: { id: data.id },
        select: { settings: true },
      })
    }

    const parsedSettings = JsonParserDateObject.parse({
      schema: tenantMetadataSchema,
      data: {
        default: tenantMetadataDefault,
        current: currentTenant?.settings as any,
        upsert: data.settings as any,
      },
    })

    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      logo: data.logo,
      paymentProviderId: data.paymentProviderId,
      settings: parsedSettings.success
        ? (parsedSettings.data as TenantMetadata)
        : tenantMetadataDefault,
    }
  }

  /**
   * Converts entity data read from the database to the application format.
   * @param model The entity data read from the database.
   * @returns The converted Tenant entity.
   */
  protected toRead(model: any): Tenant {
    const parsedSettings = JsonParserDateObject.parse({
      schema: tenantMetadataSchema,
      data: {
        default: tenantMetadataDefault,
        current: model.settings,
      },
    })

    const settings = parsedSettings.success
      ? (parsedSettings.data as TenantMetadata)
      : tenantMetadataDefault

    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      logo: model.logo,
      settings,
      paymentProviderId: model.paymentProviderId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    }
  }
}
