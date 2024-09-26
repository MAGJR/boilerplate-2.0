'use server'

import { client } from '@/services/actions/clients/tenant.client'
import { shared } from '@app/shared'
import { cookies } from 'next/headers'
import { updateProfileActionSchema } from './schemas'

/**
 * Action to update the user's profile information.
 *
 * This action handles the mutation of user profile data, including updating
 * the user's name and image. It also sets a cookie for the user's locale
 * if provided in the input.
 *
 * @param {Object} input - The input data for updating the user profile.
 * @param {string} input.name - The new name of the user.
 * @param {string} input.image - The new image URL of the user.
 * @param {string} [input.locale] - The locale to be set as a cookie.
 * @param {Object} context - The context object containing user information.
 * @param {Object} context.user - The current user object, which includes the user's ID.
 * @returns {Promise<void>} A promise that resolves when the user profile is updated.
 */
export const updateUserProfileAction = client.action({
  name: 'user.update',
  type: 'mutate',
  schema: updateProfileActionSchema,
  handler: async ({ input, context }) => {
    const { user } = context

    if (input.locale) cookies().set('x-locale', input.locale)

    await shared.usecases.user.updateUser.execute(user.id, {
      name: input.name,
      image: input.image,
    })
  },
})
