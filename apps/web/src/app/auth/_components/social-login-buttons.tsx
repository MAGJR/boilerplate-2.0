import { Button, ButtonIcon } from '@design-system/react/components/ui/button'
import { SeparatorWithText } from '@design-system/react/components/ui/separator-with-text'
import { GithubIcon } from 'lucide-react'
import { GoogleIcon } from './google-icon'

interface SocialLoginButtonsProps {
  onSocialLogin: (provider: 'google' | 'github') => void
  isLoading: { google: boolean; github: boolean }
}

export function SocialLoginButtons({
  onSocialLogin,
  isLoading,
}: SocialLoginButtonsProps) {
  return (
    <div className="flex flex-col w-full gap-4">
      <SeparatorWithText>or</SeparatorWithText>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full h-12 shadow"
        onClick={() => onSocialLogin('google')}
      >
        <ButtonIcon
          className="w-4 h-4 mr-3"
          icon={GoogleIcon}
          isLoading={isLoading.google}
        />
        Continue with Google
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full h-12 shadow"
        onClick={() => onSocialLogin('github')}
      >
        <ButtonIcon
          className="w-4 h-4 mr-3"
          icon={GithubIcon}
          isLoading={isLoading.github}
        />
        Continue with GitHub
      </Button>
    </div>
  )
}
