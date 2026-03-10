'use client'

import { useAuth } from '@/hooks/use-auth'
import Image from 'next/image'
import { ReactNode } from 'react'

export function Header({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  return (
    <header className="flex justify-between items-center">
      {children}
      <Image
        src={
          user?.profile_image_url?.length
            ? user.profile_image_url
            : '/avatar.jpg'
        }
        alt="Avatar"
        width={42}
        height={42}
        className="rounded-full"
      />
    </header>
  )
}
