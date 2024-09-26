import { z } from 'zod'

/**
 * Schema for updating plugin action.
 *
 * This schema defines the structure of the input required to update
 * a plugin's integration settings. It ensures that the input contains
 * a valid key and associated data.
 *
 * @typedef {Object} UpdatePluginActionInput
 * @property {string} key - The key of the integration to update.
 * @property {Record<string, any>} data - The new data for the integration, represented as a record of key-value pairs.
 */
export const updatePluginActionSchema = z.record(z.any())

/**
 * Schema for activating a plugin action.
 *
 * This schema defines the structure of the input required to activate
 * a plugin. It ensures that the input contains a valid key.
 *
 * @typedef {Object} ActivatePluginActionInput
 * @property {string} key - The key of the plugin to activate.
 */
export const activatePluginActionSchema = z.object({
  groupKey: z.string(),
  pluginKey: z.string(),
})

/**
 * Schema for deactivating a plugin action.
 *
 * This schema defines the structure of the input required to deactivate
 * a plugin. It ensures that the input contains a valid key.
 *
 * @typedef {Object} DeactivatePluginActionInput
 * @property {string} key - The key of the plugin to deactivate.
 */
export const deactivatePluginActionSchema = z.object({
  groupKey: z.string(),
  pluginKey: z.string(),
})
