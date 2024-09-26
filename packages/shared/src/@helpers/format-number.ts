/**
 * Formats a given number into a string using the 'en-us' locale and minimumFractionDigits set to 0.
 * This function is useful for formatting numbers in a way that is easily readable by humans.
 *
 * @param {number} unformattedNumber - The number to be formatted.
 * @returns {string} The formatted number as a string.
 */
export function formatNumber(unformattedNumber: number): string {
  const intl = new Intl.NumberFormat('en-us', { minimumFractionDigits: 0 })
  return intl.format(unformattedNumber)
}
