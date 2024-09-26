import Link from 'next/link'
import React from 'react'

import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { Button } from '@design-system/react/components/ui/button'
import { ArrowLeft } from 'lucide-react'

type DefaultProps = React.PropsWithChildren<{
  className?: string
}>

export function Breadcrumb({ children }: DefaultProps) {
  return <div>{children}</div>
}

export function BreadcrumbContainer({ children }: DefaultProps) {
  return (
    <div className="container max-w-screen-xl flex items-center justify-between h-14 text-sm">
      {children}
    </div>
  )
}

export function BreadcrumbPreviousButton() {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <Button asChild variant="link">
      <Link
        href="/"
        className="flex items-center text-muted-foreground hover:brightness-75"
      >
        <ArrowLeft className="w-3 h-3 mr-2" />
        {dict.site.breadcrumb.backButton.label}
      </Link>
    </Button>
  )
}

export function BreadcrumbPreviousNav({ children }: DefaultProps) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="list-none p-0 inline-flex items-center space-x-4">
        {React.Children.map(children, (child, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-muted-foreground mx-2">/</span>}
            {child}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}

type BreadcrumbPreviousNavItemProps = {
  href: string
  title: string
} & DefaultProps

export function BreadcrumbPreviousNavItem({
  href,
  title,
}: BreadcrumbPreviousNavItemProps) {
  return (
    <li className="inline">
      <Link href={href} className="text-muted-foreground hover:brightness-75">
        {title}
      </Link>
    </li>
  )
}
