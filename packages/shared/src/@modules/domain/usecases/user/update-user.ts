import { DeepPartial } from '@app/db/prisma/utils/json-parser'
import {
  IUserRepository,
  UpdateUserDTO,
} from '../../../interfaces/repositories/user'

/**
 * Represents the use case for updating a user.
 * This class encapsulates the logic for updating a user entity in the repository.
 */
export class UpdateUserUseCase {
  /**
   * Constructs a new instance of the UpdateUserUseCase.
   *
   * @param {IUserRepository} userRepository - The repository for managing users.
   */
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Executes the update user operation.
   * This method first fetches the user from the repository using the provided ID.
   * If the user is found, it updates the user's settings if new settings are provided.
   * Finally, it updates the user in the repository with the provided data.
   *
   * @param {string} id - The unique identifier of the user to be updated.
   * @param {DeepPartial<UpdateUserDTO>} data - The update data for the user.
   * @returns {Promise<void>} A promise that resolves when the update operation is complete.
   */
  async execute(id: string, data: DeepPartial<UpdateUserDTO>): Promise<void> {
    if (!id) {
      throw new Error('User ID is required')
    }

    const user = await this.userRepository.getById(id)

    if (!user) {
      throw new Error('User not found')
    }

    await this.userRepository.update(id, {
      name: data.name,
      username: data.username,
      image: data.image,
      settings: data.settings,
    })
  }
}
