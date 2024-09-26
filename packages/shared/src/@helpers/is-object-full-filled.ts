/**
 * Checks if an object is fully filled, meaning all its properties have a value.
 *
 * @param {T} obj - The object to check.
 * @param {(keyof T)[]} ignore - An array of keys to ignore during the check.
 * @returns {boolean} Returns true if the object is fully filled, false otherwise.
 */
export function isObjectFullFilled<T>(
  obj: T,
  ignore: (keyof T)[] = [],
): boolean {
  if (typeof obj !== 'object' || obj === null) return false
  const keys = Object.keys(obj) as (keyof T)[]
  if (keys.length === 0) return false

  return keys.every(
    (key) =>
      ignore.includes(key) ||
      (obj[key] !== null && obj[key] !== undefined && obj[key] !== ''),
  )
}
