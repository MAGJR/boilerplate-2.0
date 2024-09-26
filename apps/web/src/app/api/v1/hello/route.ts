import { http } from '@/services/http'
import { sessionMiddleware } from '@/services/http/middlewares/session'
import { z } from 'zod'

export const GET = http.get({
  name: 'createUser',
  summary: 'Create a new user',
  description: 'Creates a new user with the provided name and email',
  tags: ['users'],
  beforeMiddlewares: [sessionMiddleware],
  schema: {
    body: z.object({
      name: z.string(),
      email: z.string().email(),
    }),
  },
  handler: async (req, res, context) => {
    return res.json({
      message: 'User fetched successfully',
      user: context.user,
    })
  },
})
