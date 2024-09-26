import { z } from 'zod'

/**
 * Schema for updating user profile information.
 *
 * This schema defines the structure of the input required to update
 * a user's profile, including their name, image, username, email, and locale.
 *
 * @typedef {Object} UpdateProfileActionInput
 * @property {string} [image] - The URL of the user's profile image, which can be optional or null.
 * @property {string} name - The user's name, which must be at least 2 characters long.
 * @property {string} [username] - The user's username, which can be optional or null.
 * @property {string} [email] - The user's email address, which can be optional or null.
 * @property {string} [locale] - The user's locale, which defaults to 'en' if not provided.
 */
export const updateProfileActionSchema = z.object({
  image: z.string().optional().nullish(),
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  username: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  locale: z.string().default('en').optional(),
})
