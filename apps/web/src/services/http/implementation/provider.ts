import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  ApiResponse,
  ApiSchemas,
  CombinedContext,
  HttpMethod,
  InferContext,
  InferMiddlewareContext,
  MiddlewareDefinition,
  RouteOptions,
  UnionToIntersection,
} from './types'

/**
 * HttpRouter class for handling HTTP routes and middleware.
 * Implemented as a singleton to ensure only one instance exists.
 *
 * @example
 * const router = HttpRouter.getInstance();
 *
 * // Define a GET route
 * router.get({
 *   name: 'getUser',
 *   schema: {
 *     query: z.object({ id: z.string() })
 *   },
 *   handler: async (req, res, context) => {
 *     const { id } = context.query;
 *     // Fetch user logic here
 *     return res.json({ id, name: 'John Doe' });
 *   }
 * });
 */
export class HttpRouter {
  // eslint-disable-next-line no-use-before-define
  private static instance: HttpRouter | null = null
  private routes: Map<string, RouteOptions<ApiSchemas, any, any, any>> =
    new Map()

  private beforeMiddlewares: MiddlewareDefinition<any, any>[] = []
  private afterMiddlewares: MiddlewareDefinition<any, any>[] = []

  private constructor() {}

  /**
   * Gets the singleton instance of HttpRouter.
   *
   * @returns {HttpRouter} The singleton instance of HttpRouter.
   */
  public static getInstance(): HttpRouter {
    if (!HttpRouter.instance) {
      HttpRouter.instance = new HttpRouter()
    }
    return HttpRouter.instance
  }

  /**
   * Adds a global middleware to be applied to all routes.
   *
   * @param {MiddlewareDefinition<any, any>} middleware - The middleware to be added globally.
   * @returns {void}
   *
   * @example
   * const loggingMiddleware = http.middleware({
   *   name: 'logging',
   *   handler: async (req, context) => {
   *     console.log(`Request received: ${req.method} ${req.url}`);
   *     return {};
   *   }
   * });
   *
   * http.use(loggingMiddleware);
   */
  public use(middleware: MiddlewareDefinition<any, any>): void {
    if (middleware.timing === 'before') {
      this.beforeMiddlewares.push(middleware)
    } else {
      this.afterMiddlewares.push(middleware)
    }
  }

  /**
   * Creates an ApiResponse object with json and error methods.
   *
   * @returns {ApiResponse} An object with json and error methods for creating responses.
   *
   * @example
   * const response = this.createResponse();
   * return response.json({ success: true }, 200);
   * // or
   * return response.error('Not found', 404);
   */
  private createResponse(): ApiResponse {
    return {
      json: <T>(data: T, status: number = 200) => {
        return NextResponse.json(data, { status })
      },
      error: (message: string, status: number = 400) => {
        return NextResponse.json({ error: message }, { status })
      },
    }
  }

  /**
   * Creates a middleware function.
   *
   * @template TSchema - The schema type for the middleware.
   * @template TExtension - The extension type for the middleware.
   * @param {MiddlewareDefinition<TSchema, TExtension>} options - The middleware options.
   * @returns {MiddlewareDefinition<TSchema, TExtension>} The middleware function.
   *
   * @example
   * const authMiddleware = http.middleware({
   *   name: 'auth',
   *   handler: async (req, context) => {
   *     // Authentication logic here
   *     return { user: { id: '123', name: 'John' } };
   *   }
   * });
   */
  public middleware = <TSchema extends ApiSchemas, TExtension extends object>(
    options: MiddlewareDefinition<TSchema, TExtension>,
  ): MiddlewareDefinition<TSchema, TExtension> => {
    return options
  }

