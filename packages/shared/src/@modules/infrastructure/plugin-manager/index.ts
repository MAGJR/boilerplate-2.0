/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod'
import { error as errorLogger, log } from '../../interfaces/core/log'
import {
  GroupKeys,
  IPluginManager,
  Plugin,
  PluginGroup,
  PluginListGroupItem,
  PluginManagerStructure,
  PluginMap,
  PluginMapType,
  PluginWithFields,
  PluginWithSchema,
} from '../../interfaces/providers/plugin-manager'
import { ITenantRepository } from '../../interfaces/repositories/tenant'

/**
 * PluginManager class responsible for managing plugins and their operations.
 * @template T - Type extending PluginMap
 * @implements {IPluginManager<T>}
 */
export class PluginManager<T extends PluginMap> implements IPluginManager<T> {
  private readonly pluginMap: T
  private readonly tenantRepository: ITenantRepository
  public readonly plugins: PluginManagerStructure<T>['plugins']

  /**
   * Creates an instance of PluginManager.
   * @param {T} pluginMap - The plugin map
   * @param {ITenantRepository} tenantRepository - The tenant repository
   */
  constructor(pluginMap: T, tenantRepository: ITenantRepository) {
    log({ provider: 'PluginManager', message: 'Constructing' })
    if (!pluginMap || typeof pluginMap !== 'object') {
      errorLogger({
        provider: 'PluginManager',
        message: 'Invalid pluginMap provided to PluginManager',
      })
      throw new Error('Invalid pluginMap provided to PluginManager')
    }

    this.pluginMap = pluginMap
    this.tenantRepository = tenantRepository
    this.plugins = this.initializePlugins()
    log({ provider: 'PluginManager', message: 'Construction complete' })
  }

  /**
   * Groups management
   */
  groups = {
    /**
     * Lists groups or a specific group
     * @param {GroupKeys<T>} [key] - Optional group key
     * @returns {PluginListGroupItem[] | PluginListGroupItem} - The group(s)
     */
    list: (key?: GroupKeys<T>): PluginListGroupItem[] | PluginListGroupItem => {
      log({ provider: 'PluginManager', message: 'Listing groups' })
      const normalizeFields = (plugin: PluginWithSchema): PluginWithFields => {
        log({ provider: 'PluginManager', message: 'Normalizing fields' })
        const {
          schema,
          onReceiveWebhook,
          onUpdate,
          onUninstall,
          onInstall,
          ...plainPlugin
        } = plugin
        const fields = schema
          ? Object.entries((schema as z.ZodObject<any>).shape).map(
              ([key, value]) => ({
                key,
                label: key,
                helpText: '',
                placeholder: '',
                ...(value instanceof z.ZodString
                  ? { type: 'text' }
                  : value instanceof z.ZodNumber
                  ? { type: 'number' }
                  : value instanceof z.ZodBoolean
                  ? { type: 'boolean' }
                  : { type: 'text' }),
              }),
            )
          : []
        return {
          ...plainPlugin,
          fields: fields as {
            key: string
            label: string
            type: 'number' | 'boolean' | 'text'
            helpText?: string
            placeholder?: string
          }[],
        }
      }

      const simplifyPlugins = (
        plugins: Record<string, PluginWithSchema>,
      ): PluginWithFields[] => {
        log({ provider: 'PluginManager', message: 'Simplifying plugins' })
        return Object.values(plugins).map((plugin) => {
          let normalized: PluginWithFields

          if (typeof plugin === 'function') {
            // Handle class-based plugins
            const instance = new (plugin as any)()
            normalized = normalizeFields(instance)
          } else {
            // Handle object-based plugins
            normalized = normalizeFields(plugin)
          }

          // Remove any functions from the normalized plugin
          Object.keys(normalized).forEach((key) => {
            if (
              typeof normalized[key as keyof typeof normalized] === 'function'
            ) {
              delete normalized[key as keyof typeof normalized]
            }
          })
          return normalized
        })
      }

      if (key) {
        log({
          provider: 'PluginManager',
          message: `Listing group for key ${String(key)}`,
        })
        const group = this.pluginMap[key]
        return {
          key: group.key,
          name: group.name,
          description: group.description,
          icon: group.icon,
          plugins: simplifyPlugins(group.plugins),
        }
      } else {
        log({ provider: 'PluginManager', message: 'Listing all groups' })
        return Object.values(this.pluginMap).map((group) => ({
          key: group.key,
          name: group.name,
          description: group.description,
          icon: group.icon,
          plugins: simplifyPlugins(group.plugins),
        }))
      }
    },
  }

