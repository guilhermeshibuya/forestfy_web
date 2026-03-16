import { UserRecentActivity } from '@/types/user'
import { api, recentActivitiesEndpoint } from '@/utils/api'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from './use-auth'

export function useRecentActivities() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['recentActivities', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      console.log(`Fetching recent activities for user ${user?.id}...`)
      return await api<UserRecentActivity[]>(recentActivitiesEndpoint(user!.id))
    },
  })
}
