'use client'

import { useApplication } from '@/app/app/_hooks/application.hook'
import { useAction } from '@/services/actions/implementations/client'
import { useDictionary } from '@/services/internationalization/hooks/dictionary.hook'
import {
  Alert,
  AlertDescription,
} from '@design-system/react/components/ui/alert'
import { Button, ButtonIcon } from '@design-system/react/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@design-system/react/components/ui/card'
import { Separator } from '@design-system/react/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@design-system/react/components/ui/tooltip'
import { cn } from '@design-system/react/helpers/cn'
import { useBoolean } from '@design-system/react/hooks/use-boolean'
import { useClipboard } from '@design-system/react/hooks/use-clipboard'
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  HelpCircle,
  RefreshCcwIcon,
} from 'lucide-react'
import { regenerateTokenAction } from '../actions'

export function ApiTokenCard() {
  const application = useApplication()
  const regenerateToken = useAction(regenerateTokenAction)
  const privateTokenClipboard = useClipboard(
    application.session.tenant.settings.integrations.privateToken,
  )
  const publicTokenClipboard = useClipboard(
    application.session.tenant.settings.integrations.publicToken,
  )

  const { dict } = useDictionary()

  const privateTokenIsVisible = useBoolean({
    defaultValue: false,
    timeout: 5000,
  })

  const publicTokenIsVisible = useBoolean({
    defaultValue: false,
    timeout: 5000,
  })

  const hasTokens =
    !!privateTokenClipboard.value && !!publicTokenClipboard.value

  const handleRegenerateToken = async () => {
    if (hasTokens) {
      if (
        !confirm(
          dict.dashboard.settings.integrations.form.messages
            .confirmRegenerateToken,
        )
      ) {
        return
      }
    }

    const tokens = await regenerateToken.execute({})
    privateTokenClipboard.setValue(tokens.privateToken)
    publicTokenClipboard.setValue(tokens.publicToken)
    privateTokenIsVisible.onToggle()
    publicTokenIsVisible.onToggle()
  }

  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center pb-2 pt-4">
        <CardTitle className="text-sm">
          {dict.dashboard.settings.integrations.form.fields.apiKey.label}
        </CardTitle>

        <Button variant="link" onClick={handleRegenerateToken}>
          <ButtonIcon
            icon={RefreshCcwIcon}
            isLoading={regenerateToken.isSubmitting}
            className="w-4 h-4 mr-3"
          />
          Regenerate
        </Button>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent className="space-y-4">
        {!hasTokens && (
          <Alert className="w-full flex text-center items-center justify-center">
            <AlertDescription className="my-0">
              {
                dict.dashboard.settings.integrations.form.fields.alert
                  .description
              }
            </AlertDescription>
          </Alert>
        )}

        {hasTokens && (
          <>
            <TokenDisplay
              label="Private Token"
              value={privateTokenClipboard.value}
              isVisible={privateTokenIsVisible.value}
              onToggleVisibility={privateTokenIsVisible.onToggle}
              onCopy={privateTokenClipboard.onCopy}
              isCopied={privateTokenClipboard.isCopied}
              helpText="Use this token for server-side operations. Keep it secret!"
            />
            <TokenDisplay
              label="Public Token"
              value={publicTokenClipboard.value}
              isVisible={publicTokenIsVisible.value}
              onToggleVisibility={publicTokenIsVisible.onToggle}
              onCopy={publicTokenClipboard.onCopy}
              isCopied={publicTokenClipboard.isCopied}
              helpText="Use this token for client-side operations. It's safe to expose."
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}

interface TokenDisplayProps {
  label: string
  value: string
  isVisible: boolean
  onToggleVisibility: () => void
  onCopy: () => void
  isCopied: boolean
  helpText: string
}

function TokenDisplay({
  label,
  value,
  isVisible,
  onToggleVisibility,
  onCopy,
  isCopied,
  helpText,
}: TokenDisplayProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="font-semibold">{label}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="w-4 h-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{helpText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center space-x-2">
        <strong
          className={cn([
            'transition-all ease-in-out duration-700 line-clamp-1',
            isVisible
              ? ''
              : 'text-transparent bg-clip-text bg-gradient-to-r from-gray-500/80 bg-background blur-sm pointer-events-none',
          ])}
        >
          {value}
        </strong>
        <Button size="icon" variant="outline" onClick={onToggleVisibility}>
          {isVisible ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </Button>
        <Button size="icon" variant="outline" onClick={onCopy}>
          {isCopied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
