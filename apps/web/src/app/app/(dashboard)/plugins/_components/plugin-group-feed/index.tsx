'use client'

import { PluginWithFields } from '@app/shared'
import { PluginCard } from './plugin-card'

type PluginGroupFeedProps = {
  groupKey: string
  title: string
  subtitle: string
  plugins: PluginWithFields[]
}

export function PluginGroupFeed({
  groupKey,
  title,
  subtitle,
  plugins,
}: PluginGroupFeedProps) {
  if (plugins.length === 0) return null

  return (
    <section className="space-y-4">
      <header>
        <h2 className="font-bold">{title}</h2>
        <p className="opacity-60">{subtitle}</p>
      </header>
      <main className="grid md:grid-cols-3 gap-4">
        {plugins.map((plugin) => (
          <PluginCard
            key={plugin.name}
            groupKey={groupKey}
            pluginKey={plugin.key}
            data={plugin}
          />
        ))}
      </main>
    </section>
  )
}
