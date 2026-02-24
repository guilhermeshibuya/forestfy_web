import { RegisterForm } from '@/components/forms/register-form'
import { AUTH_PAGE_MESSAGES } from '@/constants/auth-page-messages'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">
        {AUTH_PAGE_MESSAGES.REGISTER_WELCOME_MESSAGE}
      </h1>
      <RegisterForm />
      <p className="text-sm text-zinc-700 mt-6">
        {AUTH_PAGE_MESSAGES.ALREADY_HAVE_ACCOUNT}{' '}
        <Link href="/auth/login" className="text-blue-500">
          {AUTH_PAGE_MESSAGES.CLICK_HERE}
        </Link>
      </p>
    </div>
  )
}
