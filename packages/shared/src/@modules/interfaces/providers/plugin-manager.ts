/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { z, ZodSchema } from 'zod'
import { plugins } from '../../../boilerplate.plugins'

/**
 * Represents the options for a plugin.
 */
export type PluginOptions = {
  commingSoon?: boolean
  disabled?: boolean
  hidden?: boolean
  webhook?: boolean
  customClass?: string
  help?: {
    title?: string
    description?: string
    link?: {
      label: string
      url: string
    }
  }
}

/**
 * Represents a plugin available in the application.
 *
 * @property {string} key - The unique identifier of the plugin.
 * @property {string} name - The name of the plugin.
 * @property {string} description - A description of the plugin.
 * @property {string} icon - The icon URL for the plugin.
 * @property {string} [help] - Optional help text for the plugin.
 * @property {PluginOptions} [options] - Optional additional options for the plugin.
 * @property {ZodSchema} [schema] - Optional Zod schema for the plugin configuration.
 * @property {(tenantId: string, data: unknown) => void} [onReceiveWebhook] - Optional function to handle incoming webhooks.
 * @property {(tenantId: string, data: unknown) => Promise<void>} [onUpdate] - Optional function to handle plugin updates.
 * @property {(tenantId: string) => Promise<void>} [onUninstall] - Optional function to handle plugin uninstallation.
 * @property {(tenantId: string) => Promise<void>} [onInstall] - Optional function to handle plugin installation.
 * @property {(tenantId: string, data: unknown) => Promise<boolean>} [onValidate] - Optional function to validate plugin data.
 * @property {(tenantId: string) => Promise<void>} [onActivate] - Optional function to handle plugin activation.
 * @property {(tenantId: string) => Promise<void>} [onDeactivate] - Optional function to handle plugin deactivation.
 */
export type Plugin = {
  key: string
  name: string
  description: string
  icon: string
  help?: string
  options?: PluginOptions
  schema?: ZodSchema

  onReceiveWebhook?: (tenantId: string, data: unknown) => void
  onUpdate?: (tenantId: string, data: unknown) => Promise<void>
  onUninstall?: (tenantId: string) => Promise<void>
  onInstall?: (tenantId: string) => Promise<void>
  onValidate?: (tenantId: string, data: unknown) => Promise<boolean>
  onActivate?: (tenantId: string) => Promise<void>
  onDeactivate?: (tenantId: string) => Promise<void>
}

/**
 * Represents a plugin with a Zod schema and additional methods.
 * @extends Plugin
 */
export interface PluginWithSchema extends Plugin {
  schema?: ZodSchema
  [key: string]: any
}

/**
 * A map of plugin keys to PluginWithSchema objects.
 */
export type PluginWithSchemaMap = {
  [pluginKey: string]: PluginWithSchema
}

/**
 * Represents a plugin with defined fields for configuration.
 * @extends Plugin
 */
export interface PluginWithFields extends Plugin {
  fields: {
    key: string
    label: string
    type: 'text' | 'number' | 'boolean'
    helpText?: string
    placeholder?: string
  }[]
}

/**
 * Represents an item in the plugin list group.
 */
export type PluginListGroupItem = {
  key: string
  name: string
  description: string
  icon: string
  options?: PluginOptions
  plugins: PluginWithFields[]
}

/**
 * Represents a group of plugins.
 *
 * @template T - The type of the plugins object.
 * @property {string} key - The unique identifier of the plugin group.
 * @property {string} name - The name of the plugin group.
 * @property {string} description - A description of the plugin group.
 * @property {string} icon - The icon URL for the plugin group.
 * @property {T} plugins - An object of plugins in the group.
 */
export type PluginGroup<T extends PluginWithSchemaMap = PluginWithSchemaMap> = {
  key: string
  name: string
  description: string
  icon: string
  plugins: T
}

/**
 * A map of group keys to PluginGroup objects.
 *
 * @template T - The type of the PluginGroup objects.
 */
export type PluginMap<T extends PluginGroup = PluginGroup> = {
  [groupKey: string]: T
}

/**
 * Extracts the keys of a PluginMap type.
 */
export type GroupKeys<P extends PluginMap> = keyof P

/**
 * Extracts the plugin keys for a specific group in a PluginMap.
 */
export type PluginKeys<
  P extends PluginMap,
  G extends GroupKeys<P>,
> = keyof P[G]['plugins']

