/**
 * Masks a token by showing the first 6 characters and the last 4 characters.
 *
 * @param {string} token - The token to be masked.
 * @returns {string} The masked token.
 */
export function maskToken(token: string): string {
  return token.slice(0, 6) + '...' + token.slice(-4)
}
