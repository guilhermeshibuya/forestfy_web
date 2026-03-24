import { SpeciesImageResponse } from '@/types/species-image'
import { api, getSpeciesImagesByIdListEndpoint } from '@/utils/api'
import { useQuery } from '@tanstack/react-query'

export function useSpeciesImageByIdList(speciesIds: string[]) {
  const TIMEOUT = 1000 * 60 * 60

  return useQuery({
    enabled: speciesIds.length > 0,
    staleTime: TIMEOUT,
    queryKey: ['speciesImage', speciesIds.join(',')],
    queryFn: async () => {
      return await api<SpeciesImageResponse[]>(
        getSpeciesImagesByIdListEndpoint(),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ species_ids: speciesIds }),
        },
      )
    },
  })
}
