import { HttpRouter } from './implementation/provider'

/**
 * Initializes the HTTP router with a log middleware.
 *
 * This module sets up the HTTP router singleton instance and adds a log middleware to it.
 * The log middleware is responsible for logging requests and responses.
 *
 * @returns {HttpRouter} The singleton instance of the HTTP router.
 */
const http = HttpRouter.getInstance()

export { http }
