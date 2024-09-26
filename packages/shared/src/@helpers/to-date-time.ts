/**
 * Converts a Unix timestamp (in seconds) to a Date object.
 *
 * This function takes a Unix timestamp in seconds as input, sets it as the seconds value of a Date object starting from the Unix epoch time, and returns the resulting Date object.
 *
 * @param {number} secs - The Unix timestamp in seconds to be converted.
 * @returns {Date} The Date object representing the converted Unix timestamp.
 */
export const toDateTime = (secs: number | undefined | null) => {
  if (!secs) return undefined

  const t = new Date('1970-01-01T00:30:00Z') // Unix epoch start.
  t.setSeconds(secs)
  return t
}
