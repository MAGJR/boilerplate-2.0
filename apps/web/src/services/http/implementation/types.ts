/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-use-before-define */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Represents a schema definition for a given type.
 *
 * @template T - The type of the schema.
 */
export type SchemaDefinition<T> = z.ZodType<T>

/**
 * Defines the structure of API schemas.
 *
 * @property body? - The schema for the request body.
 * @property query? - The schema for the query parameters.
 * @property params? - The schema for the URL parameters.
 * @property headers? - The schema for the request headers.
 * @property cookies? - The schema for the request cookies.
 */
export interface ApiSchemas {
  body?: SchemaDefinition<any>
  query?: SchemaDefinition<any>
  params?: SchemaDefinition<any>
  headers?: SchemaDefinition<any>
  cookies?: SchemaDefinition<any>
}

/**
 * Infers the type of a schema definition.
 *
 * @template S - The schema definition.
 * @returns The type of the schema definition.
 */
export type InferSchemaType<S> = S extends SchemaDefinition<infer T> ? T : never

/**
 * Represents the context of an API request.
 *
 * @template T - The API schemas.
 * @property [K in keyof T as T[K] extends z.ZodType<any> ? K : never] - The context properties.
 */
export type ApiContext<T extends ApiSchemas> = {
  [K in keyof T as T[K] extends z.ZodType<any>
    ? K
    : never]: T[K] extends z.ZodType<any> ? z.infer<T[K]> : never
}

/**
 * Represents an API response.
 *
 * @property json - Creates a JSON response.
 * @property error - Creates an error response.
 */
export interface ApiResponse {
  json: <T>(data: T, status?: number) => NextResponse<T>
  error: (message: string, status: number) => NextResponse<{ error: string }>
}

/**
 * Represents metadata for a middleware.
 *
 * @property name - The name of the middleware.
 * @property summary? - A summary of the middleware.
 * @property description? - A description of the middleware.
 * @property tags? - Tags associated with the middleware.
 */
export interface MiddlewareMetadata {
  name: string
  summary?: string
  description?: string
  tags?: string[]
}

/**
 * Infers the context of a schema.
 *
 * @template TSchema - The schema.
 * @returns The context of the schema.
 */
export type InferSchemaContext<TSchema extends ApiSchemas> = {
  [K in keyof TSchema as TSchema[K] extends z.ZodTypeAny
    ? K
    : never]: TSchema[K] extends z.ZodTypeAny ? z.infer<TSchema[K]> : never
}

/**
 * Represents a middleware definition.
 *
 * @template TSchema - The schema of the middleware.
 * @template TExtension - The extension of the middleware.
 * @template TTiming - The timing of the middleware (before or after).
 * @property schema? - The schema of the middleware.
 * @property handler - The handler function of the middleware.
 * @property timing? - The timing of the middleware.
 */
export interface MiddlewareDefinition<
  TSchema extends ApiSchemas,
  TExtension extends object,
  TTiming extends 'before' | 'after' = 'before',
> extends MiddlewareMetadata {
  schema?: TSchema
  handler: MiddlewareHandler<TSchema, TExtension, TTiming>
  timing?: TTiming
}

/**
 * Infers the context of a schema.
 *
 * @template TSchema - The schema.
 * @returns The context of the schema.
 */
export type InferContext<TSchema extends ApiSchemas> = {
  [K in keyof TSchema as TSchema[K] extends z.ZodTypeAny
    ? K
    : never]: TSchema[K] extends z.ZodTypeAny ? z.infer<TSchema[K]> : never
}

/**
 * Infers the context of a middleware definition.
 *
 * @template T - The middleware definition.
 * @returns The context of the middleware definition.
 */
export type InferMiddlewareContext<
  T extends MiddlewareDefinition<any, any, any>,
> = T extends MiddlewareDefinition<
  infer TSchema,
  infer TExtension,
  infer TTiming
>
  ? TTiming extends 'before'
    ? InferContext<TSchema> & TExtension
    : InferContext<TSchema>
  : {}

/**
 * Represents a middleware handler function.
 *
 * @template TSchema - The schema of the middleware.
 * @template TExtension - The extension of the middleware.
 * @template TTiming - The timing of the middleware (before or after).
 * @param req - The Next.js request object.
 * @param context - The context of the middleware.
 * @returns A promise that resolves to the extension or void.
 */
export type MiddlewareHandler<
  TSchema extends ApiSchemas,
  TExtension extends object,
  TTiming extends 'before' | 'after' = 'before',
> = (
  req: NextRequest,
  context: InferContext<TSchema>,
) => TTiming extends 'before'
  ? Promise<TExtension | void> | TExtension | void
  : Promise<void> | void

/**
 * Represents a middleware function.
 *
 * @template TContext - The context of the middleware.
 * @param req - The Next.js request object.
 * @param context - The context of the middleware.
 * @returns A promise that resolves to void.
 */
export type Middleware<TContext extends object> = (
  req: NextRequest,
  context: TContext,
) => Promise<void> | void

/**
 * Represents an API handler function.
 *
 * @template TContext - The context of the API handler.
 * @param req - The Next.js request object.
 * @param res - The API response object.
 * @param context - The context of the API handler.
 * @param params - The route parameters.
 * @returns A promise that resolves to a NextResponse.
 */
export type ApiHandler<TContext> = (
  req: NextRequest,
  res: ApiResponse,
  context: TContext & { params: Record<string, string> },
) => Promise<NextResponse>

/**
 * Represents an HTTP method.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * Represents metadata for a route.
 *
 * @property name - The name of the route.
 * @property summary - A summary of the route.
 * @property description? - A description of the route.
 * @property tags? - Tags associated with the route.
 */
export interface RouteMetadata {
  name: string
  summary: string
  description?: string
  tags?: string[]
}

/**
 * Represents the combined context of a route and its middlewares.
 *
 * @template TRouteContext - The context of the route.
 * @template TMiddlewares - The middlewares.
 * @returns The combined context.
 */
export type CombinedContext<
  TRouteContext extends object,
  TMiddlewares extends MiddlewareDefinition<any, any, any>[],
> = TRouteContext &
  UnionToIntersection<InferMiddlewareContext<TMiddlewares[number]>>

/**
 * Represents options for a route.
 *
 * @template TSchema - The schema of the route.
 * @template TBeforeMiddlewares - The before middlewares of the route.
 * @template TAfterMiddlewares - The after middlewares of the route.
 * @template TRouteContext - The context of the route.
 * @property schema - The schema of the route.
 * @property beforeMiddlewares? - The before middlewares of the route.
 * @property afterMiddlewares? - The after middlewares of the route.
 * @property handler - The handler function of the route.
 */
export interface RouteOptions<
  TSchema extends ApiSchemas,
  TBeforeMiddlewares extends MiddlewareDefinition<any, any, 'before'>[],
  TAfterMiddlewares extends MiddlewareDefinition<any, any, 'after'>[],
  TRouteContext extends object,
> extends RouteMetadata {
  schema: TSchema
  beforeMiddlewares?: TBeforeMiddlewares
  afterMiddlewares?: TAfterMiddlewares
  handler: ApiHandler<CombinedContext<TRouteContext, TBeforeMiddlewares>>
}

/**
 * Extends a context with additional properties.
 *
 * @template TContext - The original context.
 * @template TExtension - The extension.
 * @returns The extended context.
 */
export type ExtendContext<TContext, TExtension> = TContext & TExtension

/**
 * Converts a union type to an intersection type.
 *
 * @template U - The union type to convert.
 */
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never
