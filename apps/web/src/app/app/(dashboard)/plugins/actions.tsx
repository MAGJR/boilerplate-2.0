'use server'

import { client } from '@/services/actions/clients/tenant.client'
import { shared } from '@app/shared'
import {
    activatePluginActionSchema,
    deactivatePluginActionSchema,
    updatePluginActionSchema,
} from './schemas'

/**
 * Action to update tenant integration settings.
 */
export const updatePluginAction = client.action({
  name: 'tenant.plugin.update',
  type: 'mutate',
  schema: updatePluginActionSchema,
  handler: async ({ input, context }) => {
    const { tenant } = context
    const { groupKey, pluginKey, data } = input

    if (!shared.provider.plugin.plugins[groupKey]) {
      throw new Error(`Plugin group '${groupKey}' not found`)
    }

    if (!shared.provider.plugin.plugins[groupKey][pluginKey]) {
      throw new Error(`Plugin '${pluginKey}' not found in group '${groupKey}'`)
    }

    const plugin = shared.provider.plugin.plugins[groupKey][pluginKey]

    try {
      // Chamar o método update do plugin
      await plugin.update(tenant.id, {
        enabled: Object.values(data.config).every(
          (value) => value !== undefined && value !== '',
        ),
        config: data.config,
      })

      return true
    } catch (error) {
      console.error(`Failed to update plugin ${pluginKey}:`, error)
      throw new Error(`Failed to update plugin: ${error.message}`)
    }
  },
})

/**
 * Action to activate a plugin for a tenant.
 */
export const activatePluginAction = client.action({
  name: 'tenant.plugin.activate',
  type: 'mutate',
  schema: activatePluginActionSchema,
  handler: async ({ input, context }) => {
    const { tenant } = context
    const { groupKey, pluginKey } = input

    if (!shared.provider.plugin.plugins[groupKey]) {
      throw new Error(`Plugin group '${groupKey}' not found`)
    }

    if (!shared.provider.plugin.plugins[groupKey][pluginKey]) {
      throw new Error(`Plugin '${pluginKey}' not found in group '${groupKey}'`)
    }

    const plugin = shared.provider.plugin.plugins[groupKey][pluginKey]

    await plugin.activate(tenant.id)

    return true
  },
})

/**
 * Action to deactivate a plugin for a tenant.
 */
export const deactivatePluginAction = client.action({
  name: 'tenant.plugin.deactivate',
  type: 'mutate',
  schema: deactivatePluginActionSchema,
  handler: async ({ input, context }) => {
    const { tenant } = context
    const { groupKey, pluginKey } = input

    if (!shared.provider.plugin.plugins[groupKey]) {
      throw new Error(`Plugin group '${groupKey}' not found`)
    }

    if (!shared.provider.plugin.plugins[groupKey][pluginKey]) {
      throw new Error(`Plugin '${pluginKey}' not found in group '${groupKey}'`)
    }

    const plugin = shared.provider.plugin.plugins[groupKey][pluginKey]

    await plugin.deactivate(tenant.id)

    return true
  },
})
