import Link from 'next/link'

import { shared } from '@app/shared'
import { Button } from '@design-system/react/components/ui/button'
import { ArrowLeft, HelpCircle } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
  dict: any // Replace 'any' with the correct type for your dictionary
}

export function AuthLayout({ children, dict }: AuthLayoutProps) {
  return (
    <main className="h-screen flex flex-col justify-between overflow-hidden">
      <header className="flex items-center sticky top-0 justify-between p-8">
        <BackButton />
        <SupportButton dict={dict} />
      </header>
      <main className="flex items-start md:items-center justify-center p-8">
        <div className="w-[26rem]">{children}</div>
      </main>
      <Footer />
    </main>
  )
}

function BackButton() {
  return (
    <Link href="/">
      <Button variant="secondary" size="icon" className="rounded-full">
        <ArrowLeft className="w-4 h-4" />
      </Button>
    </Link>
  )
}

function SupportButton({ dict }: { dict: any }) {
  return (
    <Link
      href={shared.config.application.links.support}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button variant="outline" className="rounded-full">
        <HelpCircle className="w-3 h-3 mr-2" />
        {dict.auth.main.button.label}
      </Button>
    </Link>
  )
}

function Footer() {
  return (
    <footer className="flex justify-center p-8 opacity-40">
      <span>
        © {new Date().getFullYear()} {shared.config.application.name}. All
        rights reserved.
      </span>
    </footer>
  )
}
