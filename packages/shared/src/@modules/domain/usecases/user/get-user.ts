import { SlugValueObject } from '../../../infrastructure/slug/value-object-slug'
import { IUserRepository } from '../../../interfaces/repositories/user'
import { User } from '../../entities/User'

/**
 * Represents the use case for retrieving a user by its ID.
 * This class encapsulates the logic for fetching a user entity from the repository based on its ID.
 */
export class GetUserByIdUseCase {
  private userRepository: IUserRepository

  /**
   * Constructs a new instance of the GetUserByIdUseCase.
   *
   * @param {IUserRepository} userRepository - The repository for managing users.
   */
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  /**
   * Executes the use case for retrieving a user by its ID.
   * This method first checks if the user exists, then fetches the user from the repository using the ID.
   * If the user is found, it parses the user's settings using the JsonParserDateObject.
   * If the user does not have a username, it generates a username from the user's email and updates the user.
   * Finally, it returns the user entity with its settings parsed.
   *
   * @param {string} id - The unique identifier of the user to be fetched.
   * @returns {Promise<User | null>} A promise that resolves to the fetched User entity or null if not found.
   */
  async execute(id: string) {
    const user = await this.userRepository.getById(id)

    if (!user.username) {
      await this.userRepository.update(user.id, {
        username: SlugValueObject.createFromEmail(user.email),
      })
    }

    return user as User
  }
}