  /**
   * Initializes the plugins structure
   * @private
   * @returns {PluginManagerStructure<T>['plugins']} - The initialized plugins structure
   */
  private initializePlugins(): typeof this.plugins {
    log({ provider: 'PluginManager', message: 'Initializing plugins' })
    const pluginStructure = this.createPluginStructure()
    return {
      ...pluginStructure,
      list: this.createPluginListFunction(),
    } as typeof this.plugins
  }

  /**
   * Creates the plugin structure
   * @private
   * @returns {Record<GroupKeys<T>, Record<string, any>>} - The plugin structure
   */
  private createPluginStructure(): Record<GroupKeys<T>, Record<string, any>> {
    log({ provider: 'PluginManager', message: 'Creating plugin structure' })
    if (!this.pluginMap || typeof this.pluginMap !== 'object') {
      errorLogger({
        provider: 'PluginManager',
        message: 'PluginMap is not properly initialized',
        data: this.pluginMap,
      })
      return {} as Record<GroupKeys<T>, Record<string, any>>
    }

    return Object.entries(this.pluginMap).reduce(
      (acc, [groupKey, group]) => {
        if (group && typeof group === 'object' && group.plugins) {
          acc[groupKey as GroupKeys<T>] = this.createGroupPlugins(
            group as T[GroupKeys<T>],
          )
        } else {
          errorLogger({
            provider: 'PluginManager',
            message: `Invalid group for key ${groupKey}`,
            data: group,
          })
        }
        return acc
      },
      {} as Record<GroupKeys<T>, Record<string, any>>,
    )
  }

  /**
   * Creates plugins for a group
   * @private
   * @param {T[GroupKeys<T>]} group - The group
   * @returns {Record<string, any>} - The group plugins
   */
  private createGroupPlugins(group: T[GroupKeys<T>]): Record<string, any> {
    log({
      provider: 'PluginManager',
      message: `Creating plugins for group ${group.key}`,
    })
    return Object.entries(group.plugins).reduce<Record<string, any>>(
      (pluginAcc, [pluginKey, plugin]) => {
        pluginAcc[pluginKey] = this.createPluginFunctions(
          group.key,
          pluginKey,
          plugin,
        )
        return pluginAcc
      },
      {},
    )
  }

  /**
   * Creates functions for a plugin
   * @private
   * @param {PluginWithSchema} plugin - The plugin
   * @returns {Record<string, any>} - The plugin functions
   */
  private createPluginFunctions(
    groupKey: GroupKeys<T>,
    pluginKey: string,
    plugin: Plugin,
  ): PluginWithSchema {
    log({
      provider: 'PluginManager',
      message: `Creating functions for plugin ${pluginKey}`,
    })
    const baseFunctions = {
      isInstalled: this.createIsInstalledFunction(groupKey, plugin),
      update: this.createUpdateFunction(groupKey, pluginKey, plugin),
      activate: this.createActivateFunction(groupKey, pluginKey, plugin),
      deactivate: this.createDeactivateFunction(groupKey, pluginKey, plugin),
    }

    // Adiciona métodos adicionais do plugin
    const additionalFunctions = this.createAdditionalFunctions(plugin)

    return {
      ...plugin, // Mantém todas as propriedades originais do plugin
      ...baseFunctions,
      ...additionalFunctions,
    }
  }

  /**
   * Creates the isInstalled function
   * @private
   * @param {PluginWithSchema} plugin - The plugin
   * @returns {(tenantId: string) => Promise<boolean>} - The isInstalled function
   */
  private createIsInstalledFunction(
    groupKey: GroupKeys<T>,
    plugin: Plugin,
  ): (tenantId: string) => Promise<boolean> {
    return async (tenantId: string) => {
      log({
        provider: 'PluginManager',
        message: `Checking if plugin ${plugin.key} is installed for tenant ${tenantId}`,
      })
      const tenant = await this.tenantRepository.getById(tenantId)
      if (!tenant) {
        errorLogger({
          provider: 'PluginManager',
          message: `Tenant with id ${tenantId} not found`,
        })
        throw new Error(`Tenant with id ${tenantId} not found`)
      }

      const metadata = tenant.settings
      const group = metadata.plugins[groupKey as keyof PluginMapType] || {}

      if (!group) {
        return false
      }

      const pluginInstance = group[plugin.key as keyof typeof group] as
        | { enabled: boolean }
        | undefined

      return pluginInstance?.enabled ?? false
    }
  }

