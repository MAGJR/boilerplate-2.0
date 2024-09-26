import { APP_CONFIGS } from '../boilerplate.config'

/**
 * Constructs a URL using the base URL from the application configuration and the provided path.
 *
 * @param {string} path - The path to be appended to the base URL. If not provided, the base URL is returned.
 * @returns {string} The constructed URL.
 */
export function getUrl(path?: string) {
  const baseUrl = APP_CONFIGS.url

  if (path && !path.startsWith('/')) {
    path = `/${path}`
  }

  return `${baseUrl}${path || ''}`
}
