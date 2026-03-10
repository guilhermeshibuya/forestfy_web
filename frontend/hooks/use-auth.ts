'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useUser } from './use-user'
import {
  api,
  loginEndpoint,
  logoutEndpoint,
  registerEndpoint,
} from '@/utils/api'
import { UserCreate } from '@/types/auth'

export function useAuth() {
  const queryClient = useQueryClient()
  const { data: user, isLoading } = useUser()

  const login = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      return api(loginEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: data.email,
          password: data.password,
        }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  const register = useMutation({
    mutationFn: async (data: UserCreate) => {
      return api(registerEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  const logout = async () => {
    await fetch(logoutEndpoint(), {
      method: 'POST',
      credentials: 'include',
    })
    queryClient.setQueryData(['user'], null)
  }

  return {
    user,
    isLoading,
    login: login.mutateAsync,
    register: register.mutateAsync,
    logout,
    isLoggingIn: login.isPending,
    isRegistering: register.isPending,
  }
}
