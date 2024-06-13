import { zodResolver } from '@hookform/resolvers/zod'
import {
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormProps
} from 'react-hook-form'
import { z } from 'zod'

type UseFormActionProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
> = UseFormProps<TFieldValues, TContext> & {
  schema: z.Schema<any, any>
}

export function useFormAction<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues = TFieldValues
>({ schema, ...props }: UseFormActionProps<TFieldValues, TContext>) {
  const form = useForm({
    ...props, // Spread other props passed to useFormAction into useForm
    resolver: zodResolver(schema) // Use zodResolver with provided schema for form validation
  })

  // Function to handle form action (submit)
  const handleAction = async (onAction: SubmitHandler<TFieldValues>) => {
    const valid = await form.trigger()
    if (valid) {
      return onAction(schema.parse(form.getValues())) // If form is valid, parse values with schema and call onAction function
    }
  }

  // Function to define submit action behavior
  const submitAction = (onAction: (formData: TFieldValues) => void) => {
    if (form.formState.isValid) {
      return { action: () => onAction(form.getValues()) } // Return an object with action function that calls onAction with current form values
    }
    return { onSubmit: form.handleSubmit(() => {}) } // Return an object with onSubmit function that does nothing
  }

  return {
    ...form, // Spread all methods and states from useForm
    handleAction, // Function to handle form action (submit)
    submitAction // Function to define submit action behavior
  }
}
