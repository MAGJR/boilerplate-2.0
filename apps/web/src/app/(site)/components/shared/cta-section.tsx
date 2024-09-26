import { Logo } from '@/components/logo'
import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { GetStartedButton } from '../shared/get-started-button'

export function CTASection() {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <section className="relative dark:bg-zinc shadow">
      <BackgroundGradient />
      <div className="container max-w-screen-xl z-10 space-y-5 py-16">
        <Logo onlyIcon className="h-9 w-9 mb-10" />
        <CTAContent dict={dict} />
        <CTAButton />
      </div>
    </section>
  )
}

function BackgroundGradient() {
  return (
    <div className="hidden dark:flex absolute inset-0 justify-center">
      <img
        alt="Gradient"
        loading="lazy"
        width={1000}
        height={1000}
        decoding="async"
        data-nimg={1}
        className="blur-3xl opacity-20"
        src="/assets/hero/gradient-dark.svg"
        style={{ color: 'transparent', width: 'auto', height: 'auto' }}
      />
    </div>
  )
}

function CTAContent({ dict }) {
  return (
    <>
      <h1 className="text-[26px] md:max-w-[50%] leading-[32px] sm:text-3xl md:text-5xl md:leading-[55px] font-normal">
        {dict.site.sections.cta.title}
      </h1>
      <p className="mt-4 text-muted-foreground sm:max-w-lg sm:text-xl !mb-16">
        {dict.site.sections.cta.description}
      </p>
    </>
  )
}

function CTAButton() {
  return (
    <div className="mt-16 flex items-center !space-x-4 z-10">
      <GetStartedButton />
    </div>
  )
}
