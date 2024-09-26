import {
  error as errorLog,
  log,
  shared,
  Tenant,
  TenantSubscription,
} from '@app/shared'
import { isValidUUID } from '@app/shared/src/@helpers/is-valid-uuid'
import { User } from '@app/shared/src/@modules/domain/entities/User'
import { getServerSession } from 'next-auth'
import { cookies } from 'next/headers'
import { authOptions } from '../../auth/config'
import { ApplicationSession, SessionProvider } from './types'

/**
 * Session class implements the SessionProvider interface to manage user sessions.
 */
export class Session implements SessionProvider {
  /**
   * Retrieves the application session including the user and tenant.
   *
   * @returns A promise that resolves to the ApplicationSession object.
   */
  async getApplicationSession(): Promise<ApplicationSession> {
    log({
      provider: 'SessionProvider',
      message: 'Retrieving application session',
    })
    const user = await this.getCurrentUser()
    const tenant = user ? await this.getCurrentTenant(user) : null

    return {
      user,
      tenant,
    }
  }

  /**
   * Fetches the current user from the session.
   *
   * @returns A promise that resolves to the User object or null if not found.
   */
  async getCurrentUser(): Promise<User | null> {
    log({
      provider: 'SessionProvider',
      message: 'Fetching current user from session',
    })
    const session = await getServerSession(authOptions)
    return (session?.user as User) || null
  }

  /**
   * Retrieves the current tenant based on the user and tenant ID from cookies.
   *
   * @param user - The User object.
   * @returns A promise that resolves to the TenantModel object or null if not found.
   */
  async getCurrentTenant(
    user: User,
  ): Promise<(Tenant & { subscription: TenantSubscription }) | null> {
    log({
      provider: 'SessionProvider',
      message: 'Retrieving current tenant based on user and tenant ID',
    })
    const tenantId = cookies().get('x-tenant')?.value

    if (tenantId && user && isValidUUID(tenantId)) {
      return await this.fetchTenantData(tenantId, user.id)
    }

    return null
  }

  /**
   * Finds the first valid tenant ID from the user's memberships.
   *
   * @param user - The User object.
   * @returns The first valid tenant ID or null if not found.
   */
  getFirstValidTenant(user: User): string | null {
    log({
      provider: 'SessionProvider',
      message: "Finding the first valid tenant ID from user's memberships",
    })
    return user.memberships[0]?.tenant.id &&
      isValidUUID(user.memberships[0].tenant.id)
      ? user.memberships[0].tenant.id
      : null
  }

  /**
   * Fetches tenant data including subscription based on tenant ID and user ID.
   *
   * @param tenantId - The tenant ID.
   * @param userId - The user ID.
   * @returns A promise that resolves to the TenantModel object or null if not found.
   */
  async fetchTenantData(
    tenantId: string,
    userId: string,
  ): Promise<(Tenant & { subscription: TenantSubscription }) | null> {
    log({
      provider: 'SessionProvider',
      message: 'Fetching tenant data including subscription',
      data: { tenantId, userId },
    })
    try {
      const membership =
        await shared.usecases.membership.getMembershipOnTenant.execute(
          tenantId,
          userId,
        )
      if (!membership) {
        errorLog({
          provider: 'SessionProvider',
          message: 'No membership found for tenantId and userId',
          data: { tenantId, userId },
        })
        return null
      }

      const tenantData = await shared.usecases.tenant.getTenant.execute(
        tenantId,
        userId,
      )
      if (!tenantData) {
        errorLog({
          provider: 'SessionProvider',
          message: 'No tenant data found for tenantId and userId',
          data: { tenantId, userId },
        })
        return null
      }

      return tenantData
    } catch (error) {
      errorLog({
        provider: 'SessionProvider',
        message: 'Error fetching tenant data for tenantId and userId',
        data: { tenantId, userId },
      })
      return null
    }
  }
}
