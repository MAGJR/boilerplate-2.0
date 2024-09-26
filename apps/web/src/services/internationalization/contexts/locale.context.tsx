'use client'

import {
  DEFAULT_DICT,
  LocaleDict,
  LocalesEnum,
  getDictionary,
} from '@/services/internationalization/helpers/get-dictionary'

import React, { PropsWithChildren, createContext } from 'react'

interface LocaleContextProps {
  dict: LocaleDict
}

export const LocaleContext = createContext<LocaleContextProps>({
  dict: DEFAULT_DICT,
})

export const LocaleProvider: React.FC<
  PropsWithChildren<{
    locale: LocalesEnum
  }>
> = ({ children, locale }) => {
  return (
    <LocaleContext.Provider
      value={{
        dict: getDictionary(locale),
      }}
    >
      {children}
    </LocaleContext.Provider>
  )
}
