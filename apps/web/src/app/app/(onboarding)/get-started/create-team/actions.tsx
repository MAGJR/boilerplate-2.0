'use server'

import { client } from '@/services/actions/clients/user.client'
import { shared } from '@app/shared'
import { cookies } from 'next/headers'
import { createTenantActionSchema } from './schemas'

/**
 * Action to create a new tenant.
 *
 * This action handles the creation of a new tenant in the system. It takes the user's input
 * for the tenant's name and uses the user's email for billing settings. Upon successful creation,
 * it sets a cookie with the tenant's ID for future reference.
 *
 * @param {Object} input - The input data for creating a tenant.
 * @param {string} input.name - The name of the tenant to be created.
 * @param {Object} context - The context object containing user information.
 * @param {Object} context.user - The current user object, which includes the user's ID and email.
 * @returns {Promise<Object>} A promise that resolves to the created tenant object.
 */
export const createTenantAction = client.action({
  name: 'tenant.create',
  type: 'mutate',
  schema: createTenantActionSchema,
  handler: async ({ input, context }) => {
    const tenant = await shared.usecases.tenant.createTenant.execute(
      context.user.id,
      {
        name: input.name,
        settings: {
          billing: {
            email: context.user.email,
          },
        },
      },
    )

    cookies().set('x-tenant', tenant.id)
    return tenant
  },
})
