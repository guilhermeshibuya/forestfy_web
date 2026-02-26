import { AUTH_PAGE_MESSAGES } from '@/constants/auth-page-messages'

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid grid-cols-[2fr_1fr]">
      <section className='px-8 py-4 bg-[url("/forest-banner.jpg")] bg-no-repeat bg-cover bg-center h-screen w-full'>
        <div className="pl-32 pt-60 space-y-4">
          <h1 className="font-title-display text-7xl text-neutral-50">
            Forestfy
          </h1>
          <p className="text-neutral-200 text-xl max-w-[70ch]">
            {AUTH_PAGE_MESSAGES.HERO_MESSAGE}
          </p>
        </div>
      </section>
      <section className="pt-40 px-8">{children}</section>
    </div>
  )
}
