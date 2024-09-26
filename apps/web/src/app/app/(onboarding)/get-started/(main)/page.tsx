'use client'

import { useApplication } from '@/app/app/_hooks/application.hook'
import { useActionForm } from '@/services/actions/implementations/client'
import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormSection,
} from '@design-system/react/components/ui/form'
import { Input } from '@design-system/react/components/ui/input'
import { PhoneInput } from '@design-system/react/components/ui/phone-input'
import {
    Stepper,
    StepperBody,
    StepperFooter,
    StepperHeader,
    StepperHeaderDescription,
    StepperHeaderStepCounter,
    StepperHeaderTitle,
    StepperSubmitButton,
} from '@design-system/react/components/ui/stepper'
import { Mail, User } from 'lucide-react'
import { updateUserBaseInfo } from './actions'
import { updateUserBaseInfoSchema } from './schemas'

export default function Page() {
  const application = useApplication()
  const dict = getDictionary()

  const form = useActionForm({
    schema: updateUserBaseInfoSchema,
    action: updateUserBaseInfo,
    defaultValues: {
      name: application.session.user.name,
      email: application.session.user.email,
      phone: application.session.user.settings.contact.phone,
    },
    onSubmitSuccess: ({ redirect }) => {
      window.location.href = redirect
    },
  })

  return (
    <Form className="space-y-8" {...form}>
      <Stepper>
        <StepperHeader>
          <StepperHeaderStepCounter>1/2</StepperHeaderStepCounter>
          <StepperHeaderTitle>
            {dict.onboarding.getStarted.main.steps.first.title}
          </StepperHeaderTitle>
          <StepperHeaderDescription>
            {dict.onboarding.getStarted.main.steps.first.subtitle}
          </StepperHeaderDescription>
        </StepperHeader>
        <StepperBody>
          <FormSection>
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">
                    {
                      dict.onboarding.getStarted.main.steps.first.form.fields
                        .name.label
                    }
                  </FormLabel>
                  <Input
                    {...field}
                    size="lg"
                    placeholder={
                      dict.onboarding.getStarted.main.steps.first.form.fields
                        .name.placeholder
                    }
                    autoCapitalize="words"
                    leftIcon={<User />}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">
                    {
                      dict.onboarding.getStarted.main.steps.first.form.fields
                        .email.label
                    }
                  </FormLabel>
                  <Input
                    {...field}
                    size="lg"
                    placeholder={
                      dict.onboarding.getStarted.main.steps.first.form.fields
                        .email.placeholder
                    }
                    disabled
                    leftIcon={<Mail />}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">
                    {
                      dict.onboarding.getStarted.main.steps.first.form.fields
                        .phone.label
                    }
                  </FormLabel>
                  <PhoneInput
                    {...field}
                    placeholder={
                      dict.onboarding.getStarted.main.steps.first.form.fields
                        .phone.placeholder
                    }
                    defaultCountry="US"
                    initialValueFormat="national"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>
        </StepperBody>
        <StepperFooter>
          <StepperSubmitButton isLoading={form.actionState.isSubmitting}>
            {
              dict.onboarding.getStarted.main.steps.first.form.fields.submit
                .label
            }
          </StepperSubmitButton>
        </StepperFooter>
      </Stepper>
    </Form>
  )
}
