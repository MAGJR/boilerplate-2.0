export class QuotaExceededError extends Error {
  constructor(feature: string) {
    super(`Quota exceeded for feature: ${feature}`)
    this.name = 'QuotaExceededError'
  }
}
