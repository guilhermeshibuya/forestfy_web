'use client'

import { LoginFormData, loginSchema } from '@/schemas/login-schema'
import { login } from '@/services/auth-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormData) {
    try {
      await login(data)
      router.push('/')
    } catch {
      alert('Login failed')
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Bem-Vindo de volta!</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              type="email"
              placeholder="Digite seu email"
              {...register('username')}
            />
            {errors.username && (
              <span className="text-red-500">{errors.username.message}</span>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              type="password"
              placeholder="Digite sua senha"
              {...register('password')}
            />
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </Field>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </FieldGroup>
      </form>
    </div>
  )
}
