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
import { BillingForm } from './_components/billing-form'

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return {
    title: dict.dashboard.settings.billing.title,
  }
}

export default async function Page() {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderTitle>
          {dict.dashboard.settings.billing.title}
        </DashboardPageHeaderTitle>
      </DashboardPageHeader>
      <DashboardPageMain className="container max-w-screen-md">
        <FormSection>
          <FormSectionHeader>
            <FormSectionTitle>
              {dict.dashboard.settings.billing.title}
            </FormSectionTitle>
            <FormSectionDescription>
              {dict.dashboard.settings.billing.description}
            </FormSectionDescription>
          </FormSectionHeader>
          <FormSectionMain className="!space-y-8">
            <BillingForm />
          </FormSectionMain>
        </FormSection>
      </DashboardPageMain>
    </DashboardPage>
  )
}
