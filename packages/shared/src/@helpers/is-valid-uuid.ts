/**
 * Validates if the provided string is a valid UUID.
 *
 * This function checks if the provided string matches the standard UUID format.
 * It uses a regular expression to match the pattern of a valid UUID.
 *
 * @param {string} uuid - The string to be validated as a UUID.
 * @returns {boolean} Returns true if the string is a valid UUID, false otherwise.
 */
export function isValidUUID(uuid: string): boolean {
  const regexExp =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return regexExp.test(uuid)
}
