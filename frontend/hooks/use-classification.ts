import { ClassificationResultResponse } from '@/types/classification'
import { api, classificationEndpoint } from '@/utils/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useClassification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      return api<ClassificationResultResponse>(classificationEndpoint(), {
        method: 'POST',
        body: formData,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentActivities'] })
    },
  })
}
