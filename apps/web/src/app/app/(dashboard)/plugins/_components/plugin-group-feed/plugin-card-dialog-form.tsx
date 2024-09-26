'use client'

import { useApplication } from '@/app/app/_hooks/application.hook'
import { useActionForm } from '@/services/actions/implementations/client'
import { useDictionary } from '@/services/internationalization/hooks/dictionary.hook'
import { getUrl, PluginWithFields } from '@app/shared'
import { Button, ButtonIcon } from '@design-system/react/components/ui/button'
import { Form } from '@design-system/react/components/ui/form'
import { SheetFooter } from '@design-system/react/components/ui/sheet'
import { toast } from '@design-system/react/components/ui/use-toast'
import { ArrowRight, Copy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { updatePluginAction } from '../../actions'
import { updatePluginActionSchema } from '../../schemas'
import { PluginFormGenerator } from './plugin-form-generator'

type PluginCardDialogFormProps = PropsWithChildren<{
  groupKey: string
  pluginKey: string
  data: PluginWithFields
  onClose: () => void
}>

export function PluginCardDialogForm({
  groupKey,
  pluginKey,
  data: plugin,
  onClose,
}: PluginCardDialogFormProps) {
  const router = useRouter()
  const { session } = useApplication()
  const { dict } = useDictionary()

  const pluginSettings =
    session.tenant.settings.plugins?.[groupKey]?.[pluginKey] || {}
  const isEnabled = pluginSettings?.enabled ?? false

  const form = useActionForm({
    schema: updatePluginActionSchema,
    action: updatePluginAction,
    defaultValues: {
      groupKey,
      pluginKey,
      data: {
        config: pluginSettings?.config || {},
      },
    },
    onSubmitError: (error) => {
      console.error(error)

      toast({
        title:
          dict.dashboard.plugins.notifications.form.submit.toasts.failed.title,
        description:
          dict.dashboard.plugins.notifications.form.submit.toasts.failed
            .description,
        variant: 'destructive',
      })
    },
    onSubmitSuccess: () => {
      toast({
        title:
          dict.dashboard.plugins.notifications.form.submit.toasts.success.title,
        description:
          dict.dashboard.plugins.notifications.form.submit.toasts.success
            .description,
      })

      router.refresh()
      onClose()
    },
  })

  const webhook = getUrl(
    `/api/webhook/${
      session.tenant.id
    }?providerType=${plugin.key.toUpperCase()}`,
  )

  return (
    <Form {...form} className="flex flex-col h-auto">
      {plugin.options.webhook && (
        <div className="bg-black/5 dark:bg-white/5 rounded-md border border-border">
          <header className="px-6 py-4 flex items-center justify-between border-b dark:border-white/5">
            <span className="text-sm opacity-60">Webhook</span>

            <Button
              type="button"
              variant="link"
              className="rounded-full"
              size="sm"
              onClick={async () => {
                await navigator.clipboard.writeText(webhook)
                toast({
                  title:
                    dict.dashboard.plugins.notifications.form.clickToCopyButton
                      .toast.title,
                  description: `${webhook} ${dict.dashboard.plugins.notifications.form.clickToCopyButton.toast.description}`,
                })
              }}
            >
              {
                dict.dashboard.plugins.notifications.form.clickToCopyButton
                  .label
              }
              <Copy className="w-4 h-4 ml-3" />
            </Button>
          </header>
          <main className="p-6">
            <span className="line-clamp-1">{webhook}</span>
          </main>
        </div>
      )}

      <PluginFormGenerator fields={plugin.fields} form={form as any} />

      <SheetFooter className="md:justify-between mt-auto w-full sticky bottom-0 bg-background top-0 py-6 border-t border-border">
        <Button type="submit" variant="outline" className="!mt-0 mr-2">
          {isEnabled
            ? dict.dashboard.plugins.notifications.form.submit.label[0]
            : dict.dashboard.plugins.notifications.form.submit.label[1]}
          <ButtonIcon
            className="w-4 h-4 ml-3"
            icon={ArrowRight}
            isLoading={form.actionState.isSubmitting}
          />
        </Button>
      </SheetFooter>
    </Form>
  )
}
