import { Switch } from '@design-system/react/components/ui/switch'

interface PlanSwitchProps {
  setPeriod: (period: string) => void
  dict: any
}

export function PlanSwitch({ setPeriod, dict }: PlanSwitchProps) {
  return (
    <p className="flex items-center justify-between text-sm mb-4 text-muted-foreground">
      {
        dict.dashboard.settings.billing.form.fields.changePlan.description
          .annual
      }
      <Switch
        id="yearly-billing"
        onCheckedChange={(event) => {
          setPeriod(event ? 'year' : 'month')
        }}
      />
    </p>
  )
}
