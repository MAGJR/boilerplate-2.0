import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import {
  FormSection,
  FormSectionDescription,
  FormSectionHeader,
  FormSectionMain,
  FormSectionTitle,
} from '@design-system/react/components/shared/dashboard/form-section'
import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from '@design-system/react/components/shared/dashboard/page'
import { Metadata } from 'next'
import { ApiTokenCard } from './_components/api-token-card'
import { DocumentationCard } from './_components/documentation-card'

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return {
    title: dict.dashboard.settings.integrations.metadata.title,
  }
}

export default async function Page() {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderTitle>
          {dict.dashboard.settings.integrations.title}
        </DashboardPageHeaderTitle>
      </DashboardPageHeader>
      <DashboardPageMain className="container max-w-screen-md">
        <FormSection>
          <FormSectionHeader>
            <FormSectionTitle>
              {dict.dashboard.settings.integrations.title}
            </FormSectionTitle>
            <FormSectionDescription>
              {dict.dashboard.settings.integrations.description}
            </FormSectionDescription>
          </FormSectionHeader>
          <FormSectionMain>
            <ApiTokenCard />
            <DocumentationCard />
          </FormSectionMain>
        </FormSection>
      </DashboardPageMain>
    </DashboardPage>
  )
}
