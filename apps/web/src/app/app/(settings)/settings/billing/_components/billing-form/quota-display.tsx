import { formatNumber, interpolate, shared } from '@app/shared'
import { Progress } from '@design-system/react/components/ui/progress'

interface QuotaDisplayProps {
  item: {
    id: string
    quota?: {
      usage: number
      total: number
      usageRate: number
    }
  }
}

export function QuotaDisplay({ item }: QuotaDisplayProps) {
  if (!item.quota) return null

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <label className="block text-sm font-medium" htmlFor="logs">
          {interpolate(
            shared.config.application.providers.billing.meta[item.id].label,
            {
              value: formatNumber(item.quota.usage),
            },
          )}
        </label>
        <span>
          {formatNumber(item.quota.usage)} / {formatNumber(item.quota.total)}
        </span>
      </div>
      <Progress className="w-full h-3" value={item.quota.usageRate} />
    </div>
  )
}
