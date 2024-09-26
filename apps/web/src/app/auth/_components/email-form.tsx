import { Button, ButtonIcon } from '@design-system/react/components/ui/button'
import { Input } from '@design-system/react/components/ui/input'
import { UseFormReturn } from 'react-hook-form'

interface EmailFormProps {
  form: UseFormReturn<{ email: string }>
  onSubmit: () => void
  isLoading: boolean
}

export function EmailForm({ form, onSubmit, isLoading }: EmailFormProps) {
  return (
    <form className="w-full space-y-4" onSubmit={onSubmit}>
      <Input
        variant="outline"
        placeholder="Your email"
        className="h-12"
        {...form.register('email')}
      />
      <Button size="lg" className="w-full h-12 shadow" variant="default">
        <ButtonIcon className="w-4 h-4 mr-3" isLoading={isLoading} />
        Continue with email
      </Button>
    </form>
  )
}
