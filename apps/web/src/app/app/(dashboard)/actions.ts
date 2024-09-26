'use server'

import { client } from '@/services/actions/clients/tenant.client'
import { getUrl, shared } from '@app/shared'
import { sendFeedbackActionSchema } from './schemas'

export const sendFeedbackAction = client.action({
  name: 'send.feedback',
  type: 'mutate',
  schema: sendFeedbackActionSchema,
  handler: async ({ context, input }) => {
    await fetch(getUrl('/api/v1/event'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: shared.config.application.providers.analytics.notifylog,
      },
      body: JSON.stringify({
        event: 'feedback',
        title: 'User Feedback',
        description: `User ${context.user.name} on ${context.tenant.name} sended a feedback`,
        channel: 'feedback',
        icon: '📝',
        notify: true,
        markdown: input.message,
        identity: {
          email: context.tenant.settings.billing.email,
          name: context.tenant.name ?? '',
          image: context.tenant.logo ?? '',
          properties: {
            plan: context.tenant.subscription.currentPlan.name,
          },
        },
        properties: {
          user: context.user.name,
          email: context.user.email,
        },
      }),
    })
  },
})
