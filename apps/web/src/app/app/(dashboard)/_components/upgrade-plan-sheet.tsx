'use client'

import { parseUnitPrice, shared } from '@app/shared'
import { Button } from '@design-system/react/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@design-system/react/components/ui/sheet'
import { Switch } from '@design-system/react/components/ui/switch'
import {
  ArrowRightIcon,
  CheckIcon,
  GiftIcon,
  LoaderIcon,
  RocketIcon,
} from 'lucide-react'
import React, { useState } from 'react'
import { useApplication } from '../../_hooks/application.hook'

function PricingCardHeader({ price, period }) {
  return (
    <div className="w-1/3 bg-primary p-6 text-white flex flex-col">
      <div className="text-4xl font-bold mb-1">{parseUnitPrice(price)}</div>
      <div className="text-sm mb-6 opacity-60">/ {period}</div>
    </div>
  )
}

function PricingCardFooter({
  isCurrentPlan,
  isLoading,
  onUpgrade,
  paymentProviderId,
}) {
  return (
    <footer className="flex flex-col gap-2 mt-auto">
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
    </footer>
  )
}

function PricingCardFeatures({ features }) {
  return (
    <ul className="space-y-2">
      {features.map((feature) => (
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
  )
}

function PricingCardBody({ plan }) {
  return (
    <div className="w-2/3 bg-white p-6">
      <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
      <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
      <PricingCardFeatures features={plan.features} />
      <div className="mt-6 pt-6 border-t border-gray-200">
        <strong className="text-sm">Needs help?</strong>
        <p className="text-sm">
          Our support team is here to help you with any questions or issues you
          may have.
        </p>
        <Button variant="link">Contact us</Button>
      </div>
    </div>
  )
}

function PricingCard({ plan, period, isCurrentPlan, onUpgrade, isLoading }) {
  const { paymentProviderId, price } = plan.prices.find(
    (pr) => pr.interval === period,
  )

  return (
    <div className="overflow-hidden rounded-lg border border-border shadow-sm mb-6">
      <div className="flex">
        <PricingCardHeader price={price} period={period} />
        <PricingCardBody plan={plan} />
      </div>
      <PricingCardFooter
        isCurrentPlan={isCurrentPlan}
        isLoading={isLoading}
        onUpgrade={onUpgrade}
        paymentProviderId={paymentProviderId}
      />
    </div>
  )
}

function PeriodToggle({ period, setPeriod }) {
  return (
    <div className="flex justify-center items-center space-x-4 mb-8">
      <span className="text-sm font-medium">Monthly</span>
      <Switch
        checked={period === 'year'}
        onCheckedChange={(checked) => setPeriod(checked ? 'year' : 'month')}
      />
      <span className="text-sm font-medium">Yearly</span>
      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
        <GiftIcon className="w-4 h-4 mr-1" />2 MONTH OFF
      </span>
    </div>
  )
}

function UpgradePlanSheetHeader() {
  return (
    <SheetHeader className="p-6 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center bg-primary/10 h-12 w-12 rounded-full mb-8">
        <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-primary opacity-75"></span>
        <RocketIcon className="h-6 w-6 text-primary" />
      </div>
      <SheetTitle className="text-xl font-bold text-center">
        Upgrade your plan
      </SheetTitle>
      <SheetDescription className="text-center max-w-lg mx-auto mt-4">
        Enjoying <strong>{shared.config.application.name}</strong>? Upgrade to a
        paid plan to access premium features, remove limitations, and unlock
        advanced tools that will take your experience to the next level.
      </SheetDescription>
    </SheetHeader>
  )
}

function PlanList({
  plans,
  session,
  period,
  handleUpgrade,
  isLoadingCheckout,
}) {
  return plans
    .sort((a, b) => {
      if (a.id === session.tenant.subscription.currentPlan.id) return 1
      if (b.id === session.tenant.subscription.currentPlan.id) return -1
      return (
        a.prices.find((pr) => pr.interval === period).price -
        b.prices.find((pr) => pr.interval === period).price
      )
    })
    .map((plan, index, sortedPlans) => (
      <React.Fragment key={plan.id}>
        {plan.id === session.tenant.subscription.currentPlan.id ? (
          <div className="my-12">
            <h3 className="text-lg font-semibold text-center mb-4">
              Your Current Plan
            </h3>
          </div>
        ) : (
          index === sortedPlans.length - 1 &&
          index !== 0 && <div className="my-6 border-t border-gray-200" />
        )}
        <PricingCard
          plan={plan}
          period={period}
          isCurrentPlan={plan.id === session.tenant.subscription.currentPlan.id}
          onUpgrade={handleUpgrade}
          isLoading={isLoadingCheckout(
            plan.prices.find((pr) => pr.interval === period).paymentProviderId,
          )}
        />
      </React.Fragment>
    ))
}

export function UpgradePlanSheet() {
  const { billing, plans, session } = useApplication()

  const {
    period,
    setPeriod,
    createCheckoutForPlan,
    isSubmittingCheckout,
    upgradePlanSheet,
  } = billing

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  const handleUpgrade = async (paymentProviderId: string) => {
    setSelectedPlanId(paymentProviderId)
    await createCheckoutForPlan(paymentProviderId)
    upgradePlanSheet.onClose()
  }

  function isLoadingCheckout(paymentProviderId: string) {
    return isSubmittingCheckout && paymentProviderId === selectedPlanId
  }

  return (
    <Sheet
      open={upgradePlanSheet.isOpen}
      onOpenChange={upgradePlanSheet.onToggle}
    >
      <SheetContent
        side="left"
        className="w-full md:w-full md:-max-w-full p-0 overflow-y-auto"
      >
        <div className="container max-w-screen-lg pt-16">
          <UpgradePlanSheetHeader />
          <div className="p-6">
            <PeriodToggle period={period} setPeriod={setPeriod} />
            <PlanList
              plans={plans}
              session={session}
              period={period}
              handleUpgrade={handleUpgrade}
              isLoadingCheckout={isLoadingCheckout}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
