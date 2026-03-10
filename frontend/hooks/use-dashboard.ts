import { DashboardMetrics } from '@/types/dashboard-metrics'
import { api, dashboardMetricsEndpoint } from '@/utils/api'
import { useQuery } from '@tanstack/react-query'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: () => api<DashboardMetrics>(dashboardMetricsEndpoint()),
  })
}
