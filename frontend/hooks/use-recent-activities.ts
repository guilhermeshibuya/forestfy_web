import { UserRecentActivitiesResponse } from '@/types/user'
import { api, recentActivitiesEndpoint } from '@/utils/api'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from './use-auth'

export function useRecentActivities(limit = 5, offset = 0) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['recentActivities', user?.id, { limit, offset }],
    enabled: !!user?.id,
    queryFn: async () => {
      return await api<UserRecentActivitiesResponse>(
        recentActivitiesEndpoint(user!.id, limit, offset),
      )
    },
  })
}
