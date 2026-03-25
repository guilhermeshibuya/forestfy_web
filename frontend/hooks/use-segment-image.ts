import { SegmentationRequest } from '@/app/(dashboard)/segmentation/(types)/segmentation-request'
import { segmentImageEndpoint } from '@/utils/api'
import { useMutation } from '@tanstack/react-query'

export function useSegmentImage() {
  return useMutation({
    mutationFn: async ({ file, points }: SegmentationRequest) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('points', JSON.stringify(points))

      const response = await fetch(segmentImageEndpoint(), {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      const blob = await response.blob()
      const maskUrl = URL.createObjectURL(blob)
      const score = Number(response.headers.get('X-Score') || '0')
      return { maskUrl, score }
    },
  })
}
