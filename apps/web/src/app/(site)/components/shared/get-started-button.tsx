import Link from 'next/link'

import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { Button } from '@design-system/react/components/ui/button'
import { ArrowRightIcon } from 'lucide-react'

export function GetStartedButton() {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <Button className="rounded-full" variant="outline" asChild>
      <Link href="/auth" className="w-fit">
        {dict.site.sections.cta.ctaButton.label}
        <ArrowRightIcon className="w-4 h-4 ml-4" />
      </Link>
    </Button>
  )
}
