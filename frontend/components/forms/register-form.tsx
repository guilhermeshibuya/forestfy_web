'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { FieldGroup } from '../ui/field'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { RegisterFormData, registerSchema } from '@/schemas/register-schema'
import { FORM_MESSAGES } from '@/constants/form-messages'
import { register as registerService } from '@/services/auth-service'
import { LockKeyhole, Mail, User } from 'lucide-react'
import { FormField } from './form-field'
import { PasswordChecklist } from './password-checklist'

export function RegisterForm() {
  const router = useRouter()

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const password = useWatch({ control, name: 'password' })

  async function onSubmit(data: RegisterFormData) {
    try {
      await registerService(data)
      router.push('/dashboard')
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === '400') {
          setError('email', { message: FORM_MESSAGES.USER_ALREADY_EXISTS })
        }
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormField
          id="name"
          label={FORM_MESSAGES.NAME_LABEL}
          error={errors.name?.message}
          icon={<User />}
          placeholder={FORM_MESSAGES.NAME_PLACEHOLDER}
          register={register}
        />

        <FormField
          id="email"
          label={FORM_MESSAGES.EMAIL_LABEL}
          error={errors.email?.message}
          icon={<Mail />}
          type="email"
          placeholder={FORM_MESSAGES.EMAIL_PLACEHOLDER}
          register={register}
        />

        <FormField
          id="password"
          label={FORM_MESSAGES.PASSWORD_LABEL}
          error={errors.password?.message}
          showErrorMessage={false}
          icon={<LockKeyhole />}
          type="password"
          placeholder={FORM_MESSAGES.PASSWORD_PLACEHOLDER}
          register={register}
        />

        <PasswordChecklist password={password} />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? FORM_MESSAGES.REGISTER_SUBMITTING
            : FORM_MESSAGES.REGISTER_BUTTON}
        </Button>
      </FieldGroup>
    </form>
  )
}
