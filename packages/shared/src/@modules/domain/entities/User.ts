import { UserMetadata } from '../../../@data/schemas'
import { Membership } from './Membership'

/**
 * Represents a user.
 *
 * @property {string} id - The unique identifier of the user.
 * @property {string} email - The email address of the user.
 * @property {string} name - The name of the user.
 * @property {boolean} emailVerified - Indicates if the user's email is verified.
 * @property {string} username - The username of the user.
 * @property {(string | undefined)} image - Optional. The image URL of the user.
 *
 * @property {UserSettings} settings - The settings of the user.
 * @property {(Membership[] | undefined)} memberships - Optional. An array of memberships.
 *
 * @property {Date} createdAt - The date and time the user was created.
 * @property {Date} updatedAt - The date and time the user was last updated.
 */
export interface User {
  id: string
  email: string
  name: string
  emailVerified: boolean
  username: string
  image?: string

  settings: UserMetadata
  memberships?: Membership[]

  createdAt: Date
  updatedAt: Date
}
