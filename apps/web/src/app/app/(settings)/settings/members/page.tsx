import { InviteMemberDialogForm } from '@/app/app/(settings)/settings/members/_components/invite-member-dialog-form'
import {
  FormSection,
  FormSectionDescription,
  FormSectionHeader,
  FormSectionMain,
  FormSectionTitle,
} from '@design-system/react/components/shared/dashboard/form-section'
import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from '@design-system/react/components/shared/dashboard/page'
import { Button } from '@design-system/react/components/ui/button'
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateTitle,
} from '@design-system/react/components/ui/empty-state'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@design-system/react/components/ui/tabs'
import { UserPlus } from 'lucide-react/dist/esm/lucide-react'
import { Metadata } from 'next'
import { InviteCard } from './_components/invite-card'
import { MemberCard } from './_components/member-card'
import {
  getTenantAdminMembersActions,
  getTenantAdminMembersInvitesActions,
} from './actions'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return {
    title: dict.dashboard.settings.members.metadata.title,
  }
}

export default async function Page() {
  const members = await getTenantAdminMembersActions()
  const invites = await getTenantAdminMembersInvitesActions()

  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderTitle>
          {dict.dashboard.settings.members.title}
        </DashboardPageHeaderTitle>
      </DashboardPageHeader>
      <DashboardPageMain className="container max-w-screen-md">
        <FormSection>
          <FormSectionHeader>
            <FormSectionTitle>
              {dict.dashboard.settings.members.title}
            </FormSectionTitle>
            <FormSectionDescription>
              {dict.dashboard.settings.members.description}
            </FormSectionDescription>
          </FormSectionHeader>
          <FormSectionMain>
            <Tabs defaultValue="members" className="space-y-8">
              <header className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="members">
                    {dict.dashboard.settings.members.main.tabs.members.label}
                  </TabsTrigger>
                  <TabsTrigger value="invites">
                    {dict.dashboard.settings.members.main.tabs.invites.label}
                  </TabsTrigger>
                </TabsList>
                <InviteMemberDialogForm>
                  <Button className="hidden md:flex">
                    <UserPlus className="w-4 h-4 mr-2" />
                    {dict.dashboard.settings.members.main.submit.label}
                  </Button>
                </InviteMemberDialogForm>
              </header>
              <TabsContent value="members" className="space-y-4">
                {members.map((member, index) => (
                  <MemberCard
                    key={index}
                    data={{
                      id: member.id,
                      name: member.user.name,
                      email: member.user.email,
                      image: member.user.image,
                    }}
                  />
                ))}

                {members.length === 0 && (
                  <EmptyState>
                    <EmptyStateTitle>
                      {
                        dict.dashboard.settings.members.main.emptyStates.members
                          .title
                      }
                    </EmptyStateTitle>
                    <EmptyStateDescription>
                      {
                        dict.dashboard.settings.members.main.emptyStates.members
                          .description
                      }
                    </EmptyStateDescription>
                  </EmptyState>
                )}

                <InviteMemberDialogForm>
                  <Button
                    className="w-full md:hidden"
                    variant="outline"
                    size="lg"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {dict.dashboard.settings.members.main.submit.label}
                  </Button>
                </InviteMemberDialogForm>
              </TabsContent>
              <TabsContent value="invites" className="space-y-4">
                {invites.map((invite, index) => (
                  <InviteCard
                    key={index}
                    data={{
                      id: invite.id,
                      email: invite.email,
                      acceptedAt: invite.acceptedAt,
                    }}
                  />
                ))}

                {invites.length === 0 && (
                  <EmptyState>
                    <EmptyStateTitle>
                      {
                        dict.dashboard.settings.members.main.emptyStates.invites
                          .title
                      }
                    </EmptyStateTitle>
                    <EmptyStateDescription>
                      {
                        dict.dashboard.settings.members.main.emptyStates.invites
                          .description
                      }
                    </EmptyStateDescription>
                  </EmptyState>
                )}
              </TabsContent>
            </Tabs>
          </FormSectionMain>
        </FormSection>
      </DashboardPageMain>
    </DashboardPage>
  )
}
