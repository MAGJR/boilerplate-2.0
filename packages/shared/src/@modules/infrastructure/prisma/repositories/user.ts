import {
  DeepPartial,
  JsonParserDateObject,
} from '@app/db/prisma/utils/json-parser'
import { PrismaClient } from '@prisma/client'
import {
  UserMetadata,
  userMetadataDefault,
  userMetadataSchema,
} from '../../../../@data/schemas/user.schema'
import { User } from '../../../domain/entities/User'
import { CoreRepository } from '../../../interfaces/core/repository'
import {
  IUserRepository,
  UpdateUserDTO,
} from '../../../interfaces/repositories/user'

/**
 * Implements the IUserRepository interface to interact with the database for user operations.
 */
export class PrismaUserRepository
  extends CoreRepository<User>
  implements IUserRepository
{
  protected prisma: PrismaClient

  /**
   * Initializes the PrismaUserRepository with a PrismaClient instance.
   * @param prisma The PrismaClient instance to use for database operations.
   */
  constructor(prisma: PrismaClient) {
    super(prisma)
    this.prisma = prisma
  }

  /**
   * Retrieves a unique user by its ID from the database.
   * @param id The ID of the user to be retrieved.
   * @returns A Promise that resolves to the User entity if found, or throws an error if not found.
   */
  async getById(id: string): Promise<User> {
    if (!id) {
      throw new Error('User ID is required')
    }
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        memberships: {
          include: {
            tenant: true,
          },
        },
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return this.toRead(user)
  }

  /**
   * Retrieves a unique user by its username from the database.
   * @param username The username of the user to be retrieved.
   * @returns A Promise that resolves to the User entity if found, or throws an error if not found.
   */
  async getByUsername(username: string): Promise<User> {
    if (!username) {
      throw new Error('Username is required')
    }
    const user = await this.prisma.user.findFirst({
      where: { username },
      include: {
        memberships: {
          include: {
            tenant: true,
          },
        },
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return this.toRead(user)
  }

  /**
   * Updates an existing user in the database.
   * @param id The ID of the user to be updated.
   * @param data The partial data for the user to be updated.
   * @returns A Promise that resolves to the updated User entity.
   */
  async update(id: string, data: DeepPartial<UpdateUserDTO>): Promise<User> {
    if (!id) {
      throw new Error('User ID is required')
    }
    const userData = await this.toSave(data as Partial<User>)

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: userData.name,
        username: userData.username,
        image: userData.image,
        settings: userData.settings as UserMetadata,
      },
    })

    return this.toRead(updatedUser)
  }

  /**
   * Converts entity data for saving to the database.
   * @param data The entity data to be saved.
   * @returns The converted data ready for database insertion.
   */
  protected async toSave(data: Partial<User>): Promise<Partial<User>> {
    let currentUser
    if (data.id) {
      currentUser = await this.prisma.user.findUnique({
        where: { id: data.id },
        select: { settings: true },
      })
    }

    const parsedSettings = JsonParserDateObject.parse({
      schema: userMetadataSchema,
      data: {
        default: userMetadataDefault,
        current: currentUser?.settings as UserMetadata,
        upsert: data.settings as UserMetadata,
      },
    })

    return {
      name: data.name,
      username: data.username,
      image: data.image,
      settings: parsedSettings.success
        ? parsedSettings.data
        : userMetadataDefault,
    }
  }

  /**
   * Converts entity data read from the database to the application format.
   * @param model The entity data read from the database.
   * @returns The converted User domain entity.
   */
  protected toRead(model: any): User {
    const parsedSettings = JsonParserDateObject.parse({
      schema: userMetadataSchema,
      data: {
        default: userMetadataDefault,
        current: model.settings as UserMetadata,
      },
    })

    return {
      id: model.id as string,
      email: model.email,
      name: model.name,
      image: model.image,
      emailVerified: model.emailVerified,
      username: model.username,
      settings: parsedSettings.success
        ? parsedSettings.data
        : userMetadataDefault,
      memberships: model.memberships,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
}
