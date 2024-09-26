'use server'

import { client } from '@/services/actions/clients/tenant.client'
import { getUrl, InviteEmail, shared } from '@app/shared'
import { renderAsync } from '@react-email/components'
import { z } from 'zod'
import { inviteMemberActionSchema } from './schemas'

/**
 * Action to retrieve the list of admin members for a tenant.
 *
 * This action fetches the memberships associated with the current tenant
 * for the authenticated user.
 *
 * @param {Object} context - The context object containing tenant and user information.
 * @param {Object} context.tenant - The current tenant object.
 * @param {Object} context.user - The current user object.
 * @returns {Promise<Array>} A promise that resolves to an array of memberships.
 */
export const getTenantAdminMembersActions = client.action({
  name: 'app.tenant.members.admin.get',
  type: 'query',
  handler: async ({ context }) => {
    const { tenant, user } = context

    return shared.usecases.membership.listMembershipsOnTenant.execute({
      userId: user.id,
      tenantId: tenant.id,
    })
  },
})

/**
 * Action to delete a member from the team.
 *
 * This action deletes a membership for a specified user from the current tenant.
 *
 * @param {Object} input - The input data for deleting a member.
 * @param {string} input.id - The ID of the membership to delete.
 * @param {Object} context - The context object containing tenant and user information.
 * @param {Object} context.tenant - The current tenant object.
 * @param {Object} context.user - The current user object.
 * @returns {Promise<void>} A promise that resolves when the membership is deleted.
 */
export const deleteMemberOnTeamAction = client.action({
  name: 'app.tenant.members.admin.delete',
  type: 'mutate',
  schema: z.object({
    id: z.string(),
  }),
  handler: async ({ input, context }) => {
    const { tenant, user } = context
    const { id } = input

    await shared.usecases.membership.deleteMembershipOnTenant.execute({
      currentTenantId: tenant.id,
      currentUserId: user.id,
      membershipToDeleteId: id,
    })
  },
})

/**
 * Action to retrieve the list of invites for admin members.
 *
 * This action fetches the invites associated with the current tenant
 * for the authenticated user.
 *
 * @param {Object} context - The context object containing tenant and user information.
 * @param {Object} context.tenant - The current tenant object.
 * @param {Object} context.user - The current user object.
 * @returns {Promise<Array>} A promise that resolves to an array of invites.
 */
export const getTenantAdminMembersInvitesActions = client.action({
  name: 'app.tenant.members.invites.admin.get',
  type: 'query',
  handler: async ({ context }) => {
    const { tenant, user } = context

    return shared.usecases.invite.listInvites.execute({
      userId: user.id,
      tenantId: tenant.id,
    })
  },
})

/**
 * Action to delete an invite for a member.
 *
 * This action deletes a specified invite from the current tenant.
 *
 * @param {Object} input - The input data for deleting an invite.
 * @param {string} input.inviteId - The ID of the invite to delete.
 * @param {Object} context - The context object containing tenant and user information.
 * @param {Object} context.tenant - The current tenant object.
 * @param {Object} context.user - The current user object.
 * @returns {Promise<void>} A promise that resolves when the invite is deleted.
 */
export const deleteInviteAction = client.action({
  name: 'app.tenant.members.invites.admin.delete',
  type: 'mutate',
  schema: z.object({
    inviteId: z.string(),
  }),
  handler: async ({ input, context }) => {
    const { tenant, user } = context
    const { inviteId } = input

    await shared.usecases.invite.deleteInvite.execute({
      userId: user.id,
      tenantId: tenant.id,
      inviteId,
    })
  },
})

/**
 * Action to invite a new member to the tenant.
 *
 * This action creates an invite for a specified email address and sends
 * an invitation email to the user.
 *
 * @param {Object} input - The input data for inviting a member.
 * @param {string} input.email - The email address of the member to invite.
 * @param {Object} context - The context object containing tenant information.
 * @param {Object} context.tenant - The current tenant object.
 * @returns {Promise<Object>} A promise that resolves to an object containing the success status and email of the invited member.
 */
export const inviteMemberAction = client.action({
  name: 'app.tenant.member.invite',
  type: 'mutate',
  schema: inviteMemberActionSchema,
  handler: async ({ input, context }) => {
    const { tenant } = context

    const invite = await shared.usecases.invite.createInvite.execute(
      tenant.id,
      {
        email: input.email,
        role: 'member',
      },
    )

    await shared.provider.mail.send({
      from: shared.config.application.providers.mail.from,
      to: input.email,
      subject: `Welcome to ${shared.config.application.name}`,
      body: await renderAsync(
        InviteEmail({
          email: input.email,
          team: tenant.name,
          url: getUrl(`/app/invites/${invite.id}`),
        }),
      ),
    })

    return {
      success: true,
      email: invite.email,
    }
  },
})
