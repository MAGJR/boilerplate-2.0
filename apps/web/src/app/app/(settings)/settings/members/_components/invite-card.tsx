'use client'

import { useAction } from '@/services/actions/implementations/client'
import { useDictionary } from '@/services/internationalization/hooks/dictionary.hook'
import { getUrl } from '@app/shared'
import { Button } from '@design-system/react/components/ui/button'
import { Card, CardContent } from '@design-system/react/components/ui/card'
import { toast } from '@design-system/react/components/ui/use-toast'
import { Copy, XIcon } from 'lucide-react/dist/esm/lucide-react'
import { useRouter } from 'next/navigation'
import { deleteInviteAction } from '../actions'

type InviteCardProps = {
  data: {
    id: string
    email: string
    acceptedAt?: Date | null
  }
}

export function InviteCard({ data }: InviteCardProps) {
  const router = useRouter()
  const deleteInvite = useAction(deleteInviteAction)

  const { dict } = useDictionary()

  const handleCopyInvite = () => {
    const inviteURL = getUrl(`/app/invites/${data.id}`)
    navigator.clipboard.writeText(inviteURL)

    toast({
      title:
        dict.dashboard.settings.members.main.tabs.invites.card.copyInvite.toasts
          .success.title,
      description:
        dict.dashboard.settings.members.main.tabs.invites.card.copyInvite.toasts
          .success.description,
    })
  }

  const handleDeleteInvite = async () => {
    if (
      !confirm(
        dict.dashboard.settings.members.main.tabs.invites.card.deleteInvite
          .alertConfirmation,
      )
    )
      return

    try {
      await deleteInvite.execute({
        inviteId: data.id,
      })

      toast({
        title:
          dict.dashboard.settings.members.main.tabs.invites.card.deleteInvite
            .toasts.success.title,
      })

      router.refresh()
    } catch (error) {
      toast({
        title:
          dict.dashboard.settings.members.main.tabs.invites.card.deleteInvite
            .toasts.failed.title,
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between pt-6">
        <div className="space-y-1">
          <p className="font-semibold text-sm line-clamp-1">{data.email}</p>
          <span className="opacity-60 text-sm line-clamp-1">
            {data.acceptedAt
              ? dict.dashboard.settings.members.main.tabs.invites.card
                  .description[0]
              : dict.dashboard.settings.members.main.tabs.invites.card
                  .description[1]}
          </span>
        </div>

        <div className="space-x-4">
          <Button
            size="icon"
            title={
              dict.dashboard.settings.members.main.tabs.invites.card.copyInvite
                .button.copy.title
            }
            onClick={handleCopyInvite}
            variant="ghost"
          >
            <Copy className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            title={
              dict.dashboard.settings.members.main.tabs.invites.card
                .deleteInvite.button.delete.title
            }
            onClick={handleDeleteInvite}
            variant="ghost"
          >
            <XIcon className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
