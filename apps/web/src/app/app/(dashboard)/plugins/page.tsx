import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { shared } from '@app/shared'
import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from '@design-system/react/components/shared/dashboard/page'
import { Metadata } from 'next'
import { PluginGroupFeed } from './_components/plugin-group-feed'

export const revalidate = 0
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return {
    title: dict.dashboard.plugins.metadata.title,
  }
}

export default function Page() {
  const pluginGroups = shared.provider.plugin.groups.list()

  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <DashboardPage>
      <DashboardPageHeader className="border-0">
        <DashboardPageHeaderTitle>
          {dict.dashboard.plugins.title}
        </DashboardPageHeaderTitle>
      </DashboardPageHeader>
      <DashboardPageMain>
        <div className="md:container md:max-w-screen-lg space-y-8">
          {Array.isArray(pluginGroups) &&
            pluginGroups.map((group) => (
              <PluginGroupFeed
                key={group.key}
                groupKey={group.key}
                title={group.name}
                subtitle={group.description}
                plugins={group.plugins}
              />
            ))}
        </div>
      </DashboardPageMain>
    </DashboardPage>
  )
}
