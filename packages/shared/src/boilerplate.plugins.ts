import { DiscordPlugin } from './@plugins/discord'
import { TelegramPlugin } from './@plugins/telegram'

export const plugins = {
  notifications: {
    key: 'notifications',
    name: 'Notifications',
    description: 'Receive your app events as notifications',
    icon: 'bell',
    plugins: {
      discord: new DiscordPlugin(),
      telegram: new TelegramPlugin(),
    },
  },
} as const
