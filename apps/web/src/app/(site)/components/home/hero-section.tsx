import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { GetStartedButton } from '../shared/get-started-button'

export function HeroSection() {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <div className="relative pt-20 md:pt-20">
      <div className="container max-w-screen-xl z-10">
        <HeroContent dict={dict} />
        <HeroImage />
      </div>
    </div>
  )
}

function HeroContent({ dict }) {
  return (
    <div className="mb-12 text-left">
      <div className="font-normal text-4xl md:text-6xl md:leading-[4.2rem]">
        <h1 className="md:max-w-2xl">{dict.site.sections.hero.title}</h1>
      </div>
      <p className="mt-4 md:max-w-2xl text-muted-foreground md:leading-normal text-xl">
        {dict.site.sections.hero.subtitle}
      </p>
      <div className="flex flex-col items-start space-y-6 mt-12">
        <GetStartedButton />
        <LiveIndicator dict={dict} />
      </div>
    </div>
  )
}

function LiveIndicator({ dict }) {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-[pulse_2s_ease-in-out_infinite]"></div>
      <span className="text-muted-foreground text-xs">
        {dict.site.sections.hero.description}
      </span>
    </div>
  )
}

function HeroImage() {
  return (
    <div className="mt-8 sm:mt-0">
      <div className="rounded-md md:rounded-md-none container max-w-screen-xl p-2 bg-black/5 dark:bg-secondary/90">
        <img
          alt="Guides"
          width={1367}
          height={859}
          decoding="async"
          data-nimg={1}
          sizes="100vw"
          src="/screenshot.png"
          className="hidden dark:block"
          style={{ color: 'transparent', width: '100%', height: 'auto' }}
        />
        <img
          alt="Guides"
          width={1367}
          height={859}
          decoding="async"
          data-nimg={1}
          sizes="100vw"
          src="/screenshot-light.png"
          className="block dark:hidden"
          style={{ color: 'transparent', width: '100%', height: 'auto' }}
        />
      </div>
    </div>
  )
}
