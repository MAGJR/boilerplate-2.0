'use client'

import { useAction } from '@/services/actions/implementations/client'
import { useDictionary } from '@/services/internationalization/hooks/dictionary.hook'
import { Button } from '@design-system/react/components/ui/button'
import { Card, CardContent } from '@design-system/react/components/ui/card'
import { Persona } from '@design-system/react/components/ui/persona'
import { toast } from '@design-system/react/components/ui/use-toast'
import { Trash } from 'lucide-react/dist/esm/lucide-react'
import { useRouter } from 'next/navigation'
import { deleteMemberOnTeamAction } from '../actions'

type MemberCardProps = {
  data: {
    id: string
    name: string | null
    email: string | null
    image?: string | null
  }
}

export function MemberCard({ data }: MemberCardProps) {
  const router = useRouter()
  const { dict } = useDictionary()

  const deleteMember = useAction(deleteMemberOnTeamAction)

  const handleDeleteMember = async () => {
    if (
      !confirm(
        dict.dashboard.settings.members.main.tabs.members.card.deleteMember
          .alertConfirmation,
      )
    )
      return

    try {
      await deleteMember.execute({
        id: data.id,
      })

      toast({
        title:
          dict.dashboard.settings.members.main.tabs.members.card.deleteMember
            .toasts.success.title,
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title:
          error.message ||
          dict.dashboard.settings.members.main.tabs.members.card.deleteMember
            .toasts.failed.title,
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between pt-6">
        <Persona
          src={data.image}
          name={data.name}
          secondaryLabel={data.email}
        />

        <div className="space-x-4">
          <Button
            size="icon"
            variant="ghost"
            title={
              dict.dashboard.settings.members.main.tabs.members.card
                .deleteMember.button.title
            }
            onClick={handleDeleteMember}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
