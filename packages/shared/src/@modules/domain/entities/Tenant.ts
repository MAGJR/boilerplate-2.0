import { TenantMetadata } from '../../../@data/schemas'

/**
 * Represents a tenant.
 *
 * @property {string} id - The unique identifier of the tenant.
 * @property {string} name - The name of the tenant.
 * @property {string} slug - The slug of the tenant.
 * @property {string} logo - The logo of the tenant.
 * @property {TenantSettings} settings - The settings of the tenant.
 * @property {string} paymentProviderId - The unique identifier of the payment provider.
 * @property {Date} createdAt - The date and time the tenant was created.
 * @property {Date} updatedAt - The date and time the tenant was last updated.
 * @property {Date} deletedAt - The date and time the tenant was deleted.
 */
export interface Tenant {
  id: string
  name: string
  slug: string
  logo?: string
  settings: TenantMetadata

  paymentProviderId?: string

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
