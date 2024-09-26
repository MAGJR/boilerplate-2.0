import { z } from 'zod'

/**
 * Schema for updating user base information during the onboarding process.
 *
 * This schema defines the structure of the input required to update
 * a user's base information, including their name, email, and phone number.
 *
 * @typedef {Object} UpdateUserBaseInfoInput
 * @property {string} name - The user's name, which must be at least 1 character long.
 * @property {string} email - The user's email address, which must be a valid email format.
 * @property {string} phone - The user's phone number, which can be an empty string.
 */
export const updateUserBaseInfoSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string(),
})
