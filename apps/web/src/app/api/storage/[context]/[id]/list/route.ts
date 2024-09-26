import { http } from '@/services/http'
import { sessionMiddleware } from '@/services/http/middlewares/session'
import { shared } from '@app/shared'
import { z } from 'zod'

/**
 * Defines the GET route for listing files in storage.
 *
 * This route is responsible for handling the listing of files from the specified storage context and id.
 * It ensures the session middleware is applied and validates the request parameters.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Object} context - The context object containing request parameters.
 *
 * @returns {Promise} A promise that resolves to the response.
 */
export const GET = http.get({
  name: 'listFiles',
  summary: 'Lists files in storage',
  description: 'Lists files in the specified storage context and id',
  tags: ['storage'],
  beforeMiddlewares: [sessionMiddleware],
  schema: {
    params: z.object({
      context: z.enum(['tenants', 'users', 'shared']),
      id: z.string(),
    }),
  },
  handler: async (req: any, res, context) => {
    const { context: storageContext, id } = context.params

    const files = await shared.provider.storage.listFiles(storageContext, id)
    return res.json({ files })
  },
})
