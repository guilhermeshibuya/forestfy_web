import { User } from '@/types/auth'
import { getMeEndpoint } from '@/utils/api'
import { useQuery } from '@tanstack/react-query'

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User | null> => {
      const response = await fetch(getMeEndpoint(), {
        credentials: 'include',
      })

      if (response.status === 401) {
        return null
      }

      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      return response.json()
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}