  /**
   * Creates the update function for a plugin
   * @private
   * @param {PluginWithSchema} plugin - The plugin
   * @returns {(tenantId: string, data: z.infer<typeof plugin.schema>) => Promise<void>} - The update function
   */
  private createUpdateFunction(
    groupKey: GroupKeys<T>,
    pluginKey: string,
    plugin: Plugin,
  ): (tenantId: string, data: any) => Promise<void> {
    return async (tenantId: string, data: any) => {
      log({
        provider: 'PluginManager',
        message: `Updating plugin ${pluginKey} for tenant ${tenantId}`,
      })
      let validatedData
      try {
        validatedData = plugin.schema
          ? plugin.schema.parse(data.config)
          : data.config

        // Executar onValidate se existir
        if (plugin.onValidate) {
          const isValid = await plugin.onValidate(tenantId, validatedData)
          if (!isValid) {
            errorLogger({
              provider: 'PluginManager',
              message: `Validation failed for plugin ${pluginKey}`,
            })
            throw new Error(`Validation failed for plugin ${pluginKey}`)
          }
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          errorLogger({
            provider: 'PluginManager',
            message: `Validation error for plugin ${pluginKey}`,
            data: error.errors,
          })
          throw new Error(
            `Invalid configuration for plugin ${pluginKey}: ${error.errors[0].message}`,
          )
        }
        errorLogger({
          provider: 'PluginManager',
          message: `Error updating plugin ${pluginKey}`,
          data: error,
        })
        throw error
      }

      const tenant = await this.tenantRepository.getById(tenantId)
      if (!tenant) {
        errorLogger({
          provider: 'PluginManager',
          message: `Tenant with id ${tenantId} not found`,
        })
        throw new Error(`Tenant with id ${tenantId} not found`)
      }
      const metadata = tenant.settings
      const group = metadata.plugins[groupKey as keyof PluginMapType] || {}
      const pluginInstance = (group[pluginKey as keyof typeof group] || {}) as {
        enabled?: boolean
      }

      const updatedPlugins = {
        ...metadata.plugins,
        [groupKey]: {
          ...group,
          [pluginKey]: {
            enabled: data.enabled ?? pluginInstance.enabled ?? false,
            config: validatedData,
          },
        },
      }

      try {
        await this.tenantRepository.update(tenant.id, {
          settings: {
            ...metadata,
            plugins: updatedPlugins,
          },
        })

        // Passamos o pluginKey para o handlePluginLifecycle
        await this.handlePluginLifecycle(
          groupKey as string,
          pluginKey,
          plugin,
          validatedData,
          tenantId,
        )
      } catch (error) {
        errorLogger({
          provider: 'PluginManager',
          message: `Failed to update plugin ${pluginKey}`,
          data: error,
        })
        throw error
      }
    }
  }

  /**
   * Handles plugin lifecycle events
   * @private
   * @param {string} tenantId - The tenant ID
   * @param {any} pluginInstance - The plugin instance
   * @param {PluginWithSchema} plugin - The plugin
   * @param {any} validatedData - The validated data
   */
  private async handlePluginLifecycle(
    groupKey: string,
    pluginKey: string,
    plugin: PluginWithSchema,
    validatedData: any,
    tenantId: string,
  ): Promise<void> {
    log({
      provider: 'PluginManager',
      message: `Handling lifecycle for plugin ${pluginKey} and tenant ${tenantId}`,
      context: 'handlePluginLifecycle',
    })

    const tenant = await this.tenantRepository.getById(tenantId)
    if (!tenant) {
      errorLogger({
        provider: 'PluginManager',
        message: `Tenant with id ${tenantId} not found`,
      })
      throw new Error(`Tenant with id ${tenantId} not found`)
    }

    const pluginInstance = tenant.settings.plugins[groupKey]?.[pluginKey] || {}
    const wasPreviouslyEnabled = pluginInstance.enabled
    const isCurrentlyEnabled = validatedData.enabled !== false

    if (isCurrentlyEnabled) {
      if (plugin.onUpdate) {
        log({
          provider: 'PluginManager',
          message: `Calling onUpdate for plugin ${pluginKey}`,
        })
        await plugin.onUpdate(tenantId, validatedData)
      } else {
        log({
          provider: 'PluginManager',
          message: `onUpdate not found for plugin ${pluginKey}`,
        })
      }
      if (!wasPreviouslyEnabled && typeof plugin.onInstall === 'function') {
        await plugin.onInstall(tenantId)
      }
    } else if (
      wasPreviouslyEnabled &&
      !isCurrentlyEnabled &&
      typeof plugin.onUninstall === 'function'
    ) {
      await plugin.onUninstall(tenantId)
    }
  }

