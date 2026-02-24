import { FORM_MESSAGES } from '@/constants/form-messages'
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email(FORM_MESSAGES.INVALID_EMAIL),
  password: z.string().min(6, FORM_MESSAGES.PASSWORD_MIN_LENGTH),
})

export type LoginFormData = z.infer<typeof loginSchema>
