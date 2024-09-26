import { z } from 'zod'

/**
 * Schema for creating a new tenant.
 *
 * This schema defines the structure of the input required to create
 * a new tenant, including the tenant's name.
 *
 * @typedef {Object} CreateTenantActionInput
 * @property {string} name - The name of the tenant, which must be at least 1 character long.
 */
export const createTenantActionSchema = z.object({
  name: z.string().min(1, 'O nome é necessário'),
})
