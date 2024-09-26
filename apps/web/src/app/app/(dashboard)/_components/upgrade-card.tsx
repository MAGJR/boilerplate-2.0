import Link from 'next/link'

import { useDictionary } from '@/services/internationalization/hooks/dictionary.hook'
import { Progress } from '@design-system/react/components/ui/progress'
import { ArrowRightIcon } from 'lucide-react'
import { useApplication } from '../../_hooks/application.hook'

export function UpgradeCard() {
  const { session } = useApplication()
  const { dict } = useDictionary()

  const tokensQuota = session.tenant.subscription.features.find(
    (feature) => feature.id === 'TEAM_MEMBERS',
  ).quota

  function progressColor(value: number) {
    if (value < 60) return 'primary'
    if (value < 90) return 'warning'
    return 'danger'
  }

  return (
    <div className="mb-8 flex flex-col gap-3 px-4">
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold">
          {dict.dashboard.sidebar.sections.upgradeCard.items.seats}
        </p>

        <p className="text-sm text-muted-foreground">
          {tokensQuota.usage} / {tokensQuota.total}
        </p>
      </div>
      <Progress
        className="w-full h-3"
        value={tokensQuota.usageRate}
        color={progressColor(tokensQuota.usageRate)}
      />
      <Link
        href="/app/settings/billing"
        className="flex gap-1 items-center group justify-between text-muted-foreground"
      >
        <p className="text-sm font-medium group-hover:text-primary">
          {dict.dashboard.sidebar.sections.upgradeCard.items.manageSubscription}
        </p>
        <ArrowRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
      </Link>
    </div>
  )
}
