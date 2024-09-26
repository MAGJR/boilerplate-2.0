import { Plan } from '../../@modules/types/boilerplate.plan'

/**
 * Represents the Free plan in the application.
 * @implements {Plan}
 */
export class FreePlan implements Plan {
  /**
   * Unique identifier for the Free plan.
   */
  key = 'free'
  /**
   * Display name for the Free plan.
   */
  name = 'Free'
  /**
   * Brief description of the Free plan.
   */
  description = 'Basic support for startups.'

  /**
   * Metadata describing the features of the Free plan.
   */
  metadata = {
    /**
     * Number of team members allowed.
     */
    TEAM_MEMBERS: '2',
    /**
     * Indicates if integrations are supported.
     */
    INTEGRATIONS: 'true',
    /**
     * Indicates if email support is available.
     */
    EMAIL_SUPPORT: 'true',
    /**
     * Indicates if priority support is available.
     */
    PRIORITY_SUPPORT: 'false',
  }

  /**
   * Array of pricing options for the Free plan.
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
      unit_amount: 0,
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
      unit_amount: 0,
    },
  ]
}
