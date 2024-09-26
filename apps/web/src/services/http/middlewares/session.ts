import { sessionProvider } from '@/services/session'
import { z } from 'zod'
import { http } from '..'
import { HttpResponseError } from '../implementation/errors'

/**
 * Middleware for validating the user session.
 *
 * This middleware ensures that a valid user session exists for the request.
 * It checks the presence of a user and a tenant in the session. If either is missing,
 * it throws an HttpResponseError with a status of 403 and a message indicating that
 * the user or tenant was not found.
 *
 * @returns An object containing the user and tenant from the session.
 */
export const sessionMiddleware = http.middleware({
  name: 'SessionMiddleware',
  summary: 'Validates the user session',
  tags: ['authentication', 'session'],
  schema: {
    cookies: z.object({
      session: z.string().optional(),
    }),
  },
  handler: async () => {
    const session = await sessionProvider.getApplicationSession()

    if (!session.user || !session.tenant) {
      throw new HttpResponseError({
        status: 403,
        message: 'User or tenant not found',
      })
    }

    return {
      user: session.user,
      tenant: session.tenant,
    }
  },
})
