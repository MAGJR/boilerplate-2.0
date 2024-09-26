import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { GetStartedButton } from '../shared/get-started-button'

export function EfficiencySection() {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <section className="opacity-1 transform perspective-1200 py-16">
      <div className="container max-w-screen-xl grid md:grid-cols-2 gap-12">
        <EfficiencyHeader dict={dict} />
        <EfficiencyContent dict={dict} />
      </div>
    </section>
  )
}

function EfficiencyHeader({ dict }) {
  return (
    <div>
      <h3 className="text-3xl font-normal max-w-[80%] mb-4">
        {dict.site.sections.efficiency.header.title}
      </h3>
      <GetStartedButton />
    </div>
  )
}

function EfficiencyContent({ dict }) {
  return (
    <div>
      <p className="opacity-80 text-lg">
        {dict.site.sections.efficiency.main.description}
      </p>
      <div className="mt-8 grid grid-cols-3 gap-4">
        <EfficiencyDetail
          value="20%"
          description={dict.site.sections.efficiency.main.details[0]}
        />
        <EfficiencyDetail
          value="-82%"
          description={dict.site.sections.efficiency.main.details[1]}
        />
        <EfficiencyDetail
          value="-15%"
          description={dict.site.sections.efficiency.main.details[2]}
        />
      </div>
    </div>
  )
}

function EfficiencyDetail({ value, description }) {
  return (
    <div>
      <p className="text-primary font-bold">{value}</p>
      <p className="opacity-80">{description}</p>
    </div>
  )
}
