import DowngradeEmail from './templates/downgrade-email'
import InviteEmail from './templates/invite'
import LoginLink from './templates/login-link'
import UpgradeEmail from './templates/upgrade-email'
import UsageExceeded from './templates/usage-exceed'
import WelcomeEmail from './templates/welcome-email'

export {
  DowngradeEmail,
  InviteEmail,
  LoginLink,
  UpgradeEmail,
  UsageExceeded,
  WelcomeEmail
}

export type EmailType =
  | 'downgrade'
  | 'invite'
  | 'login-link'
  | 'upgrade'
  | 'usage-exceed'
  | 'welcome'
