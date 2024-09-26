import { useApplication } from '@/app/app/_hooks/application.hook'
import { useAction } from '@/services/actions/implementations/client'
import { useDictionary } from '@/services/internationalization/hooks/dictionary.hook'
import { useState } from 'react'
import { regenerateTokenAction } from '../actions'

export function useTokenManagement() {
  const application = useApplication()
  const regenerateToken = useAction(regenerateTokenAction)
  const { dict } = useDictionary()

  const [privateToken, setPrivateToken] = useState(
    application.session.tenant.settings.integrations.privateToken,
  )
  const [publicToken, setPublicToken] = useState(
    application.session.tenant.settings.integrations.publicToken,
  )

  const hasTokens = !!privateToken && !!publicToken

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
    setPrivateToken(tokens.privateToken)
    setPublicToken(tokens.publicToken)
  }

  return {
    privateToken,
    publicToken,
    hasTokens,
    handleRegenerateToken,
    dict,
    regenerateToken,
  }
}
