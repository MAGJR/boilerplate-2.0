import { TenantMetadata } from '../../../@data/schemas'
import { Tenant } from '../../domain/entities/Tenant'
import { ChildPartial } from '../../types/child-partial'
import { CoreRepository } from '../core/repository'

/**
 * Represents the data transfer object for creating a tenant.
 * This interface defines the structure of the data required to create a new tenant.
 */
export interface CreateTenantDTO {
  /**
   * The name of the tenant.
   */
  name: string
  /**
   * The slug of the tenant.
   */
  slug: string
  /**
   * The unique identifier of the payment provider.
   */
  paymentProviderId: string
  /**
   * The settings of the tenant, represented as a partial of TenantSettings.
   */
  settings: ChildPartial<TenantMetadata>
}

/**
 * Represents the data transfer object for updating a tenant.
 * This interface defines the structure of the data required to update an existing tenant.
 */
export interface UpdateTenantDTO {
  /**
   * The name of the tenant, optional.
   */
  name?: string
  /**
   * The slug of the tenant, optional.
   */
  slug?: string
  /**
   * The logo of the tenant, optional.
   */
  logo?: string
  /**
   * The unique identifier of the payment provider, optional.
   */
  paymentProviderId?: string
  /**
   * The settings of the tenant, represented as a partial of TenantSettings, optional.
   */
  settings?: ChildPartial<TenantMetadata>
}

/**
 * Represents the repository for managing tenants.
 * This interface defines the methods for CRUD operations on tenants.
 */
export interface ITenantRepository extends CoreRepository<Tenant> {
  /**
   * Creates a new tenant.
   * @param {Partial<Tenant>} data - The data transfer object containing the tenant's details.
   * @returns {Promise<Tenant>} A promise that resolves to the created Tenant object.
   */
  create: (data: Partial<CreateTenantDTO>) => Promise<Tenant>

  /**
   * Finds a tenant by its slug.
   * This method retrieves a tenant by its unique slug.
   * @param {string} slug - The slug of the tenant to be found.
   * @returns {Promise<Tenant | undefined>} A promise that resolves to the Tenant object or undefined if not found.
   */
  getBySlug: (slug: string) => Promise<Tenant | undefined>
  /**
   * Finds a tenant by its ID.
   * This method retrieves a tenant by its unique identifier.
   * @param {string} tenantId - The unique identifier of the tenant to be found.
   * @returns {Promise<Tenant | null>} A promise that resolves to the Tenant object or null if not found.
   */
  getById: (tenantId: string) => Promise<Tenant | null>
  /**
   * Finds a tenant by its external API token.
   * This method retrieves a tenant by its external API token.
   * @param {string} token - The external API token of the tenant to be found.
   * @returns {Promise<Tenant | undefined>} A promise that resolves to the Tenant object or undefined if not found.
   */
  getByExternalApiToken: (token: string) => Promise<Tenant | undefined>
  /**
   * Updates an existing tenant.
   * This method updates a tenant based on the provided data transfer object.
   * @param {string} tenantId - The unique identifier of the tenant to be updated.
   * @param {Partial<UpdateTenantDTO>} data - The partial data transfer object containing the tenant's updates.
   * @returns {Promise<Tenant>} A promise that resolves to the updated Tenant object.
   */
  update: (tenantId: string, data: Partial<UpdateTenantDTO>) => Promise<Tenant>
}
