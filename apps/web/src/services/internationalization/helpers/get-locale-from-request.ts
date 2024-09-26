import { shared } from '@app/shared'
import { LocalesEnum } from './get-dictionary'

export function getLocaleFromRequest() {
  return shared.config.application.defaultLanguage as LocalesEnum
}
