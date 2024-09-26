'use client'

import { useApplication } from '@/app/app/_hooks/application.hook'
import { useDictionary } from '@/services/internationalization/hooks/dictionary.hook'
import { PluginWithFields } from '@app/shared'
import { Button } from '@design-system/react/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
} from '@design-system/react/components/ui/card'
import { cn } from '@design-system/react/helpers/cn'
import { PluginCardDialog } from './plugin-card-dialog'

type PluginCardProps = {
  groupKey: string
  pluginKey: string
  data: PluginWithFields
}

export function PluginCard({
  groupKey,
  pluginKey,
  data: plugin,
}: PluginCardProps) {
  const { dict } = useDictionary()
  const { session } = useApplication()

  const pluginSettings =
    session.tenant.settings?.plugins?.[groupKey]?.[pluginKey]
  const isPluginEnabled = pluginSettings?.enabled ?? false

  return (
    <Card
      className={cn(
        'grid grid-rows-[3fr_auto] bg-card',
        plugin.options?.commingSoon && '!opacity-60 pointer-events-none',
      )}
    >
      <CardContent className="flex flex-col justify-between space-y-4 p-8">
        <img
          src={plugin.icon}
          width={32}
          height={32}
          alt="Icon"
          className="rounded-md w-12 h-12 object-cover"
        />

        <div>
          <h3 className="font-bold">{plugin.name}</h3>
          <p className="text-muted-foreground">{plugin.description}</p>
        </div>
      </CardContent>
      <CardFooter>
        <PluginCardDialog
          groupKey={groupKey}
          pluginKey={pluginKey}
          data={plugin}
        >
          <Button size="sm" variant="outline">
            {isPluginEnabled ? (
              <>
                <div className="h-2 w-2 mr-3 bg-green-500 rounded-full !opacity-100" />
                {dict.dashboard.plugins.status.installed}
              </>
            ) : (
              dict.dashboard.plugins.status.install
            )}
          </Button>
        </PluginCardDialog>
      </CardFooter>
    </Card>
  )
}
