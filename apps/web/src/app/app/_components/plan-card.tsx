import { parseUnitPrice } from '@app/shared'
import { Button } from '@design-system/react/components/ui/button'
import { ArrowRightIcon, CheckIcon, LoaderIcon } from 'lucide-react'

interface PlanCardProps {
  plan: any
  period: string
  isCurrentPlan: boolean
  onUpgrade: (paymentProviderId: string) => void
  isLoading: boolean
}

export function PlanCard({
  plan,
  period,
  isCurrentPlan,
  onUpgrade,
  isLoading,
}: PlanCardProps) {
  const { paymentProviderId, price } = plan.prices.find(
    (pr) => pr.interval === period,
  )

  return (
    <div className="overflow-hidden rounded-lg border border-border shadow-sm mb-6">
      <div className="flex">
        <div className="w-1/3 bg-primary p-6 text-white flex flex-col">
          <div className="text-4xl font-bold mb-1">{parseUnitPrice(price)}</div>
          <div className="text-sm mb-6 opacity-60">/ {period}</div>

          <div className="flex flex-col gap-2 mt-auto">
            <div className="text-xs opacity-60">Cancel anytime</div>

            <Button
              variant="secondary"
              className="w-full bg-white text-primary hover:bg-gray-100 mt-auto"
              onClick={() => onUpgrade(paymentProviderId)}
              disabled={isCurrentPlan || isLoading}
            >
              {isCurrentPlan ? (
                <>
                  <span>Current Plan</span>
                  <CheckIcon className="w-4 h-4 ml-auto" />
                </>
              ) : isLoading ? (
                <>
                  <span>Processing...</span>
                  <LoaderIcon className="w-4 h-4 ml-auto animate-spin" />
                </>
              ) : (
                <>
                  <span>Upgrade now</span>
                  <ArrowRightIcon className="w-4 h-4 ml-auto" />
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="w-2/3 bg-white p-6">
          <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {plan.description}
          </p>

          <ul className="space-y-2">
            {plan.features.map((feature) => (
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
              Our support team is here to help you with any questions or issues
              you may have.
            </p>

            <Button variant="link">Contact us</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
