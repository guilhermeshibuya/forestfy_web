'use client'

import { useAuth } from '@/hooks/use-auth'
import Image from 'next/image'
import { ReactNode } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { APP_ROUTES } from '@/constants/app-routes'
import { useRouter } from 'next/navigation'
import { LogOut, Settings } from 'lucide-react'

export function Header({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, logout } = useAuth()

  async function handleLogout() {
    try {
      await logout()
    } catch {
    } finally {
      router.push(APP_ROUTES.LOGIN)
    }
  }

  return (
    <header className="flex justify-between items-center">
      {children}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer">
            <Image
              src={
                user?.profile_picture_url?.length
                  ? user.profile_picture_url
                  : '/avatar.jpg'
              }
              alt="Profile picture"
              width={48}
              height={48}
              className="rounded-full w-12 h-12 object-cover"
              unoptimized
            />
            <span className="sr-only">Abrir menu do usuário</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{user?.full_name}</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Settings />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} variant="destructive">
              <LogOut />
              Sair
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
