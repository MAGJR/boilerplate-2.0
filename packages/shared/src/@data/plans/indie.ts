import { Plan } from '../../@modules/types/boilerplate.plan'

/**
 * Represents the Indie plan in the application.
 * @implements {Plan}
 */
export class IndiePlan implements Plan {
  /**
   * Unique identifier for the Indie plan.
   */
  key = 'indie'
  /**
   * Display name for the Indie plan.
   */
  name = 'Indie'
  /**
   * Brief description of the Indie plan.
   */
  description = 'Priority support for growing businesses.'

  /**
   * Metadata describing the features of the Indie plan.
   */
  metadata = {
    /**
     * Indicates if email support is available.
     */
    EMAIL_SUPPORT: 'true',
    /**
     * Indicates if priority support is available.
     */
    PRIORITY_SUPPORT: 'true',
    /**
     * Indicates if integrations are supported.
     */
    INTEGRATIONS: 'true',
    /**
     * Number of team members allowed.
     */
    TEAM_MEMBERS: '4',
  }

  /**
   * Array of pricing options for the Indie plan.
   */
  prices = [
    {
      /**
       * Monthly recurring payment details.
       */
      recurring: {
        interval: 'month' as const,
      },
      /**
       * Currency for the price.
       */
      currency: 'usd',
      /**
       * Price amount in cents.
       */
      unit_amount: 2900,
    },
    {
      /**
       * Yearly recurring payment details.
       */
      recurring: {
        interval: 'year' as const,
      },
      /**
       * Currency for the price.
       */
      currency: 'usd',
      /**
       * Price amount in cents.
       */
      unit_amount: 29000,
    },
  ]
}
