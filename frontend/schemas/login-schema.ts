import { FORM_MESSAGES } from '@/constants/form-messages'
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email(FORM_MESSAGES.EMAIL_IS_REQUIRED),
  password: z.string().nonempty(FORM_MESSAGES.PASSWORD_IS_REQUIRED),
})

export type LoginFormData = z.infer<typeof loginSchema>
