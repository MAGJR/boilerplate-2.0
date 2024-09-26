import { PrismaClient } from '@prisma/client'

/**
 * Abstract base class for repositories.
 * Provides a common structure and basic functionality for all repositories.
 */
export abstract class CoreRepository<T> {
  protected prisma: PrismaClient

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient
  }

  /**
   * Convert entity data for saving to the database.
   * This method can be used to implement JsonParserProvider as an extension.
   * @param data The entity data to be saved.
   */
  protected async toSave(data: Partial<T>): Promise<Partial<T>> {
    return data
  }

  /**
   * Convert entity data read from the database to the application format.
   * This method can be used to implement JsonParserProvider as an extension.
   * @param data The entity data read from the database.
   */
  protected toRead(data: T): T {
    return data
  }
}
