import { AppConfig } from './@modules/types/boilerplate.config'

/**
 * Configuration object for the application.
 * This object contains various settings and keys for the application.
 */
export const APP_CONFIGS: AppConfig = {
  /**
   * Application settings.
   */
  /**
   * URL of the application.
   */
  url: process.env.NEXT_PUBLIC_APP_URL || 'http//localhost:3000',
  /**
   * Name of the application.
   */
  name: 'SaaS Boilerplate',
  /**
   * Theme of the application.
   */
  theme: 'light',
  /**
   * Default language of the application.
   */
  defaultLanguage: 'en',
  /**
   * Description of the application.
   */
  description: 'Transform Your Project into a Successful Micro-SaaS',

  /**
   * Branding information for the application.
   */
  brand: {
    /**
     * Assets for the application.
     */
    assets: {
      /**
       * URL of the Open Graph image for the application.
       */
      og: 'https://cdn.nubler.com.br/saas-boilerplate/og-image.png',
    },
    /**
     * Logos for the application.
     */
    logos: {
      /**
       * Icon logos for the application.
       */
      icon: {
        /**
         * Dark theme icon URL.
         */
        dark: '/assets/logos/icon-dark.svg',
        /**
         * Light theme icon URL.
         */
        light: '/assets/logos/icon-dark.svg',
      },
      /**
       * Full logos for the application.
       */
      full: {
        /**
         * Dark theme full logo URL.
         */
        dark: '/assets/logos/icon-dark.svg',
        /**
         * Light theme full logo URL.
         */
        light: '/assets/logos/icon-dark.svg',
      },
    },
  },
  /**
   * Creator information for the application.
   */
  creator: {
    /**
     * Name of the creator.
     */
    name: 'Felipe Barcelos',
    /**
     * URL of the creator's image.
     */
    image:
      'https://pbs.twimg.com/profile_images/1745449170293702657/3lqSo1oy_400x400.png',
    /**
     * URL of the creator's Twitter profile.
     */
    twitter: 'https://twitter.com/feldbarcelospro',
  },
  /**
   * Links related to the application.
   */
  links: {
    /**
     * URL of the application's website.
     */
    site: '/',
    /**
     * URL of the application's support page.
     */
    support: '/support',
    /**
     * URL of the application's terms page.
     */
    terms: '/terms',
    /**
     * URL of the application's privacy policy.
     */
    privacy: '/privacy',
    /**
     * URL of the application's documentation.
     */
    docs: '/docs',
    /**
     * URL of the application's changelog.
     */
    changelog: '/changelog',
    /**
     * URL of the application's blog.
     */
    blog: '/blog',
    /**
     * URL of the creator's LinkedIn profile.
     */
    linkedin: 'https://www.linkedin.com/in/',
    /**
     * URL of the creator's Twitter profile.
     */
    twitter: 'https://twitter.com/',
  },
  /**
   * Providers settings for the application.
   */
  providers: {
    /**
     * Billing settings for the application.
     */
    billing: {
      /**
       * Stripe keys for billing.
       */
      keys: {
        /**
         * Publishable Stripe key.
         */
        publishable: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        /**
         * Secret Stripe key.
         */
        key: process.env.STRIPE_SECRET_KEY,
        /**
         * Stripe webhook secret.
         */
        webhook: process.env.STRIPE_WEBHOOK_SECRET,
      },

      /**
       * Metadata for billing plans.
       */
      meta: {
        /**
         * Metadata for team members.
         */
        TEAM_MEMBERS: {
          /**
           * Name of the feature.
           */
          name: 'Seats',
          /**
           * Table name for the feature.
           */
          table: 'Membership',
          /**
           * Label for the feature.
           */
          label: '{{ value }} seats',
        },
        /**
         * Metadata for integrations.
         */
        INTEGRATIONS: {
          /**
           * Name of the feature.
           */
          name: 'Integrations',
          /**
           * Table name for the feature.
           */
          table: undefined,
          /**
           * Label for the feature.
           */
          label: 'Third-party integrations',
        },
        /**
         * Metadata for email support.
         */
        EMAIL_SUPPORT: {
          /**
           * Name of the feature.
           */
          name: 'Email support',
          /**
           * Table name for the feature.
           */
          table: undefined,
          /**
           * Label for the feature.
           */
          label: 'Email support',
        },
        /**
         * Metadata for priority support.
         */
        PRIORITY_SUPPORT: {
          /**
           * Name of the feature.
           */
          name: 'Priority Support',
          /**
           * Table name for the feature.
           */
          table: undefined,
          /**
           * Label for the feature.
           */
          label: 'Priority Support',
        },
      },
    },
    /**
     * Mail settings for the application.
     */
    mail: {
      /**
       * From email address.
       */
      from: 'SaaS Boilerplate <no-reply@zilix.com.br>',
      /**
       * Resend settings.
       */
      resend: {
        /**
         * Resend API key.
         */
        token: process.env.RESEND_API_KEY,
      },
      /**
       * SMTP settings.
       */
      smtp: {
        /**
         * SMTP URL.
         */
        url: process.env.SMTP_URL,
      },
    },
    /**
     * AI settings for the application.
     */
    ai: {
      /**
       * OpenAI settings.
       */
      openai: {
        /**
         * OpenAI API key.
         */
        token: process.env.OPENAI_API_KEY,
      },
    },
    /**
     * Analytics settings for the application.
     */
    analytics: {
      /**
       * Google Tag Manager ID.
       */
      GTM: process.env.NEXT_PUBLIC_GTM,
      /**
       * Notifylog token.
       */
      notifylog: process.env.NOTIFYLOG_TOKEN,
    },
    /**
     * Jobs settings for the application.
     */
    jobs: {
      /**
       * NextCron token.
       */
      nextcron: process.env.NEXTCRON_TOKEN,
    },
    /**
     * Authentication providers for the application.
     */
    auth: {
      /**
       * Providers for authentication.
       */
      providers: {
        /**
         * Google authentication settings.
         */
        google: {
          /**
           * Google client ID.
           */
          clientId: process.env.GOOGLE_CLIENT_ID,
          /**
           * Google client secret.
           */
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
        /**
         * GitHub authentication settings.
         */
        github: {
          /**
           * GitHub client ID.
           */
          clientId: process.env.GITHUB_CLIENT_ID,
          /**
           * GitHub client secret.
           */
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
      },
    },
    /**
     * Storage settings for the application.
     */
    storage: {
      /**
       * Endpoint for storage.
       */
      endpoint: process.env.STORAGE_ENDPOINT,
      /**
       * Region for storage.
       */
      region: process.env.STORAGE_REGION,
      /**
       * Bucket name for storage.
       */
      bucket: process.env.STORAGE_BUCKET,
      /**
       * Path for storage.
       */
      path: process.env.STORAGE_PATH,
      /**
       * Access key ID for storage.
       */
      accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
      /**
       * Secret access key for storage.
       */
      secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY,
      /**
       * Signature version for storage.
       */
      signatureVersion: 'v4',
    },
  },
}
