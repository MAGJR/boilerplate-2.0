import { parseUnitPrice } from '@app/shared'
import { Button } from '@design-system/react/components/ui/button'
import { CheckIcon, ExternalLink, LoaderIcon } from 'lucide-react'
import { QuotaDisplay } from './quota-display'

interface CurrentPlanCardProps {
  subscription: any
  createAccountManagerForTenant: () => void
  isSubmittingManager: boolean
  dict: any
  quotas: any
}

export function CurrentPlanCard({
  subscription,
  createAccountManagerForTenant,
  isSubmittingManager,
  dict,
  quotas,
}: CurrentPlanCardProps) {
  const currentPlan = subscription?.currentPlan
  const currentPrice = currentPlan?.prices?.find(
    (pr) => pr.interval === currentPlan.paymentInterval,
  )
  const price = currentPrice?.price ?? 0
  const interval = currentPrice?.interval ?? 'month'

  if (!currentPlan) {
    return null // or some fallback UI
  }

  return (
    <div className="mb-8 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">
          {dict.dashboard.settings.billing.form.fields.currentPlan.label}
        </h3>
        <Button
          variant="link"
          onClick={createAccountManagerForTenant}
          disabled={isSubmittingManager}
        >
          {isSubmittingManager ? (
            <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ExternalLink className="w-4 h-4 mr-2" />
          )}
          {dict.dashboard.settings.billing.form.fields.external.label}
        </Button>
      </div>
      <div>
        <div className="space-y-6 border-t border-none">
          {quotas.map((item) =>
            item.quota ? <QuotaDisplay key={item.id} item={item} /> : null,
          )}
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-border shadow-sm">
        <div className="flex">
          <div className="w-1/3 bg-primary p-6 text-white flex flex-col">
            <div className="text-4xl font-bold mb-1">
              {parseUnitPrice(price)}
            </div>
            <div className="text-sm mb-6 opacity-60">/ {interval}</div>

            <footer className="flex flex-col gap-2 mt-auto">
              <div className="text-xs opacity-60">Cancel anytime</div>

              <Button
                variant="secondary"
                className="w-full bg-white text-primary hover:bg-gray-100 mt-auto"
                disabled={true}
              >
                <span>Current Plan</span>
                <CheckIcon className="w-4 h-4 ml-auto" />
              </Button>
            </footer>
          </div>
          <div className="w-2/3 bg-white p-6">
            <h2 className="text-xl font-bold mb-2">{currentPlan.name}</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {currentPlan.description}
            </p>

            <ul className="space-y-2">
              {currentPlan.features.map((feature) => (
                <li key={feature.id} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-primary mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>{feature.label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <strong className="text-sm">Needs help?</strong>
              <p className="text-sm">
                Our support team is here to help you with any questions or
                issues you may have.
              </p>

              <Button variant="link">Contact us</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