/**
 * Represents the structure of a plugin manager.
 * @template P - Extends PluginMap
 */
export type PluginManagerStructure<P extends PluginMap> = {
  groups: {
    /**
     * Lists groups or a specific group.
     * @param {GroupKeys<P>} [key] - Optional group key to retrieve a specific group.
     * @returns {PluginListGroupItem[] | PluginListGroupItem} An array of groups or a specific group.
     */
    list: (key?: GroupKeys<P>) => PluginListGroupItem[] | PluginListGroupItem
  }
  plugins: {
    /**
     * Lists plugins or plugins for a specific group.
     * @param {Object} [filter] - Optional filter object.
     * @param {GroupKeys<P>} [filter.group] - Optional group key to retrieve plugins for a specific group.
     * @param {string} [filter.searchTerm] - Optional search term to filter plugins.
     * @returns {PluginGroup[]} An array of plugin groups.
     */
    list: (filter?: {
      group?: GroupKeys<P>
      searchTerm?: string
    }) => PluginGroup[]
  } & {
    [G in GroupKeys<P>]: {
      [I in PluginKeys<P, G>]: PluginMethods<P, G, I>
    }
  }
}

/**
 * Represents the methods available for a plugin.
 * @template P - Extends PluginMap
 * @template G - Extends GroupKeys<P>
 * @template I - Extends PluginKeys<P, G>
 */
type PluginMethods<
  P extends PluginMap,
  G extends GroupKeys<P>,
  I extends PluginKeys<P, G>,
> = {
  /**
   * Checks if the plugin is installed for a given tenant.
   * @param {string} tenantId - The ID of the tenant.
   * @returns {Promise<boolean>} A promise that resolves to true if the plugin is installed, false otherwise.
   */
  isInstalled: (tenantId: string) => Promise<boolean>

  /**
   * Updates the plugin configuration for a given tenant.
   * @param {string} tenantId - The ID of the tenant.
   * @param {z.infer<P[G]['plugins'][I]['schema']>} data - The updated configuration data.
   * @returns {Promise<void>} A promise that resolves when the update is complete.
   */
  update: (
    tenantId: string,
    data: P[G]['plugins'][I]['schema'] extends z.ZodType
      ? z.infer<P[G]['plugins'][I]['schema']>
      : never,
  ) => Promise<void>

  /**
   * Activates the plugin for a given tenant.
   * @param {string} tenantId - The ID of the tenant.
   * @returns {Promise<void>} A promise that resolves when the activation is complete.
   */
  activate: (tenantId: string) => Promise<void>

  /**
   * Deactivates the plugin for a given tenant.
   * @param {string} tenantId - The ID of the tenant.
   * @returns {Promise<void>} A promise that resolves when the deactivation is complete.
   */
  deactivate: (tenantId: string) => Promise<void>
} & Pick<
  P[G]['plugins'][I],
  {
    [K in keyof P[G]['plugins'][I]]: P[G]['plugins'][I][K] extends (
      ...args: any[]
    ) => any
      ? K
      : never
  }[keyof P[G]['plugins'][I]]
>

/**
 * Represents the structure of the plugin map.
 *
 * @typedef {Object} PluginMapType
 * @property {Object} [GroupKey] - An object representing a group of plugins.
 * @property {Object} [GroupKey][PluginKey] - An object representing a specific plugin within a group.
 * @property {boolean} [GroupKey][PluginKey].enabled - Indicates whether the plugin is enabled.
 * @property {Object} [GroupKey][PluginKey].config - The configuration for the plugin, inferred from its schema.
 */
export type PluginMapType = {
  [GroupKey in keyof typeof plugins]: {
    [PluginKey in keyof (typeof plugins)[GroupKey]['plugins']]: {
      enabled: boolean
    } & ((typeof plugins)[GroupKey]['plugins'][PluginKey] extends Plugin
      ? (typeof plugins)[GroupKey]['plugins'][PluginKey]['schema'] extends z.ZodType
        ? {
            config: z.infer<
              (typeof plugins)[GroupKey]['plugins'][PluginKey]['schema']
            >
          }
        : Record<string, never>
      : Record<string, never>)
  }
}

/**
 * Interface for a plugin manager.
 * @template P - Extends PluginMap
 */
export interface IPluginManager<P extends PluginMap>
  extends PluginManagerStructure<P> {
  plugins: PluginManagerStructure<P>['plugins']
}
