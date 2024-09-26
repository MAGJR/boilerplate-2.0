import { z } from 'zod'

/**
 * Schema for updating tenant information.
 *
 * This schema defines the structure of the input required to update
 * a tenant's name and logo. The name must be at least 2 characters long,
 * and the logo is optional and can be null.
 *
 * @typedef {Object} UpdateTenantActionInput
 * @property {string} name - The new name of the tenant, must be at least 2 characters.
 * @property {string|null|undefined} logo - The new logo of the tenant, optional and can be null.
 */
export const updateTenantActionSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  logo: z.string().optional().nullish(),
})
