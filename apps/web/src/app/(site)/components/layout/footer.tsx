'use client'

import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { shared } from '@app/shared'
import { Separator } from '@design-system/react/components/ui/separator'
import { Linkedin, Twitter } from 'lucide-react'

export function Footer() {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <footer className="border-t border-border relative">
      <div className="border-t border-border pt-8 text-sm">
        <div className="container max-w-screen-xl flex flex-col md:flex-row text-center md:text-left justify-between opacity-60">
          <Copyright dict={dict} />
          <FooterLinks dict={dict} />
        </div>
      </div>
    </footer>
  )
}

function Copyright({ dict }) {
  return (
    <p className="mb-8 md:mb-0">
      &copy; {new Date().getFullYear()} {shared.config.application.name}.{' '}
      {dict.site.layout.footer.rights}
    </p>
  )
}

function FooterLinks({ dict }) {
  return (
    <ul className="flex flex-col md:flex-row space-y-2 h-4 md:space-x-8 items-center md:space-y-0">
      <FooterLink
        href={shared.config.application.links.terms}
        label={dict.site.layout.footer.terms}
      />
      <FooterLink
        href={shared.config.application.links.privacy}
        label={dict.site.layout.footer.privacy}
      />
      <li>
        <Separator orientation="vertical" className="h-3" />
      </li>
      <SocialLink
        href={shared.config.application.links.twitter}
        icon={<Twitter className="w-4 h-4" />}
        label="Twitter"
      />
      <SocialLink
        href={shared.config.application.links.linkedin}
        icon={<Linkedin className="w-4 h-4" />}
        label="LinkedIn"
      />
    </ul>
  )
}

function FooterLink({ href, label }) {
  return (
    <li className="mr-4">
      <a href={href}>{label}</a>
    </li>
  )
}

function SocialLink({ href, icon, label }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="rounded-md p-2 transition-colors dark:text-white/60 dark:hover:bg-white/10 dark:active:bg-white/20"
      >
        <span className="sr-only">{label}</span>
        {icon}
      </a>
    </li>
  )
}
