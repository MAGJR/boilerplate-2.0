'use client'

import { useApplication } from '@/app/app/_hooks/application.hook'
import { useActionForm } from '@/services/actions/implementations/client'
import { useDictionary } from '@/services/internationalization/hooks/dictionary.hook'
import { AvatarUploadInput } from '@design-system/react/components/ui/avatar-upload-input'
import { Button, ButtonIcon } from '@design-system/react/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormSection,
} from '@design-system/react/components/ui/form'
import { Input } from '@design-system/react/components/ui/input'
import { toast } from '@design-system/react/components/ui/use-toast'
import { updateTenantAction } from '../actions'
import { updateTenantActionSchema } from '../schemas'

export function SettingsTeamForm() {
  const { session } = useApplication()
  const { dict } = useDictionary()

  const form = useActionForm({
    schema: updateTenantActionSchema,
    action: updateTenantAction,
    defaultValues: {
      logo: session.tenant.logo,
      name: session.tenant.name,
    },
    onSubmitSuccess: () => {
      toast({
        title: dict.dashboard.settings.team.form.toasts.success.title,
        description:
          dict.dashboard.settings.team.form.toasts.success.description,
      })
    },
  })

  return (
    <Form {...form}>
      <FormSection>
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <AvatarUploadInput
                  context="tenants"
                  id={session.tenant.id}
                  onChange={field.onChange}
                  value={field.value}
                  placeholder={
                    dict.dashboard.settings.team.form.fields.avatar.placeholder
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {dict.dashboard.settings.team.form.fields.name.label}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    dict.dashboard.settings.team.form.fields.name.placeholder
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>

      <Button
        type="submit"
        className="md:w-fit w-full !mt-8"
        disabled={!form.formState.isDirty}
      >
        <ButtonIcon
          className="w-4 h-4 mr-3"
          isLoading={form.actionState.isSubmitting}
        />
        {dict.dashboard.settings.main.form.submit.label}
      </Button>
    </Form>
  )
}
