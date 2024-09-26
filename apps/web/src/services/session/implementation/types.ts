import { Tenant, TenantSubscription } from '@app/shared'
import { User } from '@app/shared/src/@modules/domain/entities/User'

/**
 * Interface for the application session.
 */
export interface ApplicationSession {
  user: User | null
  tenant: (Tenant & { subscription: TenantSubscription }) | null
}

/**
 * Interface for the session provider.
 */
export interface SessionProvider {
  /**
   * Retrieves the application session.
   */
  getApplicationSession(): Promise<ApplicationSession>
  /**
   * Fetches the current user.
   */
  getCurrentUser(): Promise<User | null>
  /**
   * Retrieves the current tenant based on the user.
   */
  getCurrentTenant(
    user: User,
  ): Promise<(Tenant & { subscription: TenantSubscription }) | null>
  /**
   * Finds the first valid tenant ID from the user's memberships.
   */
  getFirstValidTenant(user: User): string | null
  /**
   * Fetches tenant data including subscription based on tenant ID and user ID.
   */
  fetchTenantData(
    tenantId: string,
    userId: string,
  ): Promise<(Tenant & { subscription: TenantSubscription }) | null>
}
