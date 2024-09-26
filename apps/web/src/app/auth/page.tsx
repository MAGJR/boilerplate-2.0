import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { shared } from '@app/shared'
import { Metadata } from 'next'
import { AuthForm } from './_components/auth-form'
import { AuthLayout } from './_components/auth-layout'

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return {
    title: dict.auth.metadata.title,
    description: `${dict.auth.metadata.description[0]} ${shared.config.application.name}. ${dict.auth.metadata.description[1]}`,
  }
}

export default function Page() {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <AuthLayout dict={dict}>
      <AuthForm />
    </AuthLayout>
  )
}
