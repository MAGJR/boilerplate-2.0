import { log } from '../../interfaces/core/log'

/**
 * Provides a method to generate a universally unique identifier (UUID) using the Node.js crypto module.
 */
export class NodeUUIDProvider {
  /**
   * Generates a random UUID.
   *
   * @returns {string} A string representing the generated UUID.
   */
  static generate(): string {
    log({ provider: 'NodeUUIDProvider', message: 'Generating UUID' })
    const uuid = crypto.randomUUID()
    log({
      provider: 'NodeUUIDProvider',
      message: 'UUID generated',
      context: 'generate',
    })
    return uuid
  }
}
