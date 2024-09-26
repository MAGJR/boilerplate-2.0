import { IInviteRepository } from '../../../interfaces/repositories/invite'

/**
 * Represents the use case for retrieving an invite by its unique identifier.
 * This class encapsulates the logic for fetching an invite from the repository based on its ID.
 */
export class GetInviteByIdUseCase {
  /**
   * The repository responsible for managing invites.
   */
  private inviteRepository: IInviteRepository

  /**
   * Constructs a new instance of the GetInviteByIdUseCase.
   *
   * @param {IInviteRepository} inviteRepository - The repository for managing invites.
   */
  constructor(inviteRepository: IInviteRepository) {
    this.inviteRepository = inviteRepository
  }

  /**
   * Executes the use case for retrieving an invite by its ID.
   *
   * @param {string} id - The unique identifier of the invite to be retrieved.
   * @returns {Promise<any>} A promise that resolves to the invite entity if found, or throws an error if not found.
   */
  async execute(id: string) {
    const invite = await this.inviteRepository.getById(id)

    if (!invite) {
      throw new Error('Invite not found')
    }

    return invite
  }
}
