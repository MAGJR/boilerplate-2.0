import { DeepPartial } from '@app/db/prisma/utils/json-parser'
import { UserMetadata } from '../../../@data/schemas'
import { User } from '../../domain/entities/User'
import { CoreRepository } from '../core/repository'

/**
 * Represents the data transfer object for updating a user.
 * @property {string} name - The user's name.
 * @property {string} username - The user's username.
 * @property {(string|undefined)} image - The user's image URL (optional).
 * @property {UserSettings} settings - The user's settings.
 */
export interface UpdateUserDTO {
  name: string
  username: string
  image?: string
  settings: UserMetadata
}

/**
 * Defines the interface for the user repository.
 * This interface outlines the methods that must be implemented by any user repository.
 */
export interface IUserRepository extends CoreRepository<User> {
  /**
   * Retrieves a user by their ID.
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<User>} A promise that resolves to the user object.
   */
  getById: (id: string) => Promise<User>
  /**
   * Retrieves a user by their username.
   * @param {string} username - The username of the user to retrieve.
   * @returns {Promise<User>} A promise that resolves to the user object.
   */
  getByUsername: (username: string) => Promise<User>
  /**
   * Updates a user with the provided data.
   * @param {string} id - The ID of the user to update.
   * @param {DeepPartial<UpdateUserDTO>} data - The partial data to update the user with.
   * @returns {Promise<User>} A promise that resolves to the updated user object.
   */
  update: (id: string, data: DeepPartial<UpdateUserDTO>) => Promise<User>
}
