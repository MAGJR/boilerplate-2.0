// apps/web/src/services/http/utils/create-middleware.ts

import { NextRequest } from 'next/server'
import { ApiSchemas, MiddlewareDefinition } from '../implementation/types'

/**
 * Creates a middleware function based on the provided options.
 *
 * This function takes a MiddlewareDefinition object as an argument, which includes a handler function and an optional schema.
 * It returns a middleware function that can be used to handle NextRequest objects.
 *
 * The middleware function first parses and validates the request parts (headers, cookies, query, and body) based on the provided schema.
 * Then, it executes the handler function with the parsed and validated context.
 * Finally, it merges the result of the handler function into the context if the result is not undefined.
 *
 * @param options MiddlewareDefinition object containing the handler function and an optional schema.
 * @returns Middleware function that can be used to handle NextRequest objects.
 */
export function createMiddleware<
  TSchema extends ApiSchemas,
  TExtension extends object,
>(options: MiddlewareDefinition<TSchema, TExtension>) {
  const { handler, schema } = options

  return async (req: NextRequest, context: any) => {
    // Parse and validate middleware's schema
    let middlewareContext = {}
    if (schema) {
      middlewareContext = await parseAndValidateRequestPart(req, schema)
      Object.assign(context, middlewareContext)
    }

    // Execute middleware handler
    const result = await handler(req, context)

    // Merge context extension
    if (result) {
      Object.assign(context, result)
    }
  }
}

/**
 * Helper function to parse and validate request parts based on the provided schema.
 *
 * This function iterates over the schema properties (headers, cookies, query, and body) and parses/validates each part of the request accordingly.
 * It returns an object containing the parsed and validated parts of the request.
 *
 * @param req NextRequest object containing the request details.
 * @param schema ApiSchemas object defining the schema for parsing and validation.
 * @returns Object containing the parsed and validated parts of the request.
 */
export async function parseAndValidateRequestPart(
  req: NextRequest,
  schema: ApiSchemas,
): Promise<any> {
  const result: any = {}

  if (schema.headers) {
    result.headers = await schema.headers.parseAsync(
      Object.fromEntries(req.headers),
    )
  }
  if (schema.cookies) {
    result.cookies = await schema.cookies.parseAsync(
      Object.fromEntries(req.cookies),
    )
  }
  if (schema.query) {
    result.query = await schema.query.parseAsync(
      Object.fromEntries(req.nextUrl.searchParams),
    )
  }
  if (schema.body) {
    result.body = await schema.body.parseAsync(await req.json())
  }

  return result
}
