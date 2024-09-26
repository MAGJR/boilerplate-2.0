import { LocaleContext } from '@/services/internationalization/contexts/locale.context'
import { useContext } from 'react'

export function useDictionary() {
  return useContext(LocaleContext)
}
