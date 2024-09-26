import { sessionProvider } from '@/services/session'
import { error as errorLog, log } from '@app/shared'
import { cache } from 'react'
import { createActionClient } from '../implementations'

/**
 * Creates and exports the client object for the user action service.
 *
 * This client object is created using the createActionClient function from '../lib'.
 * It is configured with the createContext function from './create-context' to handle context creation,
 * and the createOnExecute function from './create-on-execute' to handle execution errors.
 */
export const client = createActionClient({
  /**
   * The context function for the user action service.
   * It is created using the createContext function.
   */
  context: cache(async () => {
    const user = await sessionProvider.getCurrentUser()
    return {
      user,
    }
  }),
  /**
   * The onExecute function for the user action service.
   * It is created using the createOnExecute function.
   */
  onExecute: async ({ error, action, context, type }: any) => {
    if (error) {
      errorLog({
        provider: 'UserActionClient',
        message: 'Action execution error',
        data: {
          action,
          context: { user: context.user?.id },
          type,
        },
      })
    } else {
      log({
        provider: 'UserActionClient',
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
