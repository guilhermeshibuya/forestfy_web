import { FORM_MESSAGES } from '@/constants/form-messages'
import z from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, FORM_MESSAGES.NAME_MIN_LENGTH),
  email: z.email(FORM_MESSAGES.INVALID_EMAIL),
  password: z.string().min(6, FORM_MESSAGES.PASSWORD_MIN_LENGTH),
})

export type RegisterFormData = z.infer<typeof registerSchema>
