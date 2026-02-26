'use client'

import { LoginFormData, loginSchema } from '@/schemas/login-schema'
import { login } from '@/services/auth-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FieldGroup } from '../ui/field'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { FORM_MESSAGES } from '@/constants/form-messages'
import { LockKeyhole, Mail } from 'lucide-react'
import { FormField } from './form-field'
import { useState } from 'react'

export function LoginForm() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormData) {
    try {
      await login(data)
      router.push('/dashboard')
    } catch {
     setErrorMessage(FORM_MESSAGES.INVALID_CREDENTIALS)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormField
          id="email"
          label={FORM_MESSAGES.EMAIL_LABEL}
          icon={<Mail />}
          type="email"
          error={errors.email?.message}
          placeholder={FORM_MESSAGES.EMAIL_PLACEHOLDER}
          register={register}
        />

        <FormField
          id="password"
          label={FORM_MESSAGES.PASSWORD_LABEL}
          icon={<LockKeyhole />}
          type="password"
          error={errors.password?.message}
          placeholder={FORM_MESSAGES.PASSWORD_PLACEHOLDER}
          register={register}
        />

        {errorMessage && <span className="text-red-500">{errorMessage}</span>}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? FORM_MESSAGES.LOGIN_SUBMITTING
            : FORM_MESSAGES.LOGIN_BUTTON}
        </Button>
      </FieldGroup>
    </form>
  )
}