  /**
   * Creates the activate function for a plugin
   * @private
   * @param {PluginWithSchema} plugin - The plugin
   * @returns {(tenantId: string) => Promise<void>} - The activate function
   */
  private createActivateFunction(
    groupKey: GroupKeys<T>,
    pluginKey: string,
    plugin: PluginWithSchema,
  ): (tenantId: string) => Promise<void> {
    return async (tenantId: string) => {
      log({
        provider: 'PluginManager',
        message: `Activating plugin ${pluginKey} for tenant ${tenantId}`,
      })
      const tenant = await this.tenantRepository.getById(tenantId)
      if (!tenant) {
        errorLogger({
          provider: 'PluginManager',
          message: `Tenant with id ${tenantId} not found`,
        })
        throw new Error(`Tenant with id ${tenantId} not found`)
      }

      const currentPluginState = tenant.settings.plugins[plugin.key]
      const isFirstActivation = !currentPluginState?.enabled

      const updatedPlugins = {
        [groupKey]: {
          [pluginKey]: {
            enabled: true,
            config: currentPluginState?.config || {},
          },
        },
      }

      try {
        await this.tenantRepository.update(tenant.id, {
          settings: {
            plugins: updatedPlugins,
          },
        })

        if (isFirstActivation) {
          await plugin.onInstall?.(tenantId)
        }

        await this.handlePluginLifecycle(
          groupKey as string,
          pluginKey,
          plugin,
          {
            enabled: true,
          },
          tenantId,
        )
      } catch (error) {
        // Log the error and possibly revert the database change
        errorLogger({
          provider: 'PluginManager',
          message: `Failed to activate plugin ${plugin.key}`,
          data: error,
        })
        // Consider reverting the database change here
        throw error
      }
    }
  }

  /**
   * Creates the deactivate function for a plugin
   * @private
   * @param {PluginWithSchema} plugin - The plugin
   * @returns {(tenantId: string) => Promise<void>} - The deactivate function
   */
  private createDeactivateFunction(
    groupKey: GroupKeys<T>,
    pluginKey: string,
    plugin: PluginWithSchema,
  ): (tenantId: string) => Promise<void> {
    return async (tenantId: string) => {
      log({
        provider: 'PluginManager',
        message: `Deactivating plugin ${pluginKey} for tenant ${tenantId}`,
      })
      const tenant = await this.tenantRepository.getById(tenantId)
      if (!tenant) {
        errorLogger({
          provider: 'PluginManager',
          message: `Tenant with id ${tenantId} not found`,
        })
        throw new Error(`Tenant with id ${tenantId} not found`)
      }

      const updatedPlugins = {
        [groupKey]: {
          [pluginKey]: {
            enabled: false,
          },
        },
      }

      await this.tenantRepository.update(tenant.id, {
        settings: {
          plugins: updatedPlugins,
        },
      })

      await this.handlePluginLifecycle(
        groupKey as string,
        pluginKey,
        plugin,
        {
          enabled: false,
        },
        tenantId,
      )
    }
  }

  /**
   * Creates additional functions for a plugin
   * @private
   * @param {PluginWithSchema} plugin - The plugin
   * @returns {Record<string, unknown>} - The additional functions
   */
  private createAdditionalFunctions(
    plugin: PluginWithSchema,
  ): Record<string, unknown> {
    log({
      provider: 'PluginManager',
      message: `Creating additional functions for plugin ${plugin.key}`,
    })
    return Object.entries(plugin).reduce(
      (acc, [key, value]) => {
        if (
          typeof value === 'function' &&
          !['update', 'activate', 'deactivate'].includes(key)
        ) {
          acc[key] = value
        }
        return acc
      },
      {} as Record<string, unknown>,
    )
  }

