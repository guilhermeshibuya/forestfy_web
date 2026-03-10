'use client'

import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Logo } from '../logo'
import {
  BookOpen,
  Clock,
  LogOut,
  PanelsTopLeft,
  ScanLine,
  ScanSearch,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { APP_ROUTES } from '@/constants/app-routes'
import { useAuth } from '@/hooks/use-auth'

const data = {
  navMain: [
    {
      title: 'Início',
      url: APP_ROUTES.DASHBOARD,
      isActive: true,
      icon: PanelsTopLeft,
    },
    {
      title: 'Classificação',
      url: APP_ROUTES.CLASSIFICATION,
      isActive: false,
      icon: ScanSearch,
    },
    {
      title: 'Segmentação',
      url: APP_ROUTES.SEGMENTATION,
      isActive: false,
      icon: ScanLine,
    },
    {
      title: 'Catálogo',
      url: APP_ROUTES.CATALOG,
      isActive: false,
      icon: BookOpen,
    },
    {
      title: 'Histórico',
      url: APP_ROUTES.HISTORY,
      isActive: false,
      icon: Clock,
    },
    {
      title: 'Configurações',
      url: APP_ROUTES.SETTINGS,
      isActive: false,
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const { logout } = useAuth()

  async function handleLogout() {
    try {
      await logout()
    } catch {
    } finally {
      router.push(APP_ROUTES.LOGIN)
    }
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="px-8 pt-8">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-8">
        {data.navMain.map((item) => {
          const Icon = item.icon

          return (
            <SidebarMenu key={item.title}>
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  className="px-4 py-2"
                  asChild
                  isActive={item.isActive}
                >
                  <div className="flex items-center gap-2 h-auto">
                    <Icon />
                    <Link href={item.url}>{item.title}</Link>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )
        })}
      </SidebarContent>
      <SidebarFooter className="px-8 pb-8">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="flex items-center gap-2 h-auto cursor-pointer px-4 py-2"
            >
              <LogOut />
              <span className="ml-2">Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
