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
import { SettingsTeamForm } from './_components/settings-team-form'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return {
    title: dict.dashboard.settings.team.metadata.title,
  }
}

export default async function Page() {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderTitle>
          {dict.dashboard.settings.team.title}
        </DashboardPageHeaderTitle>
      </DashboardPageHeader>
      <DashboardPageMain className="container max-w-screen-md">
        <FormSection>
          <FormSectionHeader>
            <FormSectionTitle>
              {dict.dashboard.settings.team.title}
            </FormSectionTitle>
            <FormSectionDescription>
              {dict.dashboard.settings.team.description}
            </FormSectionDescription>
          </FormSectionHeader>
          <FormSectionMain>
            <SettingsTeamForm />
          </FormSectionMain>
        </FormSection>
      </DashboardPageMain>
    </DashboardPage>
  )
}
