import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from '@design-system/react/components/shared/dashboard/page'
import { GetStartedSection } from './_components/get-started'
import { Metadata } from 'next'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'

export const metadata: Metadata = {
  title: 'Onboarding',
}

export default function Page() {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <DashboardPage>
      <DashboardPageHeader className="border-0">
        <DashboardPageHeaderTitle>
          {dict.dashboard.onboarding.title}
        </DashboardPageHeaderTitle>
      </DashboardPageHeader>
      <DashboardPageMain className="space-y-4 flex items-center">
        <div className="container max-w-screen-lg">
          <GetStartedSection />
        </div>
      </DashboardPageMain>
    </DashboardPage>
  )
}
