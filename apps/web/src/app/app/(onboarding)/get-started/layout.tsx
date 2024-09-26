import Link from 'next/link'

import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { shared } from '@app/shared'
import { Button } from '@design-system/react/components/ui/button'
import { ArrowLeftIcon, HelpCircleIcon } from 'lucide-react'
import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return {
    title: dict.onboarding.getStarted.metadata.title,
  }
}

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <main className="h-screen flex flex-col justify-between overflow-hidden">
      <header className="flex items-center sticky top-0 justify-between p-8">
        <Link href={'/app'}>
          <Button variant="secondary" size="icon" className="rounded-full">
            <ArrowLeftIcon className="w-4 h-4" />
          </Button>
        </Link>

        <Link
          href={shared.config.application.links.support}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="rounded-full">
            <HelpCircleIcon className="w-3 h-3 mr-2" />
            Contact Support
          </Button>
        </Link>
      </header>
      <main className="flex items-start md:items-center justify-center p-8">
        <div className="w-[26rem]">{children}</div>
      </main>

      <footer className="flex justify-center p-8 opacity-40">
        <span>
          © {new Date().getFullYear()} {shared.config.application.name}. All
          rights reserved.
        </span>
      </footer>
    </main>
  )
}