  /**
   * Creates an HTTP method handler.
   *
   * @param {HttpMethod} method - The HTTP method (GET, POST, etc.).
   * @returns {Function} A function that creates a route handler for the specified method.
   *
   * @example
   * const getHandler = this.createHttpMethod('GET');
   * const getUserRoute = getHandler({
   *   name: 'getUser',
   *   schema: { query: z.object({ id: z.string() }) },
   *   handler: async (req, res, context) => {
   *     // Handler logic here
   *   }
   * });
   */
  private createHttpMethod = (method: HttpMethod) => {
    return <
      TSchema extends ApiSchemas,
      TBeforeMiddlewares extends MiddlewareDefinition<
        any,
        any,
        'before'
      >[] = [],
      TAfterMiddlewares extends MiddlewareDefinition<any, any, 'after'>[] = [],
      TRouteContext extends Record<string, unknown> = InferContext<TSchema> &
        UnionToIntersection<InferMiddlewareContext<TBeforeMiddlewares[number]>>,
    >(
      options: RouteOptions<
        TSchema,
        TBeforeMiddlewares,
        TAfterMiddlewares,
        TRouteContext
      >,
    ) => {
      const routeKey = `${method}:${options.name}`
      this.routes.set(routeKey, options)

      return async (
        req: NextRequest,
        context: { params: Record<string, string> },
      ) => {
        const res = this.createResponse()

        try {
          const handlerContext: any = { ...context }

          // Parse query parameters
          if (options.schema?.query) {
            const searchParams = Object.fromEntries(req.nextUrl.searchParams)
            handlerContext.query =
              await options.schema.query.parseAsync(searchParams)
          }

          // Parse request body for non-GET requests
          if (method !== 'GET') {
            const contentType = req.headers.get('content-type') || ''
            if (
              !contentType.includes('multipart/form-data') &&
              options.schema?.body
            ) {
              // Handle JSON body with schema
              try {
                const body = await req.json()
                handlerContext.body = await options.schema.body.parseAsync(body)
              } catch (error) {
                console.error('Error processing request body:', error)
                return res.json({ error: 'Invalid request body' }, 400)
              }
            }
          }

          // Parse route parameters
          if (options.schema?.params) {
            handlerContext.params = await options.schema.params.parseAsync(
              context.params,
            )
          }

          // Apply before global middlewares
          for (const middleware of this.beforeMiddlewares) {
            const result = await middleware.handler(req, handlerContext)
            if (result) {
              Object.assign(handlerContext, result)
            }
          }

          // Apply route-specific before middlewares
          if (options.beforeMiddlewares) {
            for (const middleware of options.beforeMiddlewares) {
              const result = await middleware.handler(req, handlerContext)
              if (result) {
                Object.assign(handlerContext, result)
              }
            }
          }

          // Execute the main handler
          const handlerResult = await options.handler(
            req,
            res,
            handlerContext as CombinedContext<
              TRouteContext,
              TBeforeMiddlewares
            > & {
              params: Record<string, string>
            },
          )

          // Apply route-specific after middlewares
          if (options.afterMiddlewares) {
            for (const middleware of options.afterMiddlewares) {
              await middleware.handler(req, handlerContext)
            }
          }

          // Apply after global middlewares
          for (const middleware of this.afterMiddlewares) {
            await middleware.handler(req, handlerContext)
          }

          return handlerResult
        } catch (error) {
          console.error('Error in route handler:', error)

          if (error instanceof z.ZodError) {
            return res.error('Validation error: ' + error.message, 400)
          }

          if (error instanceof Error) {
            return res.error(error.message, 500)
          }

          return res.error('An unexpected error occurred', 500)
        }
      }
    }
  }

  /**
   * Creates a GET route handler.
   *
   * @type {ReturnType<HttpRouter['createHttpMethod']>}
   *
   * @example
   * http.get({
   *   name: 'getUser',
   *   schema: { query: z.object({ id: z.string() }) },
   *   handler: async (req, res, context) => {
   *     const { id } = context.query;
   *     return res.json({ id, name: 'John Doe' });
   *   }
   * });
   */
  public get = this.createHttpMethod('GET')

  /**
   * Creates a POST route handler.
   *
   * @type {ReturnType<HttpRouter['createHttpMethod']>}
   *
   * @example
   * http.post({
   *   name: 'createUser',
   *   schema: { body: z.object({ name: z.string() }) },
   *   handler: async (req, res, context) => {
   *     const { name } = context.body;
   *     return res.json({ id: '123', name }, 201);
   *   }
   * });
   */
  public post = this.createHttpMethod('POST')

  /**
   * Creates a PUT route handler.
   *
   * @type {ReturnType<HttpRouter['createHttpMethod']>}
   *
   * @example
   * http.put({
   *   name: 'updateUser',
   *   schema: {
   *     params: z.object({ id: z.string() }),
   *     body: z.object({ name: z.string() })
   *   },
   *   handler: async (req, res, context) => {
   *     const { id } = context.params;
   *     const { name } = context.body;
   *     return res.json({ id, name, updated: true });
   *   }
   * });
   */
  public put = this.createHttpMethod('PUT')

  /**
   * Creates a DELETE route handler.
   *
   * @type {ReturnType<HttpRouter['createHttpMethod']>}
   *
   * @example
   * http.delete({
   *   name: 'deleteUser',
   *   schema: { params: z.object({ id: z.string() }) },
   *   handler: async (req, res, context) => {
   *     const { id } = context.params;
   *     return res.json({ id, deleted: true });
   *   }
   * });
   */
  public delete = this.createHttpMethod('DELETE')

  /**
   * Creates a PATCH route handler.
   *
   * @type {ReturnType<HttpRouter['createHttpMethod']>}
   *
   * @example
   * http.patch({
   *   name: 'partialUpdateUser',
   *   schema: {
   *     params: z.object({ id: z.string() }),
   *     body: z.object({ name: z.string().optional() })
   *   },
   *   handler: async (req, res, context) => {
   *     const { id } = context.params;
   *     const { name } = context.body;
   *     return res.json({ id, name, updated: true });
   *   }
   * });
   */
  public patch = this.createHttpMethod('PATCH')

  /**
   * Retrieves all registered routes.
   *
   * @returns {[string, RouteOptions<ApiSchemas, any, any>][]} An array of route entries.
   *
   * @example
   * const routes = http.getAllRoutes();
   * console.log(routes); // [['GET:getUser', {...}], ['POST:createUser', {...}], ...]
   */
  public getAllRoutes() {
    return Array.from(this.routes.entries())
  }
}
