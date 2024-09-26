import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { Separator } from '@design-system/react/components/ui/separator'
import { Metadata } from 'next'
import { EfficiencySection } from './components/home/eficiency-section'
import { FAQSection } from './components/home/faq-section'
import { FeaturesSection } from './components/home/features-section'
import { HeroSection } from './components/home/hero-section'
import { MorePossibilitiesSection } from './components/home/more-possibilities-section'
import { CTASection } from './components/shared/cta-section'
import { PricingSection } from './components/shared/pricing-section'

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return {
    title: dict.site.title,
    description: dict.site.description,
  }
}

export default function Page() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <Separator />
      <MorePossibilitiesSection />
      <Separator />
      <PricingSection />
      <Separator />
      <EfficiencySection />
      <Separator />
      <FAQSection />
      <CTASection />
    </>
  )
}
