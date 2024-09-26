import React from 'react'

import { shared } from '@app/shared'
import { cn } from '@design-system/react/helpers/cn'

export function Logo(props: {
  className?: string
  onlyIcon?: boolean
}): React.ReactElement {
  if (props.onlyIcon) {
    return (
      <>
        <img
          src={shared.config.application.brand.logos.icon.dark}
          alt={shared.config.application.name}
          className={cn('h-12 dark:hidden', props.className)}
        />
        <img
          src={shared.config.application.brand.logos.icon.light}
          alt={shared.config.application.name}
          className={cn('h-12 hidden dark:block', props.className)}
        />
      </>
    )
  }

  return (
    <>
      <img
        src={shared.config.application.brand.logos.full.dark}
        alt={shared.config.application.name}
        className={cn('h-12 dark:hidden', props.className)}
      />
      <img
        src={shared.config.application.brand.logos.full.light}
        alt={shared.config.application.name}
        className={cn('h-12 hidden dark:block', props.className)}
      />
    </>
  )
}
