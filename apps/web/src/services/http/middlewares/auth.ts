import { shared } from '@app/shared'
import { z } from 'zod'
import { http } from '..'
import { HttpResponseError } from '../implementation/errors'

/**
 * Middleware for authenticating requests.
 *
 * This middleware validates the presence and format of the authorization token in the request headers.
 * It also verifies the token's validity by fetching the associated tenant and subscription.
 * If any part of the validation fails, it throws an HttpResponseError with a status of 403 and a descriptive message.
 *
 * @returns An object containing the tenant and its subscription.
 */
export const authMiddleware = http.middleware({
  name: 'AuthMiddleware',
  summary: 'Validates the authorization token for the tenant',
  tags: ['authentication', 'security'],
  schema: {
    headers: z.object({
      Authorization: z.string(),
    }),
  },
  handler: async (req, context) => {
    const token = context.headers.Authorization

    if (!token) {
      throw new HttpResponseError({
        status: 403,
        message: 'Authorization token is missing',
      })
    }

    const tokenParts = token.split(' ')

    if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== 'bearer') {
      throw new HttpResponseError({
        status: 403,
        message: 'Invalid authorization token format',
      })
    }

    const authToken = tokenParts[1]

    const tenant =
      await shared.usecases.tenant.getTenantByExternalApiToken.execute(
        authToken,
      )

    if (!tenant || !tenant.id) {
      throw new HttpResponseError({
        status: 403,
        message: 'Authorization token is invalid',
      })
    }

    return {
      tenant,
    }
  },
})
