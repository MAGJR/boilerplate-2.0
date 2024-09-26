import Link from 'next/link'

import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { parseUnitPrice } from '@app/shared'
import { Badge } from '@design-system/react/components/ui/badge'
import { Button } from '@design-system/react/components/ui/button'
import { Separator } from '@design-system/react/components/ui/separator'
import { Skeleton } from '@design-system/react/components/ui/skeleton'
import { cn } from '@design-system/react/helpers/cn'
import { CheckSquare2Icon, XSquareIcon } from 'lucide-react'
import { Suspense } from 'react'
import { getPublicPlansAction } from '../../actions'

export function PricingSection() {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <section className="py-16 relative">
      <div className="container max-w-screen-xl">
        <PricingHeader dict={dict} />
        <PricingCards />
      </div>
    </section>
  )
}

function PricingHeader({ dict }) {
  return (
    <div className="mb-8">
      <Badge variant="secondary" className="mb-6">
        {dict.site.sections.pricing.header.badge}
      </Badge>
      <h3 className="text-3xl font-normal max-w-[80%] mb-4">
        {dict.site.sections.pricing.header.title[0]}
        <br /> {dict.site.sections.pricing.header.title[1]}
      </h3>
      <p className="text-muted-foreground text-lg md:max-w-[40%]">
        {dict.site.sections.pricing.header.description}
      </p>
    </div>
  )
}

function PricingCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Suspense fallback={<PricingCardsSkeleton />}>
        <PricingSectionCards />
      </Suspense>
    </div>
  )
}

function PricingCardsSkeleton() {
  return (
    <>
      <Skeleton className="h-[596px] rounded-md" />
      <Skeleton className="h-[596px] rounded-md" />
      <Skeleton className="h-[596px] rounded-md" />
    </>
  )
}

async function PricingSectionCards() {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)
  const plans = await getPublicPlansAction()

  return (
    <>
      {plans.map((plan) => (
        <PricingCard key={plan.id} plan={plan} dict={dict} />
      ))}
    </>
  )
}

function PricingCard({ plan, dict }) {
  const price = plan.prices.find((plan) => plan.interval === 'month')

  return (
    <div className="p-8 bg-background shadow-sm rounded-lg border border-border">
      <h3 className="text-xm font-semibold">{plan.name}</h3>
      <p className="mb-8 text-muted-foreground line-clamp-2">
        {plan.description}
      </p>
      <p className="text-4xl font-bold mb-4">
        {parseUnitPrice(price.price)} / mo
      </p>
      <Separator className="my-8" />
      <PlanFeatures features={plan.features} />
      <Link href="/auth">
        <Button className="w-full rounded-md">
          {dict.site.sections.pricing.main.submit.label}
        </Button>
      </Link>
    </div>
  )
}

function PlanFeatures({ features }) {
  return (
    <ul className="mb-12 space-y-4">
      {features.map((metadata) => {
        const enabled = Number(metadata.value) || metadata.value === 'true'
        return (
          <li key={metadata.id} className="flex items-center">
            {enabled ? (
              <CheckSquare2Icon className="mr-2" />
            ) : (
              <XSquareIcon className="mr-2 opacity-40" />
            )}
            <span
              className={cn([!enabled && 'line-through text-muted-foreground'])}
            >
              {metadata.label}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
