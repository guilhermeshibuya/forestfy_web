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
    </header>
  )
}
