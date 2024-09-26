import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { shared } from '@app/shared'
import { Separator } from '@design-system/react/components/ui/separator'
import { Metadata } from 'next'
import { FAQSection } from '../components/home/faq-section'
import {
  Breadcrumb,
  BreadcrumbContainer,
  BreadcrumbPreviousButton,
  BreadcrumbPreviousNav,
  BreadcrumbPreviousNavItem,
} from '../components/shared/breadcrumb'
import { CTASection } from '../components/shared/cta-section'
import { PricingSection } from '../components/shared/pricing-section'

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return {
    title: dict.site.sections.pricing.metadata.title,
    description: dict.site.sections.pricing.metadata.description,
  }
}

export default function Page() {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbContainer>
          <BreadcrumbPreviousButton />
          <BreadcrumbPreviousNav>
            <BreadcrumbPreviousNavItem
              title={shared.config.application.name}
              href="/"
            />
            <BreadcrumbPreviousNavItem title="Pricing" href="/pricing" />
          </BreadcrumbPreviousNav>
        </BreadcrumbContainer>
      </Breadcrumb>

      <PricingSection />
      <Separator />
      <FAQSection />
      <CTASection />
    </>
  )
}
