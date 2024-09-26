/**
 * Configuration object for the application.
 * This object contains various settings and keys for the application.
 */
export interface AppConfig {
  name: string
  url: string
  theme: 'light' | 'dark'
  defaultLanguage: string
  description: string
  brand: {
    assets: {
      og: string
    }
    logos: {
      icon: {
        dark: string
        light: string
      }
      full: {
        dark: string
        light: string
      }
    }
  }
  creator: {
    name: string
    image: string
    twitter: string
  }
  links: {
    site: string
    support: string
    terms: string
    privacy: string
    docs: string
    changelog: string
    blog: string
    linkedin: string
    twitter: string
  }
  providers: {
    billing: {
      keys: {
        publishable: string | undefined
        key: string | undefined
        webhook: string | undefined
      }
      meta: {
        [key: string]: {
          name: string
          table: string | undefined
          label: string
        }
      }
    }
    mail: {
      from: string
      resend?: {
        token: string | undefined
      }
      smtp?: {
        url: string | undefined
      }
    }
    ai: {
      openai: {
        token: string | undefined
      }
    }
    analytics: {
      GTM: string | undefined
      notifylog: string | undefined
    }
    jobs: {
      nextcron: string | undefined
    }
    auth: {
      providers: {
        google: {
          clientId: string | undefined
          clientSecret: string | undefined
        }
        github: {
          clientId: string | undefined
          clientSecret: string | undefined
        }
      }
    }
    storage: {
      endpoint: string | undefined
      region: string | undefined
      bucket: string | undefined
      path: string | undefined
      accessKeyId: string | undefined
      secretAccessKey: string | undefined
      signatureVersion: string | undefined
    }
  }
}
