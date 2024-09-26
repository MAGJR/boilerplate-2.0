import { z } from 'zod'

export const userMetadataSchema = z.object({
  contact: z.object({
    phone: z.string().optional(),
  }),
  utms: z.object({
    utm_source: z.string().optional(),
    utm_medium: z.string().optional(),
    utm_campaign: z.string().optional(),
    utm_term: z.string().optional(),
    utm_content: z.string().optional(),
  }),
})

export type UserMetadata = z.infer<typeof userMetadataSchema>

export const userMetadataDefault: UserMetadata = {
  contact: {
    phone: '',
  },
  utms: {
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: '',
  },
}
