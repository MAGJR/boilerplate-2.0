'use server'

import { client } from '@/services/actions/clients/tenant.client'
import { shared } from '@app/shared'

/**
 * Action to regenerate the external API token for a tenant.
 *
 * This action handles the regeneration of the external API token
 * for the specified tenant. It requires the user and tenant context
 * to execute the regeneration process.
 *
 * @param {Object} context - The context object containing user and tenant information.
 * @param {Object} context.user - The current user object, which includes the user's ID.
 * @param {Object} context.tenant - The current tenant object, which includes the tenant's ID.
 * @returns {Promise<void>} A promise that resolves when the external API token is regenerated.
 */
export const regenerateTokenAction = client.action({
  name: 'app.integrations.token.regenerate',
  type: 'mutate',
  handler: async ({ context }) => {
    const { user, tenant } = context
    return shared.usecases.tenant.regenerateExternalApiToken.execute(
      user.id,
      tenant.id,
    )
  },
})
