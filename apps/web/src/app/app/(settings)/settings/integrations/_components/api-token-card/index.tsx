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
import { RefreshCcwIcon } from 'lucide-react'
import { useTokenManagement } from '../../_hooks/use-token-managment'
import { TokenDisplay } from './token-display'

export function ApiTokenCard() {
  const {
    privateToken,
    publicToken,
    hasTokens,
    handleRegenerateToken,
    dict,
    regenerateToken,
  } = useTokenManagement()

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
              token={privateToken}
              helpText="Use this token for server-side operations. Keep it secret!"
            />
            <TokenDisplay
              label="Public Token"
              token={publicToken}
              helpText="Use this token for client-side operations. It's safe to expose."
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}
