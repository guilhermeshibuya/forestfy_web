import { LoginForm } from '@/components/forms/login-form'
import { AUTH_PAGE_MESSAGES } from '@/constants/auth-page-messages'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">
        {AUTH_PAGE_MESSAGES.LOGIN_WELCOME_MESSAGE}
      </h1>
      <LoginForm />
      <p className="text-sm text-zinc-700 mt-6">
        {AUTH_PAGE_MESSAGES.DONT_HAVE_ACCOUNT}{' '}
        <Link href="/auth/register" className="text-blue-500">
          {AUTH_PAGE_MESSAGES.CLICK_HERE}
        </Link>
      </p>
    </div>
  )
}
