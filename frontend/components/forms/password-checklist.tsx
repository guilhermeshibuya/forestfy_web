import { PASSWORD_RULES } from '@/constants/password-rules'

export function PasswordChecklist({ password = '' }: { password?: string }) {
  const checks = {
    minLength: password.length >= PASSWORD_RULES.minLength.value,
    lowercase: PASSWORD_RULES.lowercase.value.test(password),
    uppercase: PASSWORD_RULES.uppercase.value.test(password),
    number: PASSWORD_RULES.number.value.test(password),
    specialChar: PASSWORD_RULES.specialChar.value.test(password),
  }

  return (
    <ul className="list-inside list-disc">
      {Object.entries(checks).map(([key, valid]) => {
        const rule = PASSWORD_RULES[key as keyof typeof PASSWORD_RULES]
        return (
          <li
            key={key}
            className={`${valid ? 'text-green-500' : 'text-zinc-400'}`}
          >
            {rule.message}
          </li>
        )
      })}
    </ul>
  )
}
