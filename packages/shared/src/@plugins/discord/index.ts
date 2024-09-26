import axios from 'axios'
import { z } from 'zod'
import { interpolateObject } from '../../@helpers/interpolate'
import { shared } from '../../@modules'
import { Plugin } from '../../@modules/interfaces/providers/plugin-manager'
import { TemplateKey, templates } from './templates'

export class DiscordPlugin implements Plugin {
  key = 'discord'
  name = 'Discord'
  description = 'Send messages to a Discord channel via Webhook'
  help =
    'Use this integration to send messages to a specific Discord channel using a Webhook URL'

  icon = '/assets/icons/discord.svg'

  options = {
    help: {
      title: 'Discord Integration Help',
      description:
        'Learn how to set up and use the Discord Webhook integration',
      link: {
        label: 'View Discord Webhook Setup Guide',
        url: 'https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks',
      },
    },
  }

  schema = z.object({
    webhookUrl: z.string().optional(),
  })

  async onSendMessage(
    tenantId: string,
    template: TemplateKey,
    data: Record<string, any>,
  ): Promise<void> {
    try {
      const tenant = await shared.usecases.tenant.getTenant.execute(tenantId)

      if (!tenant.settings.plugins.notifications?.discord?.enabled) {
        return
      }

      if (!tenant.settings.plugins.notifications?.discord?.config) {
        throw new Error('Discord webhook URL not configured')
      }

      const selectedTemplate = templates[template]
      if (!selectedTemplate) {
        throw new Error(`Template "${template}" not found`)
      }

      const interpolatedTemplate = interpolateObject(selectedTemplate, data)
      const webhookUrl =
        tenant.settings.plugins.notifications?.discord?.config.webhookUrl

      if (!webhookUrl) {
        throw new Error('Discord webhook URL is not configured')
      }

      await axios.post(webhookUrl, interpolatedTemplate)

      console.log(`Message sent to Discord for tenant: ${tenantId}`)
    } catch (error) {
      console.error(`Failed to send Discord message for tenant ${tenantId}:`)
    }
  }

  async onUpdate(tenantId: string, data: any): Promise<void> {
    console.log(`Discord plugin updated for tenant: ${tenantId}`, data)
    try {
      await this.onSendMessage(tenantId, 'welcome', {})
      console.log(`Welcome message sent successfully for tenant: ${tenantId}`)
    } catch (error) {
      console.error(
        `Failed to send welcome message for tenant ${tenantId}:`,
        error,
      )
    }
  }

  async onUninstall(tenantId: string): Promise<void> {
    console.log(`Discord plugin uninstalled for tenant: ${tenantId}`)
  }

  async onValidate(tenantId: string, data: any): Promise<boolean> {
    try {
      const response = await axios.post(data.webhookUrl, {
        content: 'Validating Discord webhook',
      })
      return response.status === 204 // Discord retorna 204 para webhooks bem-sucedidos
    } catch (error) {
      console.error(
        `Failed to validate Discord webhook for tenant ${tenantId}:`,
        error,
      )
      return false
    }
  }
}
