'use client'

import Link from 'next/link'

import { useApplication } from '@/app/app/_hooks/application.hook'
import { useDictionary } from '@/services/internationalization/hooks/dictionary.hook'
import { PluginWithFields } from '@app/shared'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@design-system/react/components/ui/alert'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@design-system/react/components/ui/sheet'
import { cn } from '@design-system/react/helpers/cn'
import { ArrowUpRight, HelpCircleIcon } from 'lucide-react'
import { PropsWithChildren, useRef } from 'react'
import { PluginCardDialogForm } from './plugin-card-dialog-form'

type PluginCardDialogProps = PropsWithChildren<{
  groupKey: string
  pluginKey: string
  data: PluginWithFields
}>

export function PluginCardDialog({
  groupKey,
  pluginKey,
  data: plugin,
  children,
}: PluginCardDialogProps) {
  const dialog = useRef<HTMLDivElement>(null)

  const { dict } = useDictionary()
  const { session } = useApplication()

  const pluginSettings =
    session.tenant.settings.plugins?.[groupKey]?.[pluginKey]
  const isPluginEnabled = pluginSettings?.enabled ?? false

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div ref={dialog}>{children}</div>
      </SheetTrigger>
      <SheetContent
        className={cn(
          'overflow-y-auto pb-0 grid grid-rows-[auto_auto_1fr] h-full md:max-w-lg',
          plugin.options?.customClass,
        )}
      >
        <SheetHeader>
          <SheetTitle>
            {isPluginEnabled &&
              dict.dashboard.plugins.notifications.dialog.title[0]}
            {!isPluginEnabled &&
              dict.dashboard.plugins.notifications.dialog.title[1]}
          </SheetTitle>
        </SheetHeader>
        <div className="pt-4 flex-1">
          <img
            src={plugin.icon}
            width={32}
            height={32}
            alt="Icon"
            className="rounded-md mb-4 w-12 h-12 object-cover"
          />

          <div className="space-y-1">
            <h3 className="font-bold">{plugin.name}</h3>
            <p className="text-muted-foreground">{plugin.description}</p>
          </div>

          {plugin.options.help && (
            <Alert className="mb-4 mt-4">
              <HelpCircleIcon className="h-4 w-4" />
              <AlertTitle className="font-bold text-sm">
                {plugin.options.help.title ||
                  dict.dashboard.plugins.notifications.dialog.help.title}
              </AlertTitle>
              <AlertDescription className="flex flex-col space-y-2 text-sm">
                <p>
                  {plugin.options.help.description ||
                    dict.dashboard.plugins.notifications.dialog.help
                      .description}
                </p>
                {plugin.options.help.link && (
                  <Link
                    href={plugin.options.help.link.url}
                    target="_blank"
                    className="font-bold text-primary inline-flex items-center"
                  >
                    {plugin.options.help.link.label}
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <PluginCardDialogForm
          groupKey={groupKey}
          pluginKey={pluginKey}
          data={plugin}
          onClose={() => dialog.current?.click()}
        />
      </SheetContent>
    </Sheet>
  )
}
