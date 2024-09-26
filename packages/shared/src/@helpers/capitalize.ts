/**
 * Capitalizes the first letter of each word in a given string.
 *
 * @param {string} input - The input string to be capitalized.
 * @returns {string} The capitalized string.
 */
export function capitalize(input: string): string {
  return input.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())
}
