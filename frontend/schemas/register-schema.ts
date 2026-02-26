import { FORM_MESSAGES } from '@/constants/form-messages'
import { PASSWORD_RULES } from '@/constants/password-rules'
import z from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, FORM_MESSAGES.NAME_MIN_LENGTH),
  email: z.email(FORM_MESSAGES.INVALID_EMAIL),
  password: z
    .string()
    .min(PASSWORD_RULES.minLength.value, FORM_MESSAGES.PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_RULES.lowercase.value, FORM_MESSAGES.PASSWORD_LOWERCASE)
    .regex(PASSWORD_RULES.uppercase.value, FORM_MESSAGES.PASSWORD_UPPERCASE)
    .regex(PASSWORD_RULES.number.value, FORM_MESSAGES.PASSWORD_NUMBER)
    .regex(
      PASSWORD_RULES.specialChar.value,
      FORM_MESSAGES.PASSWORD_SPECIAL_CHAR,
    ),
})

export type RegisterFormData = z.infer<typeof registerSchema>
