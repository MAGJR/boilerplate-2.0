import { http } from '@/services/http'
import { sessionMiddleware } from '@/services/http/middlewares/session'
import { shared } from '@app/shared'
import { z } from 'zod'

/**
 * Defines the POST route for uploading a file to storage.
 *
 * This route is responsible for handling the upload of a file to the specified storage context and id.
 * It ensures the session middleware is applied and validates the request parameters and body.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Object} context - The context object containing request parameters.
 *
 * @returns {Promise} A promise that resolves to the response.
 */
export const POST = http.post({
  name: 'uploadFile',
  summary: 'Uploads a file to storage',
  description: 'Uploads a file to the specified storage context and id',
  tags: ['storage'],
  beforeMiddlewares: [sessionMiddleware],
  schema: {
    body: z.object({
      file: z.instanceof(File),
    }),
    params: z.object({
      context: z.enum(['tenants', 'users', 'shared']),
      id: z.string(),
    }),
  },
  handler: async (req, res, context) => {
    const { context: storageContext, id } = context.params
    const form = await req.formData()
    const file = form.get('file') as File

    if (!file) {
      return res.json({ error: 'File is required' }, 400)
    }

    const path = await shared.provider.storage.upload(storageContext, id, file)
    return res.json({ path })
  },
})
