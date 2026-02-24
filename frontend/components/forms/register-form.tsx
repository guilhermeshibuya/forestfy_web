'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { RegisterFormData, registerSchema } from '@/schemas/register-schema'
import { FORM_MESSAGES } from '@/constants/form-messages'
import { register as registerService } from '@/services/auth-service'

export function RegisterForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: RegisterFormData) {
    try {
      await registerService(data)
      router.push('/dashboard')
    } catch {
      alert('Erro ao registrar usuário')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">{FORM_MESSAGES.NAME_LABEL}</FieldLabel>
          <Input
            type="text"
            placeholder={FORM_MESSAGES.NAME_PLACEHOLDER}
            {...register('name')}
          />
          {errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">{FORM_MESSAGES.EMAIL_LABEL}</FieldLabel>
          <Input
            type="email"
            placeholder={FORM_MESSAGES.EMAIL_PLACEHOLDER}
            {...register('email')}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">
            {FORM_MESSAGES.PASSWORD_LABEL}
          </FieldLabel>
          <Input
            type="password"
            placeholder={FORM_MESSAGES.PASSWORD_PLACEHOLDER}
            {...register('password')}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </Field>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? FORM_MESSAGES.REGISTER_SUBMITTING
            : FORM_MESSAGES.REGISTER_BUTTON}
        </Button>
      </FieldGroup>
    </form>
  )
}
