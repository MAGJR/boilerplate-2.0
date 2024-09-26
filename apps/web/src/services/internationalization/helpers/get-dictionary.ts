import { shared } from '@app/shared'
import en from '../dictionaries/en.json'
import pt from '../dictionaries/pt.json'
// import es from '../dictionaries/es.json'

const dictionaries = {
  pt,
  en,
  // es,
}

export const dictionariesOptions = [
  {
    value: 'en',
    label: 'EN-US',
  },
  {
    value: 'pt',
    label: 'PT-BR',
  },
  // {
  //   value: 'es',
  //   label: 'EN-ES',
  // },
]

export type LocalesEnum = keyof typeof dictionaries
export type LocaleDict = (typeof dictionaries)[LocalesEnum]
export const DEFAULT_DICT = dictionaries[
  shared.config.application.defaultLanguage
] as LocaleDict

export const getDictionary = (
  locale: LocalesEnum = shared.config.application
    .defaultLanguage as LocalesEnum,
): LocaleDict => {
  return dictionaries[locale]
}
