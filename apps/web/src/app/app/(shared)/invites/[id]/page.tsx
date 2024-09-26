import { redirect } from 'next/navigation'
import { getInviteAction } from './actions'
import { InviteSection } from './invite-section'
import { Metadata } from 'next'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return {
    title: dict.shared.metadata.title,
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const response = await getInviteAction(params)
  if (!response || !response.invite) redirect('/app')
  return <InviteSection data={response} />
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
