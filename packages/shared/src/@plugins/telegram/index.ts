import axios from 'axios'
import { z } from 'zod'
import { interpolateObject } from '../../@helpers/interpolate'
import { shared } from '../../@modules'
import { Plugin } from '../../@modules/interfaces/providers/plugin-manager'
import { TemplateKey, templates } from './templates'

export class TelegramPlugin implements Plugin {
  key = 'telegram'
  name = 'Telegram'
  description = 'Send messages to a Telegram chat via Bot API'
  help =
    'Use this integration to send messages to a specific Telegram chat using a Bot Token'

  icon = '/assets/icons/telegram.svg'

  options = {
    webhook: true,
    help: {
      title: 'Telegram Integration Help',
      description: 'Learn how to set up and use the Telegram Bot integration',
      link: {
        label: 'View Telegram Bot Setup Guide',
        url: 'https://core.telegram.org/bots#how-do-i-create-a-bot',
      },
    },
  }

  schema = z.object({
    botToken: z.string().optional(),
    chatId: z.string().optional(),
  })

  async onSendMessage(
    tenantId: string,
    template: TemplateKey,
    data: Record<string, any>,
  ): Promise<void> {
    try {
      const tenant = await shared.usecases.tenant.getTenant.execute(tenantId)

      if (!tenant.settings.plugins.notifications?.telegram?.enabled) {
        console.log('Telegram plugin is not enabled')
        return
      }

      const config = tenant.settings.plugins.notifications?.telegram?.config
      if (!config || !config.botToken || !config.chatId) {
        throw new Error('Telegram bot token or chat ID not configured')
      }

      const selectedTemplate = templates[template]
      if (!selectedTemplate) {
        throw new Error(`Template "${template}" not found`)
      }

      const interpolatedTemplate = interpolateObject(selectedTemplate, data)

      // Ensure chatId is a number or a string starting with '-'
      const chatId = Number(config.chatId) || config.chatId
      if (typeof chatId !== 'number' && !chatId.startsWith('-')) {
        throw new Error('Invalid chat ID format')
      }

      await axios.post(
        `https://api.telegram.org/bot${config.botToken}/sendMessage`,
        {
          chat_id: chatId,
          text: interpolatedTemplate.content,
          parse_mode: 'HTML',
        },
      )

      console.log(`Message sent to Telegram for tenant: ${tenantId}`)
    } catch (error) {
      console.error(`Failed to send Telegram message for tenant ${tenantId}:`)
    }
  }

  async onUpdate(tenantId: string, data: any): Promise<void> {
    console.log(`Telegram plugin updated for tenant: ${tenantId}`, data)
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

  async onValidate(tenantId: string, data: any): Promise<boolean> {
    try {
      const response = await axios.get(
        `https://api.telegram.org/bot${data.botToken}/getMe`,
      )
      return response.data.ok === true
    } catch (error) {
      console.error(
        `Failed to validate Telegram bot token for tenant ${tenantId}:`,
        error,
      )
      return false
    }
  }
}
