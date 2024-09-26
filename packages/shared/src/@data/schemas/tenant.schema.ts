import { z } from 'zod'
import { NodeUUIDProvider } from '../../@modules/infrastructure/uuid/node-uuid'
import { plugins } from '../../boilerplate.plugins'

// Função auxiliar para criar o schema de plugins dinamicamente
const createPluginsSchema = () => {
  const pluginsSchema: Record<string, z.ZodObject<any>> = {}

  Object.entries(plugins).forEach(([groupKey, group]) => {
    pluginsSchema[groupKey] = z.object(
      Object.fromEntries(
        Object.entries(group.plugins).map(([pluginKey, plugin]) => [
          pluginKey,
          z.object({
            enabled: z.boolean(),
            config:
              'schema' in plugin
                ? plugin.schema
                : (z.object({}).passthrough() as any),
          }),
        ]),
      ),
    )
  })

  return z.object(pluginsSchema)
}

export const tenantMetadataSchema = z.object({
  billing: z.object({
    email: z.string().email().optional(),
  }),
  emails: z.object({
    usageExceededSentAt: z.string().optional(),
  }),
  integrations: z.object({
    privateToken: z.string(),
    publicToken: z.string(),
  }),
  plugins: createPluginsSchema(),
})

export type TenantMetadata = z.infer<typeof tenantMetadataSchema> & {
  plugins: {
    [key in keyof typeof plugins]: {
      [subKey in keyof (typeof plugins)[key]['plugins']]: {
        enabled: boolean
        config: z.infer<
          (typeof plugins)[key]['plugins'][subKey] extends { schema: z.ZodType }
            ? (typeof plugins)[key]['plugins'][subKey]['schema']
            : z.ZodType<any>
        >
      }
    }
  }
}

export const tenantMetadataDefault: TenantMetadata = {
  billing: {
    email: undefined,
  },
  emails: {
    usageExceededSentAt: undefined,
  },
  integrations: {
    privateToken: NodeUUIDProvider.generate(),
    publicToken: NodeUUIDProvider.generate(),
  },
  plugins: Object.fromEntries(
    Object.entries(plugins).map(([groupKey, group]) => [
      groupKey,
      Object.fromEntries(
        Object.entries(group.plugins).map(([pluginKey]) => [
          pluginKey,
          {
            enabled: false,
            config: {},
          },
        ]),
      ),
    ]),
  ) as TenantMetadata['plugins'],
}