  /**
   * Creates the plugin list function
   * @private
   * @returns {(filter?: { group?: GroupKeys<T>; searchTerm?: string }) => PluginGroup[]} - The plugin list function
   */
  private createPluginListFunction(): (filter?: {
    group?: GroupKeys<T>
    searchTerm?: string
  }) => PluginGroup[] {
    return (filter?: {
      group?: GroupKeys<T>
      searchTerm?: string
    }): PluginGroup[] => {
      log({ provider: 'PluginManager', message: 'Creating plugin list' })
      const normalizeFields = (plugin: PluginWithSchema): PluginWithFields => {
        const {
          schema,
          onReceiveWebhook,
          onUpdate,
          onUninstall,
          onInstall,
          options,
          ...plainPlugin
        } = plugin

        const fields = schema
          ? Object.entries((schema as z.ZodObject<any>).shape).map(
              ([key, value]) => ({
                key,
                label: key,
                helpText: '',
                placeholder: '',
                type:
                  value instanceof z.ZodString
                    ? 'text'
                    : value instanceof z.ZodNumber
                    ? 'number'
                    : value instanceof z.ZodBoolean
                    ? 'boolean'
                    : 'text',
              }),
            )
          : []

        // Remove any functions from plainPlugin
        Object.keys(plainPlugin).forEach((key) => {
          if (
            typeof plainPlugin[key as keyof typeof plainPlugin] === 'function'
          ) {
            delete plainPlugin[key as keyof typeof plainPlugin]
          }
        })

        return {
          ...plainPlugin,
          fields: fields as {
            key: string
            label: string
            type: 'number' | 'boolean' | 'text'
            helpText?: string
            placeholder?: string
          }[],
          options: options ? { ...options } : undefined, // Copy options without functions
        }
      }

      const allPlugins: PluginGroup[] = Object.values(this.pluginMap).map(
        (group) => ({
          ...group,
          plugins: Object.fromEntries(
            Object.entries(group.plugins).map(([key, plugin]) => {
              let normalizedPlugin: PluginWithFields

              if (typeof plugin === 'function') {
                // Handle class-based plugins
                const instance = new (plugin as any)()
                normalizedPlugin = normalizeFields(instance)
              } else {
                // Handle object-based plugins
                normalizedPlugin = normalizeFields(plugin)
              }

              return [key, normalizedPlugin]
            }),
          ),
        }),
      )

      let filteredPlugins: PluginGroup[] = allPlugins

      if (filter?.group) {
        filteredPlugins = this.filterPluginsByGroup(
          filteredPlugins,
          filter.group,
        )
      }

      if (filter?.searchTerm) {
        filteredPlugins = this.filterPluginsBySearchTerm(
          filteredPlugins,
          filter.searchTerm,
        )
      }

      return filteredPlugins
    }
  }

  /**
   * Filters plugins by group
   * @private
   * @param {PluginGroup[]} plugins - The plugins to filter
   * @param {GroupKeys<T>} group - The group to filter by
   * @returns {PluginGroup[]} - The filtered plugins
   */
  private filterPluginsByGroup(
    plugins: PluginGroup[],
    group: GroupKeys<T>,
  ): PluginGroup[] {
    log({
      provider: 'PluginManager',
      message: `Filtering plugins by group ${String(group)}`,
    })
    return plugins.filter(
      (plugin): plugin is PluginGroup & { key: GroupKeys<T> } =>
        'key' in plugin && plugin.key === group,
    )
  }

  /**
   * Filters plugins by search term
   * @private
   * @param {PluginGroup[]} plugins - The plugins to filter
   * @param {string} searchTerm - The search term
   * @returns {PluginGroup[]} - The filtered plugins
   */
  private filterPluginsBySearchTerm(
    plugins: PluginGroup[],
    searchTerm: string,
  ): PluginGroup[] {
    log({
      provider: 'PluginManager',
      message: `Filtering plugins by search term "${searchTerm}"`,
    })
    const searchLower = searchTerm.toLowerCase()
    return plugins.filter((group: PluginGroup) => {
      const nameMatch = group.name.toLowerCase().includes(searchLower)
      const descriptionMatch = group.description
        .toLowerCase()
        .includes(searchLower)
      const pluginsMatch = this.checkPluginsMatch(
        Object.values(group.plugins) as PluginWithFields[],
        searchLower,
      )
      return nameMatch || descriptionMatch || pluginsMatch
    })
  }

  /**
   * Checks if any plugin matches the search term
   * @private
   * @param {PluginWithFields[]} plugins - The plugins to check
   * @param {string} searchLower - The lowercase search term
   * @returns {boolean} - True if any plugin matches, false otherwise
   */
  private checkPluginsMatch(
    plugins: PluginWithFields[],
    searchLower: string,
  ): boolean {
    log({
      provider: 'PluginManager',
      message: `Checking plugins match for "${searchLower}"`,
    })
    return plugins.some((plugin: PluginWithFields) => {
      const pluginNameMatch = plugin.name.toLowerCase().includes(searchLower)
      const pluginDescriptionMatch = plugin.description
        .toLowerCase()
        .includes(searchLower)
      return pluginNameMatch || pluginDescriptionMatch
    })
  }
}
