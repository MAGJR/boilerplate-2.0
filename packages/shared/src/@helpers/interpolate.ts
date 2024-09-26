import * as lodash from 'lodash'

/**
 * Interpolates a template string with the provided data.
 *
 * @param {string} text - The template string to be interpolated.
 * @param {Record<string, any>} data - The data to be used for interpolation.
 * @returns {(string | undefined)} The interpolated string or undefined if the input text is empty.
 */
export function interpolate(
  text: string,
  data: Record<string, any>,
): string | undefined {
  if (!text) return undefined
  lodash.templateSettings.interpolate = /{{([\s\S]+?)}}/g
  return lodash.template(text)(data)
}

/**
 * Recursively interpolates a template object with the provided data.
 *
 * @param {Record<string, any>} template - The template object to be interpolated.
 * @param {Record<string, any>} data - The data to be used for interpolation.
 * @returns {Record<string, any>} The interpolated object.
 */
export function interpolateObject(
  template: Record<string, any>,
  data: Record<string, any>,
): Record<string, any> {
  const result: Record<string, any> = {}
  if (!template || Object.keys(template).length === 0) return result

  Object.keys(template).forEach((key) => {
    const value = template[key]
    if (typeof value === 'string') {
      result[key] = interpolate(value.trim(), data)
    } else if (typeof value === 'object' && value !== null) {
      result[key] = interpolateObject(value as Record<string, any>, data)
    } else {
      result[key] = value
    }
  })

  return result
}
