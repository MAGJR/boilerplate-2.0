import { welcomeTemplate } from './welcome.template'

export const templates = {
  welcome: welcomeTemplate,
}

export type TemplateKey = keyof typeof templates
