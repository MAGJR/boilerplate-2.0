import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'

export function FeaturesSection() {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <section className="py-16 shadow">
      <div className="container max-w-screen-xl">
        <FeaturesHeader dict={dict} />
        <FeaturesGrid dict={dict} />
      </div>
    </section>
  )
}

function FeaturesHeader({ dict }) {
  return (
    <header className="mb-12">
      <h3 className="text-3xl font-normal md:max-w-[30%] mb-4">
        {dict.site.sections.features.header.title}
      </h3>
      <p className="opacity-80 text-lg max-w-[70%]">
        {dict.site.sections.features.header.description}
      </p>
    </header>
  )
}

function FeaturesGrid({ dict }) {
  const features = [
    {
      title: dict.site.sections.features.main.features.first.title,
      description: dict.site.sections.features.main.features.first.description,
      icon: '/assets/features/feature-01.svg',
    },
    {
      title: dict.site.sections.features.main.features.second.title,
      description: dict.site.sections.features.main.features.second.description,
      icon: '/assets/features/feature-02.svg',
    },
    {
      title: dict.site.sections.features.main.features.third.title,
      description: dict.site.sections.features.main.features.third.description,
      icon: '/assets/features/feature-03.svg',
    },
  ]

  return (
    <main className="grid md:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </main>
  )
}

function FeatureCard({ title, description, icon }) {
  return (
    <article className="p-8 bg-background shadow-sm rounded-lg border border-border relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-40 overflow-hidden">
        <img src={icon} alt={title} className="w-full h-full object-cover" />
      </div>

      <h4 className="mb-2 font-bold mt-40">{title}</h4>
      <p className="opacity-80">{description}</p>
    </article>
  )
}
