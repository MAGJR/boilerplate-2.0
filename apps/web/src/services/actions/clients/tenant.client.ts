import { sessionProvider } from '@/services/session'
import { error as errorLog, log } from '@app/shared'
import { cache } from 'react'
import { createActionClient } from '../implementations'

/**
 * Initializes and exports the client object for the tenant action service.
 *
 * This client object is constructed using the createActionClient function from '../lib'.
 * It is configured with the createContext function from './create-context' to manage context creation,
 * and the createOnExecute function from './create-on-execute' to manage execution errors.
 */
export const client = createActionClient({
  /**
   * The context function for the tenant action service.
   * It is constructed using the createContext function.
   */
  context: cache(async () => {
    const session = await sessionProvider.getApplicationSession()
    return session
  }),
  /**
   * The onExecute function for the tenant action service.
   * It is constructed using the createOnExecute function and includes logging for debugging actions.
   */
  onExecute: async ({ error, action, context, type }) => {
    if (error) {
      errorLog({
        provider: 'TenantActionClient',
        message: 'Action execution error',
        data: {
          action,
          context: { user: context.user.id, tenant: context.tenant?.id },
          type,
        },
      })
    } else {
      log({
        provider: 'TenantActionClient',
        message: 'Action executed successfully',
        data: {
          action,
          context: { user: context.user.id, tenant: context.tenant?.id },
          type,
        },
      })
    }
  },
})
