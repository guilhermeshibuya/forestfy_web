import { FORM_MESSAGES } from './form-messages'

export const PASSWORD_RULES = {
  minLength: {
    value: 6,
    message: FORM_MESSAGES.PASSWORD_MIN_LENGTH,
  },
  lowercase: {
    value: /[a-z]/,
    message: FORM_MESSAGES.PASSWORD_LOWERCASE,
  },
  uppercase: {
    value: /[A-Z]/,
    message: FORM_MESSAGES.PASSWORD_UPPERCASE,
  },
  number: {
    value: /[0-9]/,
    message: FORM_MESSAGES.PASSWORD_NUMBER,
  },
  specialChar: {
    value: /[^a-zA-Z0-9]/,
    message: FORM_MESSAGES.PASSWORD_SPECIAL_CHAR,
  },
}
