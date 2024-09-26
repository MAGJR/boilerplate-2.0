import { Plan } from '../../@modules/types/boilerplate.plan'

/**
 * Represents the Startup plan in the application.
 * @implements {Plan}
 */
export class StartupPlan implements Plan {
  /** Unique identifier for the Startup plan */
  key = 'startup'
  /** Display name for the Startup plan */
  name = 'Startup'
  /** Brief description of the Startup plan */
  description = 'Advanced support for large organizations.'

  /** Metadata describing the features of the Startup plan */
  metadata = {
    /** Indicates if email support is available */
    EMAIL_SUPPORT: 'true',
    /** Indicates if priority support is available */
    PRIORITY_SUPPORT: 'true',
    /** Indicates if integrations are supported */
    INTEGRATIONS: 'true',
    /** Number of team members allowed */
    TEAM_MEMBERS: '6',
  }

  /** Array of pricing options for the Startup plan */
  prices = [
    {
      /** Monthly recurring payment details */
      recurring: {
        interval: 'month' as const,
      },
      /** Currency for the price */
      currency: 'usd',
      /** Price amount in cents */
      unit_amount: 4900,
    },
    {
      /** Yearly recurring payment details */
      recurring: {
        interval: 'year' as const,
      },
      /** Currency for the price */
      currency: 'usd',
      /** Price amount in cents */
      unit_amount: 49000,
    },
  ]
}
