/**
 * Represents an error that occurs during an HTTP response.
 *
 * @property {number} status - The HTTP status code of the error.
 * @property {any} data - Optional data related to the error.
 */
export class HttpResponseError extends Error {
  status: number
  data: any

  /**
   * Constructs a new HttpResponseError instance.
   *
   * @param {Object} input - The input object containing the error details.
   * @param {number} input.status - The HTTP status code of the error.
   * @param {string} input.message - The error message.
   * @param {any} [input.data] - Optional data related to the error.
   */
  constructor(input: { status: number; message: string; data?: any }) {
    super(input.message)
    this.status = input.status
    this.data = input.data
    this.name = 'HttpResponseError'
    Object.setPrototypeOf(this, HttpResponseError.prototype)
  }
}
