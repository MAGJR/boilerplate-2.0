'use server'

import { getUTMSFromSSR } from '@/helpers/get-ssr.utms'
import { client } from '@/services/actions/clients/user.client'
import { shared } from '@app/shared'
import { cookies } from 'next/headers'
import { updateUserBaseInfoSchema } from './schemas'
/**
 * Action to update the user's base information during the onboarding process.
 *
 * This action handles the mutation of user data, including updating the user's
 * name and phone number, as well as capturing UTM parameters from the server-side
 * request. If an invite ID is present in the cookies, it will accept the invite
 * and redirect the user to the appropriate account selection page. Otherwise,
 * it redirects the user to the create team page.
 *
 * @param {Object} input - The input data for updating user information.
 * @param {string} input.name - The new name of the user.
 * @param {string} input.phone - The new phone number of the user.
 * @param {Object} context - The context object containing user information.
 * @param {Object} context.user - The current user object.
 * @returns {Promise<Object>} A promise that resolves to an object containing
 * the redirect URL.
 */
export const updateUserBaseInfo = client.action({
  name: 'user.onboarding.start',
  type: 'mutate',
  schema: updateUserBaseInfoSchema,
  handler: async ({ input, context }) => {
    const { user } = context

    await shared.usecases.user.updateUser.execute(user.id, {
      name: input.name,
      settings: {
        contact: {
          phone: input.phone,
        },
        utms: getUTMSFromSSR(),
      },
    })

    const inviteId = cookies().get('x-tenant-invite')
    if (inviteId) {
      const invite = await shared.usecases.invite.acceptInvite.execute({
        userId: user.id,
        inviteId: inviteId.value,
      })

      return {
        redirect: `/app/select-account/${invite.tenantId}`,
      }
    }

    return {
      redirect: '/app/get-started/create-team',
    }
  },
})
