import { authOptions } from '@/services/auth/config'
import { error as errorLog, log } from '@app/shared'
import { getServerSession, User } from 'next-auth'
import { cache } from 'react'
import { createActionClient } from '../implementations'

/**
 * The client object for the action service.
 * It is created using the createActionClient function and contains the context and onExecute functions.
 */
export const client = createActionClient({
  /**
   * The context function for the action service.
   * It is created using the createContext function.
   */
  context: cache(async () => {
    const session = await getServerSession(authOptions)
    return {
      user: session?.user as User | null,
    }
  }),
  /**
   * The onExecute function for the action service.
   * It is created using the createOnExecute function.
   */
  onExecute: async ({ error, action, context, type }) => {
    if (error) {
      errorLog({
        provider: 'TenantActionClient',
        message: 'Action execution error',
        data: {
          action,
          context: { user: context.user?.id },
          type,
        },
      })
    } else {
      log({
        provider: 'TenantActionClient',
        message: 'Action executed successfully',
        data: {
          action,
          context: { user: context.user?.id },
          type,
        },
      })
    }
  },
})
