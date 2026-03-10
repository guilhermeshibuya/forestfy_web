'use client'

import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { SidebarProvider } from '@/components/ui/sidebar'
import { APP_ROUTES } from '@/constants/app-routes'
import { HEADER_MESSAGES } from '@/constants/header-messages'
import { useAuth } from '@/hooks/use-auth'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const pathName = usePathname()

  const { title, description } = HEADER_MESSAGES.find((r) =>
    r.match(pathName),
  ) || { title: '', description: '' }
  const firstName = user?.full_name.split(' ')[0] || 'Usuário'

  return (
    <SidebarProvider>
      <AppSidebar />
      <section className="flex flex-col p-8 gap-8 w-full max-h-dvh">
        <Header>
          {description && (
            <div className="flex flex-col justify-center items-start gap-2">
              <h1
                className={`text-2xl ${pathName === APP_ROUTES.DASHBOARD ? 'text-zinc-600' : 'text-zinc-800 font-semibold'}`}
              >
                {title}{' '}
                {pathName === APP_ROUTES.DASHBOARD && firstName && (
                  <span className="font-semibold text-zinc-800">
                    {firstName} 😊
                  </span>
                )}
              </h1>
              <p className="text-zinc-600">{description}</p>
            </div>
          )}
        </Header>
        <main>{children}</main>
      </section>
    </SidebarProvider>
  )
}
