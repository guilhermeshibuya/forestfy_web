import { FieldValues, Path, UseFormRegister } from 'react-hook-form'
import { Field, FieldDescription, FieldLabel } from '../ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'

type FormFieldProps<T extends FieldValues> = {
  id: Path<T>
  label: string
  error?: string
  icon: React.ReactNode
  type?: string
  placeholder?: string
  showErrorMessage?: boolean
  register: UseFormRegister<T>
}

export function FormField<T extends FieldValues>({
  id,
  label,
  error,
  icon,
  type = 'text',
  placeholder,
  showErrorMessage = true,
  register,
}: FormFieldProps<T>) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <InputGroup>
        <InputGroupAddon>{icon}</InputGroupAddon>

        <InputGroupInput
          id={id}
          type={type}
          aria-invalid={!!error}
          placeholder={placeholder}
          {...register(id)}
        />
      </InputGroup>

      {showErrorMessage && error && (
        <FieldDescription className="text-red-500">{error}</FieldDescription>
      )}
    </Field>
  )
}
