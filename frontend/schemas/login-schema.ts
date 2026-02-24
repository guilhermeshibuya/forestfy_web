import { z } from 'zod'

export const loginSchema = z.object({
  username: z.email('Email inválido'),
  password: z.string().min(2, 'A senha deve conter no mínimo 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>
