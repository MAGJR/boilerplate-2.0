import { Logo } from '@/components/logo'
import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { shared } from '@app/shared'
import { Button } from '@design-system/react/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '@design-system/react/components/ui/drawer'
import { cn } from '@design-system/react/helpers/cn'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <header className="sticky top-0 z-20 backdrop-blur-sm">
      <div className="container max-w-screen-xl flex items-center justify-between py-4 text-xs">
        <HeaderLogo />
        <MobileMenu dict={dict} />
        <DesktopMenu dict={dict} />
      </div>
    </header>
  )
}

function HeaderLogo() {
  return (
    <div className="flex items-center">
      <Link href="/" className="hover:opacity-60 flex items-center">
        <Logo onlyIcon className="h-9 w-9 mr-4" />
        <span className="text-md font-semibold">
          {shared.config.application.name}
        </span>
      </Link>
    </div>
  )
}

function MobileMenu({ dict }) {
  return (
    <div className="md:hidden">
      <Drawer>
        <DrawerTrigger className="text-4xl">☰</DrawerTrigger>
        <DrawerContent>
          <DrawerFooter className="space-y-2">
            <MobileMenuItem
              href="/"
              label={dict.site.layout.header.nav.start}
            />
            <MobileMenuItem
              href="/pricing"
              label={dict.site.layout.header.nav.pricing}
            />
            <MobileMenuItem
              href="/auth"
              label={dict.site.layout.header.nav.button.label}
            />
            <MobileMenuItem
              href="/auth"
              label={dict.site.layout.header.nav.ctaButton.label}
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function MobileMenuItem({ href, label }) {
  return (
    <Link
      href={href}
      className="text-lg font-medium border-b border-border py-4 w-full flex"
    >
      {label}
    </Link>
  )
}

function DesktopMenu({ dict }) {
  return (
    <div className={cn(['md:flex items-center hidden justify-end space-x-8'])}>
      <nav
        className="!space-x-8 items-center justify-center opacity-80 ml-8"
        id="mobile-menu"
      >
        <DesktopMenuItem href="/" label={dict.site.layout.header.nav.start} />
        <DesktopMenuItem
          href="/#features"
          label={dict.site.layout.header.nav.features}
        />
        <DesktopMenuItem
          href="/pricing"
          label={dict.site.layout.header.nav.pricing}
        />
        <DesktopMenuItem
          href="/blog"
          label={dict.site.layout.header.nav.blog}
        />
        <DesktopMenuItem
          href="/changelog"
          label={dict.site.layout.header.nav.changelog}
        />
      </nav>
      <Link href="/auth">
        <Button className="text-xs rounded-full" size="sm">
          {dict.site.layout.header.nav.button.label}
          <ArrowRightIcon className="w-3 h-3 ml-3" />
        </Button>
      </Link>
    </div>
  )
}

function DesktopMenuItem({ href, label }) {
  return (
    <Link href={href} className="font-semibold hover:brightness-125">
      {label}
    </Link>
  )
}
