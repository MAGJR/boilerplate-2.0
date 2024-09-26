'use client'

import { useActionForm } from '@/services/actions/implementations/client'
import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@design-system/react/components/ui/form'
import { Input } from '@design-system/react/components/ui/input'
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
import { User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createTenantAction } from './actions'
import { createTenantActionSchema } from './schemas'

export default function Page() {
  const router = useRouter()
  const dict = getDictionary()

  const form = useActionForm({
    schema: createTenantActionSchema,
    action: createTenantAction,
    defaultValues: {
      name: '',
    },
    onSubmitSuccess: () => {
      router.push('/app')
    },
  })

  return (
    <Form className="space-y-8" {...form}>
      <Stepper>
        <StepperHeader>
          <StepperHeaderStepCounter>2/2</StepperHeaderStepCounter>
          <StepperHeaderTitle>
            {dict.onboarding.getStarted.main.steps.second.title}
          </StepperHeaderTitle>
          <StepperHeaderDescription>
            {dict.onboarding.getStarted.main.steps.second.subtitle}
          </StepperHeaderDescription>
        </StepperHeader>
        <StepperBody>
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">
                  {
                    dict.onboarding.getStarted.main.steps.second.form.fields
                      .name.label
                  }
                </FormLabel>
                <Input
                  {...field}
                  placeholder={
                    dict.onboarding.getStarted.main.steps.second.form.fields
                      .name.placeholder
                  }
                  autoCapitalize="words"
                  leftIcon={<User />}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </StepperBody>
        <StepperFooter>
          <StepperSubmitButton isLoading={form.actionState.isSubmitting}>
            {
              dict.onboarding.getStarted.main.steps.second.form.fields.submit
                .label
            }
          </StepperSubmitButton>
        </StepperFooter>
      </Stepper>
    </Form>
  )
}
