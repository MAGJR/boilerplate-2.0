'use client'

import { useApplication } from '@/app/app/_hooks/application.hook'
import { useActionForm } from '@/services/actions/implementations/client'
import {
  LocalesEnum,
  dictionariesOptions,
} from '@/services/internationalization/helpers/get-dictionary'
import { useDictionary } from '@/services/internationalization/hooks/dictionary.hook'
import { AvatarUploadInput } from '@design-system/react/components/ui/avatar-upload-input'
import { Button, ButtonIcon } from '@design-system/react/components/ui/button'
import { ComboBox } from '@design-system/react/components/ui/combobox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSection,
} from '@design-system/react/components/ui/form'
import { Input } from '@design-system/react/components/ui/input'
import { toast } from '@design-system/react/components/ui/use-toast'
import { updateUserProfileAction } from '../actions'
import { updateProfileActionSchema } from '../schemas'

export function SettingsProfileForm() {
  const { session } = useApplication()
  const { dict } = useDictionary()

  const form = useActionForm({
    schema: updateProfileActionSchema,
    action: updateUserProfileAction,
    defaultValues: {
      image: session.user.image,
      name: session.user.name,
      username: session.user.username,
      email: session.user.email,
      locale: dict.id as LocalesEnum,
    },
    onSubmitSuccess: () => {
      toast({
        title: dict.dashboard.settings.main.form.toasts.success.title,
        description:
          dict.dashboard.settings.main.form.toasts.success.description,
      })
    },
  })

  return (
    <Form {...form}>
      <FormSection>
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <AvatarUploadInput
                  context="users"
                  id={session.user.id}
                  onChange={field.onChange}
                  value={field.value}
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
                {dict.dashboard.settings.main.form.fields.name.label}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    dict.dashboard.settings.main.form.fields.name.placeholder
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {dict.dashboard.settings.main.form.fields.username.label}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    dict.dashboard.settings.main.form.fields.username
                      .placeholder
                  }
                  {...field}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {dict.dashboard.settings.main.form.fields.email.label}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    dict.dashboard.settings.main.form.fields.email.placeholder
                  }
                  {...field}
                  disabled
                />
              </FormControl>
              <FormDescription>
                {dict.dashboard.settings.main.form.fields.email.helpText}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>

      <FormSection>
        <FormField
          control={form.control}
          name="locale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {dict.dashboard.settings.main.form.fields.locale.label}
              </FormLabel>
              <FormControl>
                <ComboBox
                  options={dictionariesOptions}
                  placeholder={
                    dict.dashboard.settings.main.form.fields.locale.placeholder
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
        className="md:w-fit w-full !mt-12"
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
