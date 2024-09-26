'use client'

import Link from 'next/link'

import { Logo } from '@/components/logo'
import { useAction } from '@/services/actions/implementations/client'
import { ReturnTypeWithoutPromise } from '@/services/actions/implementations/utils'
import { useDictionary } from '@/services/internationalization/hooks/dictionary.hook'
import { shared } from '@app/shared'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@design-system/react/components/ui/avatar'
import { Button, ButtonIcon } from '@design-system/react/components/ui/button'
import { toast } from '@design-system/react/components/ui/use-toast'
import { getInitialsFromName } from '@design-system/react/helpers/get-initials-from-name'
import { Check } from 'lucide-react/dist/esm/lucide-react'
import { acceptInviteAction, getInviteAction } from './actions'

type InviteSectionProps = {
  data: ReturnTypeWithoutPromise<typeof getInviteAction>
}

export function InviteSection({ data }: InviteSectionProps) {
  if (!data || !data.invite) return null

  const { invite } = data
  const { dict } = useDictionary()

  const acceptInvite = useAction(acceptInviteAction)

  const handleAcceptInvite = async () => {
    try {
      const { redirect } = await acceptInvite.execute({
        id: invite.id,
      })
      window.location.href = redirect
    } catch (error) {
      toast({
        title: dict.shared.toasts.acceptInvite.failed.title,
        description: dict.shared.toasts.acceptInvite.failed.description,
      })
    }
  }

  return (
    <main className="h-screen flex flex-col items-center justify-between py-16">
      <header>
        <Logo />
      </header>

      <section className="flex flex-col items-center text-center">
        <Avatar className="mb-8">
          <AvatarImage src={invite.tenant.logo} />
          <AvatarFallback>
            {getInitialsFromName(invite.tenant.name)}
          </AvatarFallback>
        </Avatar>

        <h1 className="text-2xl font-bold max-w-[50%] mb-8">
          <u>{invite.tenant.name}</u>, {dict.shared.main.title}
        </h1>

        <div className="flex items-center space-x-4">
          <Button type="button" onClick={handleAcceptInvite}>
            <ButtonIcon
              className="w-4 h-4 mr-3"
              icon={Check}
              isLoading={acceptInvite.isSubmitting}
            />
            {dict.shared.main.buttons.accept.label}
          </Button>

          <Link href="/app">
            <Button type="button" variant="outline">
              {dict.shared.main.buttons.decline.label}
            </Button>
          </Link>
        </div>
      </section>

      <footer>
        <p className="text-sm text-slate-500">
          © {shared.config.application.name}. {dict.shared.footer.rights}
        </p>
      </footer>
    </main>
  )
}
