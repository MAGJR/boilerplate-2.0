import { ApplicationProvider } from '@/app/app/_contexts/application.context'
import { sessionProvider } from '@/services/session'
import { getPlansAction } from './(settings)/settings/billing/actions'

export const revalidate = 0
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await sessionProvider.getApplicationSession()
  const plans = await getPlansAction()

  return (
    <ApplicationProvider session={session} plans={plans}>
      {children}
    </ApplicationProvider>
  )
}
