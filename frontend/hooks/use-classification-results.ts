import { ClassificationResponse } from '@/types/classification'
import { api, getClassificationByIdEndpoint } from '@/utils/api'
import { useQuery } from '@tanstack/react-query'

export function useClassificationResults(id: string) {
  return useQuery({
    queryKey: ['classification', id],
    queryFn: () =>
      api<ClassificationResponse>(getClassificationByIdEndpoint(id)),
  })
}
