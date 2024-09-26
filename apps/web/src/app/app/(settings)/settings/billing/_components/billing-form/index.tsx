'use client'

import { PlanCard } from '@/app/app/_components/plan-card'
import { useApplication } from '@/app/app/_hooks/application.hook'
import { useDictionary } from '@/services/internationalization/hooks/dictionary.hook'
import { useState } from 'react'
import { CurrentPlanCard } from './current-plan-card'
import { PlanSwitch } from './plan-switch'

export function BillingForm() {
  const { dict } = useDictionary()
  const { billing, plans, session } = useApplication()
  const {
    createAccountManagerForTenant,
    createCheckoutForPlan,
    period,
    isSubmittingCheckout,
    setPeriod,
    isSubmittingManager,
  } = billing

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  const quotas = session.tenant.subscription.features.filter(
    (item) => item.quota,
  )

  function handleCreateCheckout(paymentProviderId: string) {
    setSelectedPlanId(paymentProviderId)
    createCheckoutForPlan(paymentProviderId)
  }

  function isLoadingCheckout(paymentProviderId: string) {
    return isSubmittingCheckout && paymentProviderId === selectedPlanId
  }

  return (
    <>
      <CurrentPlanCard
        subscription={session.tenant.subscription}
        createAccountManagerForTenant={createAccountManagerForTenant}
        isSubmittingManager={isSubmittingManager}
        dict={dict}
        quotas={quotas}
      />
      <div>
        <header>
          <h3 className="font-semibold">
            {dict.dashboard.settings.billing.form.fields.changePlan.label}
          </h3>

          <PlanSwitch
            setPeriod={(period) => setPeriod(period as 'month' | 'year')}
            dict={dict}
          />
        </header>

        <main className="space-y-4">
          {plans
            .filter(
              (plan) => plan.id !== session.tenant.subscription.currentPlan.id,
            )
            .sort(
              (a, b) =>
                a.prices.find((pr) => pr.interval === period).price -
                b.prices.find((pr) => pr.interval === period).price,
            )
            .map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                period={period}
                isCurrentPlan={
                  plan.id === session.tenant.subscription.currentPlan.id
                }
                onUpgrade={handleCreateCheckout}
                isLoading={isLoadingCheckout(
                  plan.prices.find((pr) => pr.interval === period)
                    .paymentProviderId,
                )}
              />
            ))}
        </main>
      </div>
    </>
  )
}
