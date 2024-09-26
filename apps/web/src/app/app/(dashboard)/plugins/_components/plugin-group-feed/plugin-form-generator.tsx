import { PluginWithFields } from '@app/shared'
import { Checkbox } from '@design-system/react/components/ui/checkbox'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSection,
} from '@design-system/react/components/ui/form'
import { Input } from '@design-system/react/components/ui/input'
import { UseFormReturn } from 'react-hook-form'

type ZodSchemaToFieldsProps = {
  fields: PluginWithFields['fields']
  form: UseFormReturn<any>
}

export function PluginFormGenerator({ fields, form }: ZodSchemaToFieldsProps) {
  const renderField = (field: PluginWithFields['fields'][number]) => {
    let InputComponent: any = Input

    if (field.type === 'boolean') {
      InputComponent = Checkbox
    }

    return (
      <FormField
        key={`data.config.${field.key}`}
        control={form.control}
        name={`data.config.${field.key}`}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>{field.label}</FormLabel>
            <FormControl>
              <InputComponent
                {...formField}
                type={field.type === 'number' ? 'number' : 'text'}
                checked={
                  InputComponent === Checkbox ? formField.value : undefined
                }
                onCheckedChange={
                  InputComponent === Checkbox ? formField.onChange : undefined
                }
                placeholder={field.placeholder}
              />
            </FormControl>
            {field.helpText && (
              <FormDescription>{field.helpText}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  return (
    <FormSection className="mt-4 h-full">{fields.map(renderField)}</FormSection>
  )
}
