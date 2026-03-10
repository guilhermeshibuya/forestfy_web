'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { FieldGroup } from '../ui/field'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { RegisterFormData, registerSchema } from '@/schemas/register-schema'
import { FORM_MESSAGES } from '@/constants/form-messages'
// import { register as registerService } from '@/services/auth-service'
import { LockKeyhole, Mail, User } from 'lucide-react'
import { FormField } from './form-field'
import { PasswordChecklist } from './password-checklist'
import { APP_ROUTES } from '@/constants/app-routes'
import { useAuth } from '@/hooks/use-auth'

export function RegisterForm() {
  const router = useRouter()
  const { register: registerService } = useAuth()

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
      confirmPassword: '',
    },
  })

  const password = useWatch({ control, name: 'password' })

  async function onSubmit(data: RegisterFormData) {
    try {
      await registerService({
        full_name: data.name,
        email: data.email,
        password: data.password,
      })
      router.push(APP_ROUTES.LOGIN)
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === '400') {
          setError('email', { message: FORM_MESSAGES.USER_ALREADY_EXISTS })
        } else {
          setError('email', { message: FORM_MESSAGES.REGISTER_FAILED })
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

        <FormField
          id="confirmPassword"
          label={FORM_MESSAGES.CONFIRM_PASSWORD_LABEL}
          error={errors.confirmPassword?.message}
          icon={<LockKeyhole />}
          type="password"
          placeholder={FORM_MESSAGES.CONFIRM_PASSWORD_PLACEHOLDER}
          register={register}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? FORM_MESSAGES.REGISTER_SUBMITTING
            : FORM_MESSAGES.REGISTER_BUTTON}
        </Button>
      </FieldGroup>
    </form>
  )
}
