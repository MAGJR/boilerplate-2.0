'use server'

import { client } from '@/services/actions/clients/tenant.client'
import { shared } from '@app/shared'
import { updateTenantActionSchema } from './schemas'

/**
 * Action to update the tenant's information.
 *
 * This action allows the authenticated user to update the tenant's
 * name and logo. It requires the user and tenant context to execute
 * the update process.
 *
 * @param {Object} input - The input data for updating the tenant.
 * @param {string} input.name - The new name of the tenant.
 * @param {string} input.logo - The new logo of the tenant.
 * @param {Object} context - The context object containing user and tenant information.
 * @param {Object} context.user - The current user object, which includes the user's ID.
 * @param {Object} context.tenant - The current tenant object, which includes the tenant's ID.
 * @returns {Promise<void>} A promise that resolves when the tenant information is updated.
 */
export const updateTenantAction = client.action({
  name: 'tenant.update',
  type: 'mutate',
  schema: updateTenantActionSchema,
  handler: async ({ input, context }) => {
    const { user, tenant } = context

    return shared.usecases.tenant.updateTenant.execute(user.id, tenant.id, {
      name: input.name,
      logo: input.logo,
    })
  },
})
