import { z } from 'zod'

/**
 * Schema for inviting a member to the team.
 *
 * This schema defines the structure of the input required to invite
 * a new member, specifically their email address. The email must be
 * a valid format.
 *
 * @typedef {Object} InviteMemberActionInput
 * @property {string} email - The email address of the member to be invited.
 */
export const inviteMemberActionSchema = z.object({
  email: z.string().email('O e-mail deve ser válido.'),
})
