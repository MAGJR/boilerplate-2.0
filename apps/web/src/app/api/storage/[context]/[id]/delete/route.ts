import { http } from '@/services/http'
import { sessionMiddleware } from '@/services/http/middlewares/session'
import { shared } from '@app/shared'
import { z } from 'zod'

/**
 * Defines the DELETE route for deleting a file from storage.
 *
 * This route is responsible for handling the deletion of a file from the specified storage context and id.
 * It requires a path to the file in the request body and ensures the session middleware is applied.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 *
 * @returns {Promise} A promise that resolves to the response.
 */
export const DELETE = http.delete({
  name: 'deleteFile',
  summary: 'Deletes a file from storage',
  description: 'Deletes a file from the specified storage context and id',
  tags: ['storage'],
  beforeMiddlewares: [sessionMiddleware],
  schema: {
    body: z.object({
      path: z.string(),
    }),
  },
  handler: async (req: any, res, context) => {
    const { path } = context.body

    if (!path) {
      return res.json({ error: 'Path is required' }, 400)
    }

    await shared.provider.storage.delete(path)
    return res.json({ success: true })
  },
})
