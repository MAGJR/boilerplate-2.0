/**
 * Converts a unit amount to a formatted currency string.
 *
 * This function takes a unit amount, a currency, and a locale as input, and returns a string representation of the unit amount in the specified currency and locale.
 * The unit amount is divided by 100 to convert it to a decimal value suitable for currency representation.
 * The function uses the `toLocaleString` method to format the unit amount as a currency string according to the specified locale.
 *
 * @param {number} unitAmount - The unit amount to be converted.
 * @param {string} [currency='USD'] - The currency code for the unit amount. Defaults to 'USD'.
 * @param {string} [locale='en-US'] - The locale to use for formatting the currency string. Defaults to 'en-US'.
 * @returns {string} A string representation of the unit amount in the specified currency and locale.
 */
export function parseUnitPrice(
  unitAmount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): string {
  unitAmount = unitAmount / 100

  return unitAmount.toLocaleString(locale, {
    style: 'currency',
    currency,
  })
}
